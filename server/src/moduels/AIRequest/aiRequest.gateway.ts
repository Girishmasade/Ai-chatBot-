import { ProviderName } from "../Provider/provider-config.types.js";
import { AIService } from "../service-config/service-config.types.js";
import {
  PROVIDER_BASE_URLS,
  PROVIDER_TIMEOUT_MS,
  DEFAULT_PROVIDER_TIMEOUT_MS,
  CHARS_PER_TOKEN,
  COMPLETION_TOKEN_ESTIMATE_RATIO,
} from "./aiRequest.constant.js";

// ─────────────────────────────────────────────────────────────────────────────
// Contracts
// ─────────────────────────────────────────────────────────────────────────────

export interface IConversationMessage {
  role:    "user" | "assistant" | "system";
  content: string;
}

export interface IProviderRequestPayload {
  model:               string;
  prompt:              string;
  systemPrompt?:       string;
  conversationHistory?: IConversationMessage[];
  maxTokens?:          number;
  temperature?:        number;
  parameters?: {
    // Chat / Vision
    topP?:             number;
    frequencyPenalty?: number;
    presencePenalty?:  number;
    // Vision
    imageUrl?:         string;
    // Image generation
    size?:    "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792";
    quality?: "standard" | "hd";
    style?:   "vivid" | "natural";
    n?:       number;
    // Passthrough — any provider-specific extras
    [key: string]: unknown;
  };
}

export interface IProviderUsage {
  promptTokens:     number;
  completionTokens: number;
  totalTokens:      number;
}

export interface IProviderResponse {
  success:            boolean;
  content?:           string;           // text response (CHAT, PROMPT_GEN, etc.)
  imageUrls?:         string[];         // IMAGE_GEN / ASSET_GEN
  embeddingVector?:   number[];         // EMBEDDING (stored in metadata if needed)
  providerRequestId?: string;
  usage:              IProviderUsage;
  latencyMs:          number;
  error?: {
    code:    string;
    message: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function getTimeout(service: string): number {
  return PROVIDER_TIMEOUT_MS[service] ?? DEFAULT_PROVIDER_TIMEOUT_MS;
}

function emptyUsage(): IProviderUsage {
  return { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
}

function errorResponse(
  code: string,
  message: string,
  latencyMs: number
): IProviderResponse {
  return { success: false, usage: emptyUsage(), latencyMs, error: { code, message } };
}

function classifyFetchError(err: any): { code: string; message: string } {
  if (err?.name === "TimeoutError" || err?.name === "AbortError") {
    return { code: "TIMEOUT", message: "Provider request timed out." };
  }
  return {
    code:    "PROVIDER_API_ERROR",
    message: err?.message ?? "Unknown provider error.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// OpenAI Adapter
// Reused for GROK and DEEPSEEK with a different baseUrl.
// ─────────────────────────────────────────────────────────────────────────────

async function callOpenAI(
  apiKey:  string,
  payload: IProviderRequestPayload,
  service: string,
  baseUrl  = "https://api.openai.com/v1"
): Promise<IProviderResponse> {
  const startTime = Date.now();

  try {
    const timeout = getTimeout(service);

    // ── Image generation ──────────────────────────────────────────────────────

    if (service === AIService.IMAGE_GEN || service === AIService.ASSET_GEN) {
      const body: Record<string, unknown> = {
        model:  payload.model,
        prompt: payload.prompt,
        n:      payload.parameters?.n       ?? 1,
        size:   payload.parameters?.size    ?? "1024x1024",
      };
      if (payload.parameters?.quality) body.quality = payload.parameters.quality;
      if (payload.parameters?.style)   body.style   = payload.parameters.style;

      const res  = await fetch(`${baseUrl}/images/generations`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body:    JSON.stringify(body),
        signal:  AbortSignal.timeout(timeout),
      });

      const data = await res.json() as any;

      if (!res.ok) {
        return errorResponse(
          "PROVIDER_API_ERROR",
          data?.error?.message ?? "Image generation failed.",
          Date.now() - startTime
        );
      }

      return {
        success:            true,
        imageUrls:          (data.data as any[]).map((d) => d.url as string),
        providerRequestId:  String(data.created ?? ""),
        usage:              emptyUsage(), // OpenAI image API doesn't return token counts
        latencyMs:          Date.now() - startTime,
      };
    }

    // ── Chat / Vision / PROMPT_GEN / BUSINESS_IDEAS ───────────────────────────

    const messages: { role: string; content: any }[] = [];

    if (payload.systemPrompt) {
      messages.push({ role: "system", content: payload.systemPrompt });
    }

    if (payload.conversationHistory?.length) {
      for (const msg of payload.conversationHistory) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    // Vision: content is an array of image_url + text parts
    if (payload.parameters?.imageUrl) {
      messages.push({
        role: "user",
        content: [
          { type: "image_url", image_url: { url: payload.parameters.imageUrl } },
          { type: "text",      text: payload.prompt },
        ],
      });
    } else {
      messages.push({ role: "user", content: payload.prompt });
    }

    const body: Record<string, unknown> = {
      model:    payload.model,
      messages,
    };

    if (payload.maxTokens  !== undefined) body.max_tokens        = payload.maxTokens;
    if (payload.temperature !== undefined) body.temperature      = payload.temperature;
    if (payload.parameters?.topP             !== undefined) body.top_p             = payload.parameters.topP;
    if (payload.parameters?.frequencyPenalty !== undefined) body.frequency_penalty = payload.parameters.frequencyPenalty;
    if (payload.parameters?.presencePenalty  !== undefined) body.presence_penalty  = payload.parameters.presencePenalty;

    const res  = await fetch(`${baseUrl}/chat/completions`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(timeout),
    });

    const data = await res.json() as any;

    if (!res.ok) {
      return errorResponse(
        "PROVIDER_API_ERROR",
        data?.error?.message ?? "Chat completion failed.",
        Date.now() - startTime
      );
    }

    return {
      success:           true,
      content:           data.choices?.[0]?.message?.content ?? "",
      providerRequestId: data.id,
      usage: {
        promptTokens:     data.usage?.prompt_tokens     ?? 0,
        completionTokens: data.usage?.completion_tokens ?? 0,
        totalTokens:      data.usage?.total_tokens      ?? 0,
      },
      latencyMs: Date.now() - startTime,
    };
  } catch (err: any) {
    return errorResponse(
      classifyFetchError(err).code,
      classifyFetchError(err).message,
      Date.now() - startTime
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Anthropic Adapter
// ─────────────────────────────────────────────────────────────────────────────

async function callAnthropic(
  apiKey:  string,
  payload: IProviderRequestPayload,
  service: string
): Promise<IProviderResponse> {
  const startTime = Date.now();

  try {
    const timeout  = getTimeout(service);
    const messages: { role: string; content: string }[] = [];

    // Anthropic does not accept "system" role in the messages array —
    // it goes in the top-level `system` field instead.
    if (payload.conversationHistory?.length) {
      for (const msg of payload.conversationHistory) {
        if (msg.role === "system") continue;
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: "user", content: payload.prompt });

    const body: Record<string, unknown> = {
      model:      payload.model,
      max_tokens: payload.maxTokens ?? 4_096,
      messages,
    };

    if (payload.systemPrompt)             body.system      = payload.systemPrompt;
    if (payload.temperature !== undefined) body.temperature = payload.temperature;

    const res  = await fetch("https://api.anthropic.com/v1/messages", {
      method:  "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
      },
      body:   JSON.stringify(body),
      signal: AbortSignal.timeout(timeout),
    });

    const data = await res.json() as any;

    if (!res.ok) {
      return errorResponse(
        "PROVIDER_API_ERROR",
        data?.error?.message ?? "Anthropic request failed.",
        Date.now() - startTime
      );
    }

    // Anthropic content is an array of typed blocks — extract all text blocks
    const content = (data.content as any[])
      ?.filter((b) => b.type === "text")
      .map((b) => b.text as string)
      .join("") ?? "";

    const promptTokens     = data.usage?.input_tokens  ?? 0;
    const completionTokens = data.usage?.output_tokens ?? 0;

    return {
      success:           true,
      content,
      providerRequestId: data.id,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      latencyMs: Date.now() - startTime,
    };
  } catch (err: any) {
    return errorResponse(
      classifyFetchError(err).code,
      classifyFetchError(err).message,
      Date.now() - startTime
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Gemini Adapter
// ─────────────────────────────────────────────────────────────────────────────

async function callGemini(
  apiKey:  string,
  payload: IProviderRequestPayload,
  service: string
): Promise<IProviderResponse> {
  const startTime = Date.now();

  try {
    const timeout = getTimeout(service);
    const url     = `https://generativelanguage.googleapis.com/v1beta/models/${payload.model}:generateContent?key=${apiKey}`;

    // Gemini uses "model" role for assistant turns (not "assistant")
    const contents: { role: string; parts: { text: string }[] }[] = [];

    if (payload.conversationHistory?.length) {
      for (const msg of payload.conversationHistory) {
        if (msg.role === "system") continue; // handled via systemInstruction
        contents.push({
          role:  msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }

    contents.push({ role: "user", parts: [{ text: payload.prompt }] });

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        maxOutputTokens: payload.maxTokens ?? 4_096,
        ...(payload.temperature !== undefined && { temperature: payload.temperature }),
      },
    };

    if (payload.systemPrompt) {
      body.systemInstruction = { parts: [{ text: payload.systemPrompt }] };
    }

    const res  = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(timeout),
    });

    const data = await res.json() as any;

    if (!res.ok) {
      return errorResponse(
        "PROVIDER_API_ERROR",
        data?.error?.message ?? "Gemini request failed.",
        Date.now() - startTime
      );
    }

    const text             = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const promptTokens     = data.usageMetadata?.promptTokenCount      ?? 0;
    const completionTokens = data.usageMetadata?.candidatesTokenCount  ?? 0;

    return {
      success:           true,
      content:           text,
      providerRequestId: String(data.candidates?.[0]?.index ?? ""),
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      latencyMs: Date.now() - startTime,
    };
  } catch (err: any) {
    return errorResponse(
      classifyFetchError(err).code,
      classifyFetchError(err).message,
      Date.now() - startTime
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider Gateway  —  public dispatch function
//
// Routing logic:
//   OPENAI    → native OpenAI adapter (api.openai.com)
//   ANTHROPIC → Anthropic adapter    (api.anthropic.com)
//   GEMINI    → Gemini adapter       (generativelanguage.googleapis.com)
//   GROK      → OpenAI adapter       (api.x.ai/v1)
//   DEEPSEEK  → OpenAI adapter       (api.deepseek.com/v1)
//
// Grok and DeepSeek are OpenAI-compatible REST endpoints — they accept the
// exact same request/response shape as the OpenAI Chat Completions API, so
// reusing the OpenAI adapter with a different baseUrl is correct and avoids
// duplicating identical adapter logic.
// ─────────────────────────────────────────────────────────────────────────────

export async function executeProviderRequest(
  providerName: string,
  apiKey:        string,
  payload:       IProviderRequestPayload,
  service:       string
): Promise<IProviderResponse> {
  console.log(
    `[Gateway] Dispatching — provider: ${providerName}, service: ${service}, model: ${payload.model}`
  );

  switch (providerName as ProviderName) {
    case ProviderName.OPENAI:
      return callOpenAI(apiKey, payload, service);

    case ProviderName.ANTHROPIC:
      return callAnthropic(apiKey, payload, service);

    case ProviderName.GEMINI:
      return callGemini(apiKey, payload, service);

    case ProviderName.GROK:
      return callOpenAI(apiKey, payload, service, PROVIDER_BASE_URLS.GROK);

    case ProviderName.DEEPSEEK:
      return callOpenAI(apiKey, payload, service, PROVIDER_BASE_URLS.DEEPSEEK);

    default:
      console.error(`[Gateway] Unknown provider: ${providerName}`);
      return errorResponse(
        "PROVIDER_UNAVAILABLE",
        `Provider "${providerName}" is not supported.`,
        0
      );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Token Estimation Utilities
// Exported for use in the controller's pre-call balance check and
// the /estimate endpoint. Never used for actual billing.
// ─────────────────────────────────────────────────────────────────────────────

export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export function estimateTotalTokens(
  prompt:              string,
  systemPrompt?:       string,
  conversationHistory?: IConversationMessage[]
): number {
  let inputTokens = estimateTokenCount(prompt);

  if (systemPrompt) {
    inputTokens += estimateTokenCount(systemPrompt);
  }

  if (conversationHistory?.length) {
    for (const msg of conversationHistory) {
      inputTokens += estimateTokenCount(msg.content);
    }
  }

  // Add an estimated completion budget on top of input tokens
  const completionEstimate = Math.ceil(inputTokens * COMPLETION_TOKEN_ESTIMATE_RATIO);
  return inputTokens + completionEstimate;
}
