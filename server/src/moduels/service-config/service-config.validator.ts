import { z } from "zod";
import { AIService, ProviderName } from "./service-config.types.js";

// ─────────────────────────────────────────────

export const providerSchema = z.object({
  provider: z.nativeEnum(ProviderName, {
    error: "Invalid provider name",
  }),

  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .max(200, "Model name is too long"),

  priority: z
    .number({
     error: "Priority must be a number",
    })
    .int("Priority must be an integer")
    .min(1, "Priority must be at least 1"),

  enabled: z.boolean().default(true),

  timeout: z
    .number({
     error: "Timeout must be a number",
    })
    .int("Timeout must be an integer")
    .min(1000, "Timeout must be at least 1000ms")
    .max(60000, "Timeout cannot exceed 60000ms")
    .default(10000),

  maxRetries: z
    .number({
     error: "Max retries must be a number",
    })
    .int("Max retries must be an integer")
    .min(0, "Max retries cannot be negative")
    .max(5, "Max retries cannot exceed 5")
    .default(1)
    .optional(),

  temperature: z
    .number({
     error: "Temperature must be a number",
    })
    .min(0, "Temperature cannot be less than 0")
    .max(2, "Temperature cannot exceed 2")
    .optional(),

  maxTokens: z
    .number({
     error: "Max tokens must be a number",
    })
    .int("Max tokens must be an integer")
    .min(1, "Max tokens must be at least 1")
    .optional(),
});

// ─────────────────────────────────────────────
// Base Service Config Schema
// ─────────────────────────────────────────────

const baseServiceConfigSchema = z.object({
  service: z.nativeEnum(AIService, {
    error: "Invalid AI service",
  }),

  enabled: z.boolean().default(true),

  fallbackEnabled: z.boolean().default(true),

  cacheEnabled: z.boolean().default(true),

  rateLimitPerMinute: z
    .number({
     error: "Rate limit must be a number",
    })
    .int("Rate limit must be an integer")
    .min(1, "Rate limit must be at least 1")
    .max(10000, "Rate limit is too high")
    .default(60),

  providers: z
    .array(providerSchema)
    .min(1, "At least one provider is required"),
});

// ─────────────────────────────────────────────
// Create Service Config Schema
// ─────────────────────────────────────────────

export const createServiceConfigSchema =
  baseServiceConfigSchema.superRefine((data, ctx) => {
    // ─────────────────────────────────────────
    // Duplicate Provider Validation
    // ─────────────────────────────────────────

    const providerSet = new Set<string>();

    for (const provider of data.providers) {
      if (providerSet.has(provider.provider)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate provider '${provider.provider}' is not allowed`,
          path: ["providers"],
        });
      }

      providerSet.add(provider.provider);
    }

    // Duplicate Priority Validation

    const prioritySet = new Set<number>();

    for (const provider of data.providers) {
      if (prioritySet.has(provider.priority)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate priority '${provider.priority}' is not allowed`,
          path: ["providers"],
        });
      }

      prioritySet.add(provider.priority);
    }

    // At Least One Enabled Provider

    if (data.enabled) {
      const enabledProviders = data.providers.filter(
        (provider) => provider.enabled
      );

      if (enabledProviders.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "At least one enabled provider is required when service is enabled",
          path: ["providers"],
        });
      }
    }
  });



export const updateServiceConfigSchema =
  baseServiceConfigSchema.partial().superRefine((data, ctx) => {
    // Skip validation if providers not included
    if (!data.providers) return;

    // Duplicate Provider Validation

    const providerSet = new Set<string>();

    for (const provider of data.providers) {
      if (providerSet.has(provider.provider)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate provider '${provider.provider}' is not allowed`,
          path: ["providers"],
        });
      }

      providerSet.add(provider.provider);
    }

    // Duplicate Priority Validation

    const prioritySet = new Set<number>();

    for (const provider of data.providers) {
      if (prioritySet.has(provider.priority)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate priority '${provider.priority}' is not allowed`,
          path: ["providers"],
        });
      }

      prioritySet.add(provider.priority);
    }

    // At Least One Enabled Provider

    const enabledProviders = data.providers.filter(
      (provider) => provider.enabled
    );

    if (enabledProviders.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one enabled provider is required",
        path: ["providers"],
      });
    }
  });


export type CreateServiceConfigInput = z.infer<
  typeof createServiceConfigSchema
>;

export type UpdateServiceConfigInput = z.infer<
  typeof updateServiceConfigSchema
>;