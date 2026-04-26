import type { z } from "zod";
import type {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateRoleSchema,
} from "./auth.validator.js";

// z.infer is used to infer the type of the schema

export type RegisterInput = z.infer<typeof registerSchema>; 
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;