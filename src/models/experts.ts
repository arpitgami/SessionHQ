const mongoose = require('mongoose');

const SocialProofSchema = new mongoose.Schema({
    url: { type: String, required: true },
    description: { type: String, required: true }
});

const ExpertApplicationSchema = new mongoose.Schema(
    {
        clerkID: { type: String, required: true, unique: true },
        imageURL: { type: String, required: true },
        publicID: { type: String, required: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        linkedin: { type: String, required: true },
        twitter: { type: String },
        headline: { type: String, required: true },
        expertise: { type: [String], required: true },
        experience: { type: String, required: true },

        bio: { type: String, required: true },
        languages: { type: [String] },
        hourlyRate: { type: Number, required: true },
        socialProofs: { type: [SocialProofSchema] },

        status: {
            type: String,
            enum: ['pending', 'approved'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

export const ExpertApplication = mongoose.models.ExpertApplication || mongoose.model("ExpertApplication", ExpertApplicationSchema);
