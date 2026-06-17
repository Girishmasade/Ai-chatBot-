import { AsyncHandler } from "@/utils/AsyncHandler.js";
import type { AuthUser } from "../auth/auth.payload.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import { successHandler } from "@/utils/successHandler.util.js";
import { UserSubscriptionModel } from "./userSubscription.model.js";
import { calculateSubscriptionEndDate } from "./subscription.utils.js";
import mongoose from "mongoose";
import { UserSubscriptionStatus } from "@/shared/shared.types.enum.js";
import { SubscriptionPlanModel } from "./subscription.model.js";

export const createUserSubscription = AsyncHandler(async (req, res, next) => {
  try {
    const userId = (req.user as AuthUser).id;
    const planId = req.params.planId as string;

    if (!userId) {
      return errorHandler(res, 400, false, "User not Found", {});
    }

    if (!planId) {
      return errorHandler(res, 404, false, "Plan Id is Required", {});
    }

    const plan = await SubscriptionPlanModel.findById(planId);
    if (!plan || !plan.isActive) {
      return errorHandler(
        res,
        404,
        false,
        "Subscription plan not found or inactive",
        {},
      );
    }

    // one active subscription per user — not per plan
    // was: { user, plan: planId, status: "active" } — too narrow
    const existingActive = await UserSubscriptionModel.findOne({
      user: userId,
      status: UserSubscriptionStatus.ACTIVE,
    });

    if (existingActive) {
      return errorHandler(
        res,
        400,
        false,
        "User already has an active subscription. Cancel it before subscribing to a new plan.",
        {},
      );
    }

    const startDate = new Date();
    const endDate = calculateSubscriptionEndDate(
      startDate,
      plan.durationInDays,
    );

    console.log("end Date For Plans :", endDate);

    const session = await mongoose.startSession();
    let userSubscription;

    try {
      await session.withTransaction(async () => {
        const [created] = await UserSubscriptionModel.create(
          [
            {
              user: userId,
              plan: plan._id,
              status: UserSubscriptionStatus.ACTIVE,
              startDate,
              endDate,
              paymentRef: null,
              activatedAt: startDate,
            },
          ],
          { session },
        );

        // grant first cycle tokens to wallet atomically with subscription creation
        // await tokenWalletService.processSubscriptionRenewal(
        //   userId,
        //   String(created._id),
        //   {
        //     tokens: plan.tokens,
        //     rolloverEnabled: plan.rolloverEnabled,
        //     rolloverCapPercent: plan.rolloverCapPercent,
        //   },
        //   session,
        // );

        userSubscription = created;
      });
    } finally {
      await session.endSession();
    }

    return successHandler(
      res,
      201,
      true,
      "Subscription activated successfully",
      {
        userSubscription,
      },
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

// cancel user subscription plan

export const cancelSubscription = AsyncHandler(async (req, res, next) => {
  try {
    const userId = (req.user as AuthUser).id;
    const subscriptionId = req.params.subscriptionId as string;

    if (!subscriptionId) {
      return errorHandler(res, 404, false, "Subscription Id is required", {});
    }

    const subscription = await UserSubscriptionModel.findOne({
      _id: subscriptionId,
      user: userId,
    });

    if (!subscription) {
      return errorHandler(res, 404, false, "Subscription not found", {});
    }

    if (subscription.status !== UserSubscriptionStatus.ACTIVE) {
      return errorHandler(
        res,
        400,
        false,
        "Only active subscriptions can be cancelled",
        {},
      );
    }

    subscription.status = UserSubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    await subscription.save();

    return successHandler(
      res,
      200,
      true,
      "Subscription cancelled successfully",
      {
        subscription,
      },
    );
  } catch (error) {
    console.log("error to cancel the subscription plan", error);
    next(error);
  }
});
