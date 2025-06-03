const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        clerkID: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },

        linkedinURL: { type: String, required: true },
        twitterURL: { type: String }, // optional
        websiteURL: { type: String }, // optional
    }
)
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
