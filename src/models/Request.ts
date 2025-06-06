const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema(
    {
        expertID: {
            type: String,
            required: true,
        },
        userID: {
            type: String,
            required: true,
        },
        slot: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "declined", "expired"],
            default: "pending",
        },
        isPayment: {
            type: Boolean,
            default: false,
        },
        paymentIntentID: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export const Request = mongoose.models.Request || mongoose.model("Request", RequestSchema);
