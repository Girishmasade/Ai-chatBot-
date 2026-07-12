import { ModerationCategory } from "@/moduels/moderation/moderation.type.js";

export const BLOCKED_CATEGORIES: ModerationCategory[] = [
  ModerationCategory.SEXUAL,
  ModerationCategory.SEXUAL_MINORS,
  ModerationCategory.HATE,
  ModerationCategory.HATE_THREATENING,
  ModerationCategory.HARASSMENT_THREATENING,
  ModerationCategory.SELF_HARM_INTENT,
  ModerationCategory.SELF_HARM_INSTRUCTIONS,
  ModerationCategory.VIOLENCE_GRAPHIC,
];
 

export const MODERATION_BLOCKED_MESSAGE =
  'Your message could not be processed because it appears to violate our content policy. Please rephrase your request.';
 
export const OPENAI_MODERATION_API_URL = 'https://api.openai.com/v1/moderations';
