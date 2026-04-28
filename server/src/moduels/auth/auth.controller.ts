import type { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { AuthModel } from "./auth.models.js";
import redisClient from "../../config/redis.config.js";
import { sendEmail } from "../../services/mailer.utils.js";
import { successHandler } from "../../utils/successHandler.util.js";
import type { LoginInput, RegisterInput } from "./auth.types.js";
import { errorHandler } from "../../utils/errorHandler.util.js";
import passport from "passport";
import { jwtSecret, jwtExpiry } from "../../env/env.import.js";
import jwt, { type SignOptions } from "jsonwebtoken";

const OTP_PREFIX = "otp:";
const OTP_TTL = 200;
const RETRY_PREFIX = "otp:retries:";
const RETRY_TTL = 200;

interface JwtPayload {
  userId: string;
  email?: string;
  username?: string;
  avatar?: string;
}

const generateOTP = (): string => crypto.randomInt(100000, 999999).toString();

// ── Register

export const registerAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email } = req.body as RegisterInput;

    const existingUser = await AuthModel.findOne({ email });
    if (existingUser) {
      successHandler(res, 409, false, "Email already registered.", {});
      return;
    }

    const newUser = await AuthModel.create({
      username,
      email,
      isVerified: false,
    });

    console.log("new user : ", newUser);

    const otp = generateOTP();
    await redisClient.setEx(`${OTP_PREFIX}${email}`, OTP_TTL, otp);
    await redisClient.incr(`${RETRY_PREFIX}${email}`);
    await redisClient.expire(`${RETRY_PREFIX}${email}`, RETRY_TTL);

    const sendotp = await sendEmail({
      to: email,
      type: "otp",
      payload: { otp, username: newUser.username },
    });

    console.log("sendotp :", sendotp);

    successHandler(res, 201, true, "Account created. OTP sent to your email.", {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isVerified: newUser.isVerified,
    });
  } catch (error) {
    console.log("error to register Account :", error);
    next(error);
  }
};

// Login OTP

export const loginAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body as LoginInput;

    if (!email) {
      return errorHandler(res, 400, false, "Email is required", {});
    }

    const isUserExists = await AuthModel.findOne({ email });

    if (!isUserExists?.isVerified) {
      return errorHandler(res, 400, false, "User is not verified", {});
    }

    // track login attempts
    const loginAttempts = await redisClient.get(`login:attempts:${email}`);

    if (loginAttempts && parseInt(loginAttempts) >= 3) {
      return errorHandler(
        res,
        400,
        false,
        "Too many attempts. Please try again later.",
        {},
      );
    }

    // track retries
    const retries = await redisClient.get(`${RETRY_PREFIX}${email}`);

    if (retries && parseInt(retries) >= 5) {
      return errorHandler(
        res,
        400,
        false,
        "Too many attempts. Please try again later.",
        {},
      );
    }

    const otp = generateOTP();

    await redisClient.setEx(`${OTP_PREFIX}${email}`, OTP_TTL, otp);
    await redisClient.incr(`${RETRY_PREFIX}${email}`);
    await redisClient.expire(`${RETRY_PREFIX}${email}`, RETRY_TTL);

    // track login attempts
    await redisClient.incr(`login:attempts:${email}`);
    await redisClient.expire(`login:attempts:${email}`, 60 * 60); // 1 hour

    const sendotp = await sendEmail({
      to: email,
      type: "otp",
      payload: { otp, username: isUserExists.username },
    });

    console.log("sendotp :", sendotp);

    successHandler(res, 200, true, "OTP sent to your email.", {});
  } catch (error) {
    console.log("error to login Account :", error);
    next(error);
  }
};

// google login

export const googleLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })(req, res, next);
};

// google callback url

export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/signin" },
    (err, user) => {
      if (err || !user) return res.redirect("/signin");

      // Generate JWT
      const payload: JwtPayload = {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      };

      const options: SignOptions = {
        // it's used for the jwt token signOptions
        expiresIn: jwtExpiry as SignOptions["expiresIn"],
      };

      const token = jwt.sign(payload, jwtSecret as string, options);

      return res.redirect(
        `${process.env.FRONTEND_URL}/oauth-success?token=${token}`,
      );
    },
  )(req, res, next);
};

// logout

export const logoutAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    console.log("error to logout Account :", error);
    next(error);
  }
};
