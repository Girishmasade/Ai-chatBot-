import { Router } from "express";
import { loginAccount, registerAccount } from "./auth.controller.js";
import { validate } from "../../middlewares/zod.middleware.js";
import { loginSchema, registerSchema } from "./auth.validator.js";

export const authRouter = Router()

authRouter.post("/register", validate(registerSchema), registerAccount)
authRouter.post("/login", validate(loginSchema), loginAccount)