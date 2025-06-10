// /models/Request.ts
import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    expertID: { type: String, required: true },
    expertName: { type: String, required: true },
    userID: { type: String, required: true },
    slot: { type: Date, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "declined",
        "expired",
        "failed",
      ],
      default: "pending",
    },
    isPayment: { type: Boolean, default: false },
    paymentIntentID: { type: String, required: true },
  },
  { timestamps: true }
);

// 👇 FORCE RESET MODEL IN DEV (safe for dev only)
export const Request = mongoose.models.Request
  ? (mongoose.deleteModel?.("Request"),
    mongoose.model("Request", RequestSchema))
  : mongoose.model("Request", RequestSchema);
