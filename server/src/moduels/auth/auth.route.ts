import { Router } from "express";
import {  loginAccount, registerAccount } from "./auth.controller.js";
import { validate } from "../../middlewares/zod.middleware.js";
import { loginSchema, registerSchema } from "./auth.validator.js";
import { facebookCallback, facebookLogin, githubCallback, githubLogin, googleCallback, googleLogin } from "./socialmedia.auth.controller.js";

export const authRouter = Router()

authRouter.post("/register", validate(registerSchema), registerAccount)
authRouter.post("/login", validate(loginSchema), loginAccount)

// google authantication

authRouter.get("/google", googleLogin)
authRouter.get("/google/callback", googleCallback)

// github auth

authRouter.get("/auth/github", githubLogin);
authRouter.get("/auth/github/callback", githubCallback);

// facebook auth
authRouter.get("/auth/facebook", facebookLogin);
authRouter.get("/auth/facebook/callback", facebookCallback);