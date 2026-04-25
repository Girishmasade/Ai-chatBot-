import { z } from "zod";

export const authSchema = z.object({
  username: z.string().trim().min(6, "Username must be at least 6 characters"),

  avatar: z.string().url("Invalid avatar URL").optional(),

  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  role: z.enum(["user", "admin"]).default("user"),

  isAdmin: z.boolean().default(false),

  isVerified: z.boolean().default(false),
});

//  Derived schemas 

// POST /auth/register 
export const registerSchema = authSchema.pick({
  username: true,
  email: true,
  password: true,
  avatar: true,        // optional field — still optional here
});

/** POST /auth/login */
export const loginSchema = authSchema.pick({
  email: true,
  password: true,
});

/** PATCH /auth/update-profile */
export const updateProfileSchema = authSchema
  .pick({
    username: true,
    avatar: true,
  })
  .partial(); // all fields optional for PATCH

/** PATCH /admin/update-role  (admin only) */
export const updateRoleSchema = z.object({
  role: z.enum(["user", "admin"]),
  isAdmin: z.boolean(),
});

/** POST /auth/change-password */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });