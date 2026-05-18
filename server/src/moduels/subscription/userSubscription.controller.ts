import { AsyncHandler } from "@/utils/AsyncHandler.js";
import type { AuthUser } from "../auth/auth.payload.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import { successHandler } from "@/utils/successHandler.util.js";
import { UserSubscriptionModel } from "./userSubscription.model.js";
import { createEndDateForSubscription } from "./subscription.utils.js";
import mongoose from "mongoose";

export const createUserSubscription = AsyncHandler(async (req, res, next) => {
  try {
    const userId = (req.user as AuthUser).id;

    if (!userId) {
      return errorHandler(res, 400, false, "User not Found", {});
    }

    const planId = req.params.planId as string;

    if (!planId) {
      return errorHandler(res, 404, false, "Plan Id is Required", {});
    }

    const existingPlan = await UserSubscriptionModel.findOne({
      user: userId,
      plan: planId,
      status: "active",
    });

    if (existingPlan) {
      return errorHandler(
        res,
        400,
        false,
        "User already have this subscription",
        {},
      );
    }

    const endDateForPlans = createEndDateForSubscription({
      startDate: new Date().toISOString(),
      plan: req.body.plan as string,
      customEndDate: req.body.customEndDate,
    });

    console.log("end Date For Plans :", endDateForPlans);

    const createPlan = await UserSubscriptionModel.create({
      user: userId,
      plan: planId,
      startDate: new Date(),
      endDate: endDateForPlans,
      paymentRef: null,
      status: "active",
      activatedAt: new Date(),
    });

    console.log("create Plan :", createPlan);

    return successHandler(
      res,
      201,
      true,
      "User Subscription created successfully",
      { createPlan },
    );
  } catch (error) {
    console.log("error to create user subscription :", error);
    next(error);
  }
});

// get user subscription plan

export const getSubscription = AsyncHandler(async (req, res, next) => {
  try {
    const userId = (req.user as AuthUser).id;

    const subscriptionId = req.params.planId as string;

    if (!subscriptionId) {
      return errorHandler(res, 404, false, "Subscription Id is Required", {});
    }

    const getSub = await UserSubscriptionModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(subscriptionId),
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "auths",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "payments",
          localField: "paymentRef",
          foreignField: "_id",
          as: "payment",
        },
      },
      { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          user: 1,
          plan: 1,
          payment: 1,
          status: 1,
          startDate: {
            $dateToString: { format: "%d-%m-%Y %H:%M", date: "$startDate" },
          },
          endDate: {
            $cond: {
              if: { $eq: ["$endDate", null] },
              then: "Never expires",
              else: {
                $dateToString: {
                  format: "%d-%m-%Y %H:%M",
                  date: "$endDate",
                },
              },
            },
          },
          activatedAt: {
            $dateToString: {
              format: "%d-%m-%Y %H:%M",
              date: "$activatedAt",
            },
          },
          cancelledAt: {
            $dateToString: {
              format: "%d-%m-%Y %H:%M",
              date: "$cancelledAt",
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    console.log("get subs :", getSub);

    if (!getSub || getSub.length === 0) {
      return errorHandler(res, 404, false, "Subscription not found", {});
    }

    return successHandler(res, 200, true, "Subscription fetched successfully", {
      getSub,
    });
  } catch (error) {
    console.log("error to get the subscription :", error);
    next(error);
  }
});