import { z } from "zod";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateRoleSchema,
  changePasswordSchema,
} from "../moduels/auth.models.js";

export type RegisterInput      = z.infer<typeof registerSchema>;
export type LoginInput         = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateRoleInput    = z.infer<typeof updateRoleSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;