import type { z } from "zod";
import type {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateRoleSchema,
  changePasswordSchema,
} from "./auth.validator.js";  

export type RegisterInput       = z.infer<typeof registerSchema>;
export type LoginInput          = z.infer<typeof loginSchema>;
export type UpdateProfileInput  = z.infer<typeof updateProfileSchema>;
export type UpdateRoleInput     = z.infer<typeof updateRoleSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;