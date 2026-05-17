import mongoose, { Schema, Document } from "mongoose";

export interface IUserSubscription extends Document {
  user: mongoose.Types.ObjectId;
  plan: mongoose.Types.ObjectId;                          
  status: "active" | "inactive" | "cancelled" | "expired";
  startDate: Date;
  endDate: Date | null;
  paymentRef: mongoose.Types.ObjectId | null;
  activatedAt: Date | null;
  cancelledAt: Date | null;
}

const userSubscriptionSchema = new Schema<IUserSubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "cancelled", "expired"],
      default: "inactive",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
    paymentRef: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    activatedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export const UserSubscriptionModel = mongoose.model<IUserSubscription>(
  "UserSubscription",
  userSubscriptionSchema,
);
