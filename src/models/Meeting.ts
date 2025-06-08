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
            type: Date,
            required: true
        },
    }
);

export const Meeting = mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
