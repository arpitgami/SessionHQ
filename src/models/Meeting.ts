const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema(
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
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

export const Meeting = mongoose.models.Meeting || mongoose.model("Meeting ", MeetingSchema);
