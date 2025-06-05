import mongoose from "mongoose";

const UserSessionDataSchema = new mongoose.Schema({


    userID: { type: String, required: true },
    role: { type: String, required: true },
    industry: { type: String, required: true },
    stage: { type: String, required: true },
    aboutStartup: { type: String, required: true },

    helpWith: { type: String, required: true },
    reasonToTalk: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.UserSessionData || mongoose.model("UserSessionData", UserSessionDataSchema);
