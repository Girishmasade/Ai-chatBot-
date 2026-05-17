import { AsyncHandler } from "@/utils/AsyncHandler.js";
import type { AuthUser } from "../auth/auth.payload.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import { SubscriptionPlanModel } from "./subscription.model.js";
import { successHandler } from "@/utils/successHandler.util.js";
import type { CreateSubInput, UpdateSubInput } from "./subscription.types.js";

// Admin create Subscription function

export const createSubscription = AsyncHandler(async (req, res, next) => {
  try {
    const AdminId = (req.user as AuthUser).id;

    if (!AdminId) {
      return errorHandler(res, 404, false, "Admin not found", {});
    }

    const { name, plan, price, description, services, isActive, createdBy } =
      req.body as CreateSubInput;

    if (
      !name ||
      !plan ||
      price === undefined ||
      !description ||
      !services ||
      isActive === undefined ||
      !createdBy
    ) {
      return errorHandler(res, 400, false, "All fields are required", {});
    }

    const createSubscription = await SubscriptionPlanModel.create({
      name,
      plan,
      price,
      description,
      services,
      isActive,
      createdBy: AdminId,
    });

    console.log("create Subscription :", createSubscription);

    if (!createSubscription) {
      return errorHandler(res, 400, false, "Subscription plan not created", {});
    }

    if (createSubscription) {
      return errorHandler(
        res,
        400,
        false,
        "Subscription plan already exist",
        {},
      );
    }

    return successHandler(res, 200, true, "Subscription Created Successfully", {
      createSubscription,
    });
  } catch (error) {
    console.log("error to create Subscription :", error);
    next(error);
  }
});

// admin get the Subscription plan for user

export const getSubscriptionForUser = AsyncHandler(async (req, res, next) => {
  try {
    const subscriptionPlan = await SubscriptionPlanModel.find({
      isActive: true,
    });

    console.log("subscription Plan :", subscriptionPlan);

    if (!subscriptionPlan) {
      return errorHandler(res, 404, false, "Subscription Plan not Found", {});
    }

    return successHandler(
      res,
      200,
      true,
      "Subscription Plan Fetched Successfully",
      { subscriptionPlan },
    );
  } catch (error) {
    console.log("error to get Subscription :", error);
    next(error);
  }
});

// admin update Subscription Plan for user

export const updateSubscriptionForUser = AsyncHandler(
  async (req, res, next) => {
    try {
      const subId = req.params;

      if (!subId) {
        return errorHandler(res, 400, false, "subId not found", {});
      }

      const { name, plan, price, description, services, isActive } =
        req.body as UpdateSubInput;

      if (
        !name ||
        !plan ||
        price === undefined ||
        !description ||
        !services ||
        isActive === undefined
      ) {
        return errorHandler(res, 400, false, "All fields are required", {});
      }

      const updateSub = await SubscriptionPlanModel.findByIdAndUpdate(
        subId,
        req.body,
        { new: true },
      );

      console.log("update Subs :", updateSub);

      if (!updateSub) {
        return errorHandler(
          res,
          400,
          false,
          "Subscription plan not updated",
          {},
        );
      }

      return successHandler(
        res,
        200,
        true,
        "Subscription Plan Updated Successfully",
        { updateSub },
      );
    } catch (error) {
      console.log("error to update Subscription :", error);
      next(error);
    }
  },
);

// admin delete the Subscription

export const deleteSubscriptionForUser = AsyncHandler(
  async (req, res, next) => {
    try {
      const subId = req.params.subId;

      if (!subId) {
        return errorHandler(res, 400, false, "subId not found", {});
      }

      const deleteSub = await SubscriptionPlanModel.findByIdAndDelete(subId);

      if (!deleteSub) {
        return errorHandler(
          res,
          400,
          false,
          "Subscription plan not deleted",
          {},
        );
      }

      return successHandler(
        res,
        200,
        true,
        "Subscription Plan Deleted Successfully",
        {},
      );
    } catch (error) {
      console.log("error to delete Subscription :", error);
      next(error);
    }
  },
);
