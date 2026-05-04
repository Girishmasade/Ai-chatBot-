import type { Request, Response, NextFunction } from "express";
import { AuthModel } from "../auth/auth.models.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import { successHandler } from "@/utils/successHandler.util.js";
import type { AuthUser } from "../auth/auth.payload.js";

// get user Profile

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req.user as AuthUser).id;

    if (!userId) {
      return errorHandler(res, 404, false, "userId is required", {});
    }

    const user = await AuthModel.findById({_id: userId});

    // console.log("user Details :", user)

    if (!user) {
      return errorHandler(res, 404, false, "user Not Found", {});
    }

    return successHandler(res, 200, true, "Here are you're Details", {user})


  } catch (error) {
    console.error("error in get user profile :", error)
    next(error)
  }
};

// update user profile

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    if (!req.user) {
  return next(new Error("Unauthorized"));
}

    const userId = (req.user as AuthUser).id;
    const {...data} = req.body;

    if (!userId) {
        return errorHandler(res, 404, false, "User Id is required", {})
    }

    const updateData = await AuthModel.findByIdAndUpdate({_id: userId}, data).select("avatar")

    console.log("userData :", updateData)

    if (!updateData) {
        return  errorHandler(res, 404, false, "User Not Found", {})
    }

    return successHandler(res, 201, true, "Profile Updated Succesfully", {data})

  } catch (error) {
    console.error("error to update profile :", error);
    next(error)
  }
};

// update user avatar

export const updateUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req.user as AuthUser).id
    const {avatar} = req.body

     if (!userId) {
        return errorHandler(res, 404, false, "User Id is required", {})
    }

    

  } catch (error) {}
};

// delete user profile

export const deleteUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {}
};
