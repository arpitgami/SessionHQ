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
            date: {
                type: String,
                required: true,
            },
            time: {
                type: String,
                required: true,
            },
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "declined", "expired"],
            default: "pending",
        },
        isPayment: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export const Request = mongoose.models.Request || mongoose.model("Request ", RequestSchema);
