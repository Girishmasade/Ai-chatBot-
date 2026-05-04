import { Router } from "express";
import { authRouter } from "../moduels/auth/auth.route.js";
import { otpRouter } from "../moduels/otp/otp.route.js";
import { userRouter } from "@/moduels/user/user.route.js";

export const RouterFile = Router()

RouterFile.use("/auth", authRouter)
RouterFile.use("/otp", otpRouter)
RouterFile.use("/user", userRouter)
