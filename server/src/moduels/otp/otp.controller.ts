import type { Request, Response, NextFunction } from "express";
import redisClient from "../../config/redis.config.js";
import { successHandler } from "../../utils/successHandler.util.js";
import crypto from "crypto";
import { AuthModel } from "../auth/auth.models.js";
import type { SendOTPInput, VerifyOTPInput } from "./otp.validator.js";
import { sendEmail } from "../../services/mailer.utils.js";
import { errorHandler } from "../../utils/errorHandler.util.js";

// redis keys

const OTP_PREFIX = "otp:";
const OTP_TTL = 200;
const MAX_RETRIES = 3;
const RETRY_PREFIX = "otp:retries:";
const RETRY_TTL = 200;

// crypto js for generate otp

const generateOTP = (): string => {
  // generates a cryptographically secure 6-digit OTP
  return crypto.randomInt(100000, 999999).toString(); // 100000 - 999999 range of 6 digits
};

// The function to send otp */*/*/*/*/*

export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return successHandler(res, 400, false, "Email is required", {});
    }

    const user = await AuthModel.findOne({ email });

    if (!user) {
      return successHandler(res, 404, false, "User not found", {});
    }

    const retries = await redisClient.get(`${RETRY_PREFIX}${email}`);

    console.log("retries : ", retries);

    if (retries && parseInt(retries) >= MAX_RETRIES) {
      return successHandler(
        res,
        429,
        false,
        "Too many requests, please try again later",
        {},
      );
    }

    const otp = generateOTP();

    console.log("otp : ", otp);

    await redisClient.setEx(`${OTP_PREFIX}${email}`, OTP_TTL, otp); // using redis set ex to store otp with ttl
    await redisClient.incr(`${RETRY_PREFIX}${email}`); // using redis incr to increment the retry count
    await redisClient.expire(`${RETRY_PREFIX}${email}`, RETRY_TTL); // using redis expire to set the ttl for the retry count

    const send = await sendEmail({
      to: email,
      type: "otp",
      payload: { otp, username: user.username },
    });

    console.log("send : ", send);

    successHandler(res, 200, true, "OTP sent to your email.", {});
  } catch (error) {
    console.log("error to send otp : ,", error);
    errorHandler(res, 500, false, "Internal server error", error);
    next();
  }
};

// The function to verify otp */*/*/*/*/*

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body as VerifyOTPInput;

    if (!email || !otp) {
      return successHandler(res, 400, false, "Email is required", {});
    }

    const storedOTP = await redisClient.get(`${OTP_PREFIX}${email}`);

    console.log("stored otp : ", storedOTP);

    if (!storedOTP) {
      return successHandler(res, 400, false, "OTP is invalid or expired", {});
    }

    // constant time comparison — prevents timing attacks
    const isValid = crypto.timingSafeEqual(
      // timingSafeEqual is used to compare two buffers in constant time
      Buffer.from(storedOTP),
      Buffer.from(otp),
    );

    if (!isValid) {
      return successHandler(res, 400, false, "OTP is invalid or expired", {});
    }

    const user = await AuthModel.findOneAndUpdate(
      { email },
      { $set: { isVerified: true } },
    );

    console.log("user : ", user);

    // now clear the redis

    await redisClient.del(`${OTP_PREFIX}${email}`);
    await redisClient.del(`${RETRY_PREFIX}${email}`);

    successHandler(res, 200, true, "Email verified successfully.", {});
  } catch (error) {
    console.error("error to verify otp : ", error);
    next(error);
  }
};

// The function to resend otp */*/*/*/*/*

export const resendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body as SendOTPInput;

    if (!email) {
      return successHandler(res, 400, false, "Email is required", {});
    }

    const user = await AuthModel.findOne({ email });

    if (!user) {
      return successHandler(res, 404, false, "User not found", {});
    }

    if (user.isVerified) {
      successHandler(res, 400, false, "Email is already verified.", {});
      return;
    }

    const retries = await redisClient.get(`${RETRY_PREFIX}${email}`);

    console.log("retries : ", retries);

    if(retries && parseInt(retries) >= MAX_RETRIES){
      return successHandler(res, 429, false, "Too many requests, please try again later", {});
    }

    const otp = generateOTP();

    console.log("otp : ", otp);

    await redisClient.setEx(`${OTP_PREFIX}${email}`, OTP_TTL, otp);
    await redisClient.incr(`${RETRY_PREFIX}${email}`);
    await redisClient.expire(`${RETRY_PREFIX}${email}`, RETRY_TTL);

    const resend = await sendEmail({
      to: email,
      type: "otp",
      payload: { otp, username: user.username },
    });

    console.log("resend : ", resend);

    successHandler(res, 200, true, "OTP sent to your email.", {});


  } catch (error) {
    console.error("error in the resend otp :", error);
    next();
  }
};
