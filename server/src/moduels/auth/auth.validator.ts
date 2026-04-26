import { z } from "zod";

export const authSchema = z.object({
  username: z.string().trim().min(6, "Username must be at least 6 characters"),
  avatar:   z.string().url("Invalid avatar URL").optional(),
  email:    z.string().email("Invalid email address").toLowerCase(),
  role:     z.enum(["user", "admin"]).default("user"),
  isVerified: z.boolean().default(false),
});

export const registerSchema = authSchema.pick({
  username: true,
  email: true,
});

export const loginSchema = authSchema.pick({
  email: true,
});

export const updateProfileSchema = authSchema
  .pick({ username: true, avatar: true })
  .partial();

export const updateRoleSchema = z.object({
  role:    z.enum(["user", "admin"]),
});
