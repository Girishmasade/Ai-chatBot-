import crypto from "crypto";
import mongoose from "mongoose";
import { AsyncHandler } from "@/utils/AsyncHandler.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import { successHandler } from "@/utils/successHandler.util.js";
import { razorpay } from "@/config/razorpay.config.js";
import  { PaymentTransactionModel, PaymentItemType, PaymentStatus, type IPaymentTransaction } from "./payment.model.js";
import { SubscriptionPlanModel } from "../subscription/subscription.model.js";
import { TokenPackage } from "../token/token.model.js";
import { assignPlanToUser } from "../subscription/Subscription.assign.js";
import { credit } from "../token/tokenTransaction/tokenTransaction.controller.js";
import { TransactionType, TransactionSource } from "../token/tokenTransaction/tokenTransaction.types.js";
import type { AuthUser } from "../auth/auth.payload.js";
import { createOrderSchema, verifyPaymentSchema } from "./payment.validation.js";

const RAZORPAY_API_SECRET_KEY = process.env.RAZORPAY_API_SECRET_KEY as string;

// Helper function to fulfill the order securely
async function fulfillOrder(transaction: IPaymentTransaction) {
  if (transaction.status === PaymentStatus.SUCCESS) return; // already fulfilled

  if (transaction.itemType === PaymentItemType.SUBSCRIPTION) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await assignPlanToUser(transaction.user.toString(), transaction.itemId.toString(), session);
      });
    } finally {
      await session.endSession();
    }
  } else if (transaction.itemType === PaymentItemType.TOKEN_PACKAGE) {
    const pkg = await TokenPackage.findById(transaction.itemId);
    if (pkg) {
      await credit({
        userId: transaction.user.toString(),
        amount: pkg.tokenAmount,
        type: TransactionType.PURCHASE,
        source: TransactionSource.SYSTEM,
        description: `Purchased token package: ${pkg.name}`,
        packageId: pkg._id.toString(),
      });
    }
  }

  // Mark transaction as successful
  transaction.status = PaymentStatus.SUCCESS;
  await transaction.save();
}

/**
 * POST /api/v1/payment/create-order
 * Creates a Razorpay order and saves a PENDING PaymentTransaction
 */
export const createOrder = AsyncHandler(async (req, res, next) => {
  try {
    const userId = (req.user as AuthUser).id;
    const { itemType, itemId } = createOrderSchema.parse(req).body;

    let price = 0;

    // Resolve price based on item type
    if (itemType === PaymentItemType.SUBSCRIPTION) {
      const plan = await SubscriptionPlanModel.findById(itemId);
      if (!plan || !plan.isActive) {
        return errorHandler(res, 404, false, "Subscription plan not found or inactive", {});
      }
      price = plan.price;
    } else if (itemType === PaymentItemType.TOKEN_PACKAGE) {
      const pkg = await TokenPackage.findById(itemId);
      if (!pkg || pkg.status !== "active") {
        return errorHandler(res, 404, false, "Token package not found or inactive", {});
      }
      price = pkg.price;
    }

    if (price === 0) {
      return errorHandler(res, 400, false, "Cannot create a payment order for a free item", {});
    }

    const amountInPaise = Math.round(price * 100);

    // Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Create DB Transaction
    const transaction = await PaymentTransactionModel.create({
      user: new mongoose.Types.ObjectId(userId),
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      status: PaymentStatus.PENDING,
      itemType,
      itemId: new mongoose.Types.ObjectId(itemId),
    });

    return successHandler(res, 201, true, "Order created successfully", {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      transactionId: transaction._id,
    });
  } catch (error) {
    console.error("error in createOrder:", error);
    next(error);
  }
});

/**
 * POST /api/v1/payment/verify
 * Verifies the signature from frontend and fulfills the order
 */
export const verifyPayment = AsyncHandler(async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifyPaymentSchema.parse(req).body;

    const transaction = await PaymentTransactionModel.findOne({ orderId: razorpay_order_id });
    if (!transaction) {
      return errorHandler(res, 404, false, "Transaction not found", {});
    }

    if (transaction.status === PaymentStatus.SUCCESS) {
      return successHandler(res, 200, true, "Payment already verified", { status: "ALREADY_VERIFIED" });
    }

    // Verify HMAC signature
    const hmac = crypto.createHmac("sha256", RAZORPAY_API_SECRET_KEY);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      transaction.status = PaymentStatus.FAILED;
      transaction.paymentId = razorpay_payment_id;
      transaction.errorMessage = "Invalid payment signature";
      await transaction.save();
      return errorHandler(res, 400, false, "Invalid payment signature", {});
    }

    // Update transaction with payment details
    transaction.paymentId = razorpay_payment_id;
    transaction.signature = razorpay_signature;

    // Fulfill the order (assign plan or credit tokens)
    await fulfillOrder(transaction);

    return successHandler(res, 200, true, "Payment verified and order fulfilled successfully", {
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("error in verifyPayment:", error);
    next(error);
  }
});

/**
 * POST /api/v1/payment/webhook
 * Razorpay webhook handler for server-to-server confirmation fallback
 */
export const paymentWebhook = AsyncHandler(async (req, res, next) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret || !webhookSignature) {
      return res.status(400).send("Webhook missing signature or secret");
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== webhookSignature) {
      return res.status(400).send("Invalid webhook signature");
    }

    const event = req.body.event;
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = req.body.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      const transaction = await PaymentTransactionModel.findOne({ orderId });
      if (transaction && transaction.status === PaymentStatus.PENDING) {
        transaction.paymentId = paymentId;
        await fulfillOrder(transaction);
        console.log(`Webhook fulfilled order ${orderId}`);
      }
    }

    return res.status(200).send("Webhook received");
  } catch (error) {
    console.error("error in paymentWebhook:", error);
    res.status(500).send("Webhook Error");
  }
});
