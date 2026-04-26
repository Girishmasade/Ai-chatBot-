import { Router } from "express";
import { resendOTP, sendOTP, verifyOTP } from "./otp.controller.js";
import { validate } from "../../middlewares/zod.middleware.js";
import { verifyOTPSchema, sendOTPSchema } from "./otp.validator.js";

export const otpRouter = Router()

otpRouter.post("/send", validate(sendOTPSchema), sendOTP)
otpRouter.post("/verify", validate(verifyOTPSchema), verifyOTP);
otpRouter.post("/resend", validate(sendOTPSchema), resendOTP);