import mongoose, { Schema, Document } from "mongoose";

export interface Isubscription extends Document {
  user: mongoose.Types.ObjectId;
  plan: "free" | "pro" | "ultra";
  status: "active" | "inactive" | "cancel";
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  payuTxnId: string;
  payuSubId: string;
  amount: number;
  currency: string;
}

export const subscriptionSchema = new Schema<Isubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Auth"
    },
    plan: {
      type: String,
      enum: ["free", "pro", "ultra"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "cancel"],
      default: "inactive",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    payuTxnId: {
      type: String,
    },
    payuSubId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
  },
  { timestamps: true },
);

export const subscriptionModel = mongoose.model<Isubscription>(
  "subscription",
  subscriptionSchema,
);
