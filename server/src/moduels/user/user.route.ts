import { Router } from "express";
import { getUserProfile, updateUserProfile } from "./user.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";

export const userRouter = Router()

userRouter.get("/get-profile/:userId", authMiddleware, getUserProfile)
userRouter.put("/update-profile/:userId", authMiddleware, updateUserProfile)

