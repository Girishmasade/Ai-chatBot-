import { Types } from 'mongoose';
import { ApiError } from '@/utils/apiError.util.js';
import {
  type ModerationResult,
  type ModerationCheckInput,
} from '@/moduels/moderation/moderation.interface.js';
import { ModerationCategory } from "@/moduels/moderation/moderation.type.js";
import {
  BLOCKED_CATEGORIES,
  MODERATION_BLOCKED_MESSAGE,
  OPENAI_MODERATION_API_URL
} from '@/config/moderation.config.js';
import { ModerationLogModel, ModerationBlocklistModel } from '@/moduels/moderation/moderation.model.js';


async function checkCustomBlocklist(text: string): Promise<string | undefined> {
  const lowerText = text.toLowerCase();
  const entries = await ModerationBlocklistModel.find().select('term').lean();
  for (const entry of entries) {
    if (lowerText.includes(entry.term)) {
      return entry.term;
    }
  }
  return undefined;
}

async function callOpenAiModeration(text: string): Promise<{
  flagged: boolean;
  categories: Partial<Record<ModerationCategory, boolean>>;
  categoryScores: Partial<Record<ModerationCategory, number>>;
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set — required for content moderation');
  }

  const response = await fetch(OPENAI_MODERATION_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: text }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(502, `Moderation API error (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  const result = data.results?.[0];

  if (!result) {
    throw new ApiError(502, 'Moderation API returned no result');
  }

  return {
    flagged: result.flagged,
    categories: result.categories,
    categoryScores: result.category_scores,
  };
}


export async function moderateText(text: string): Promise<ModerationResult> {
  const customMatch = await checkCustomBlocklist(text);
  if (customMatch) {
    return {
      flagged: true,
      categories: {},
      categoryScores: {},
      matchedCustomBlocklistTerm: customMatch,
    };
  }

  const openAiResult = await callOpenAiModeration(text);

  const triggeredBlockedCategory = BLOCKED_CATEGORIES.some((cat) => openAiResult.categories[cat]);

  return {
    flagged: triggeredBlockedCategory,
    categories: openAiResult.categories,
    categoryScores: openAiResult.categoryScores,
  };
}


export async function moderateOrThrow(input: ModerationCheckInput): Promise<void> {
  const result = await moderateText(input.text);

  if (!result.flagged) return;

  const flaggedCategories = Object.entries(result.categories)
    .filter(([, isFlagged]) => isFlagged)
    .map(([category]) => category as ModerationCategory);

  await ModerationLogModel.create({
    userId: new Types.ObjectId(input.userId),
    sourceModule: input.sourceModule,
    promptExcerpt: input.text.slice(0, 300),
    flaggedCategories,
    matchedCustomBlocklistTerm: result.matchedCustomBlocklistTerm,
  });

  throw new ApiError(400, MODERATION_BLOCKED_MESSAGE);
}


export async function listBlocklistTerms(): Promise<Array<{ id: string; term: string; createdAt: Date }>> {
  const entries = await ModerationBlocklistModel.find().sort({ createdAt: -1 });
  return entries.map((e) => ({ id: e._id.toString(), term: e.term, createdAt: e.createdAt }));
}

export async function addBlocklistTerm(term: string, addedBy: Types.ObjectId): Promise<{ id: string; term: string }> {
  const normalized = term.trim().toLowerCase();
  if (!normalized) {
    throw new ApiError(400, 'Term cannot be empty');
  }

  const existing = await ModerationBlocklistModel.findOne({ term: normalized });
  if (existing) {
    throw new ApiError(409, 'This term is already on the blocklist');
  }

  const entry = await ModerationBlocklistModel.create({ term: normalized, addedBy });
  return { id: entry._id.toString(), term: entry.term };
}

export async function removeBlocklistTerm(id: string): Promise<void> {
  const result = await ModerationBlocklistModel.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(404, 'Blocklist entry not found');
  }
}

export async function listModerationLogs(
  page: number,
  limit: number,
): Promise<{ items: Array<Record<string, unknown>>; total: number }> {
  const [items, total] = await Promise.all([
    ModerationLogModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ModerationLogModel.countDocuments(),
  ]);
  return { items, total };
}