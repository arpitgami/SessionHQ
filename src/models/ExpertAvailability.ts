import mongoose from "mongoose";

const ExpertAvailabilitySchema = new mongoose.Schema(
  {
    expertId: {
      type: String,
      required: true,
      unique: true,
    },
    availability: {
      type: Map,
      of: [String], // { "2025-06-04": ["08:00", "10:00", ...] }
      default: {},
    },
    lockedSlots: {
      type: Map,
      of: [String], // { "2025-06-04": ["08:00", "10:00", ...] }
      default: {},
    },
  },
  { timestamps: true }
);

delete mongoose.models.ExpertAvailability; // <- Clear cached version

export const ExpertAvailability =
  mongoose.models.ExpertAvailability ||
  mongoose.model("ExpertAvailability", ExpertAvailabilitySchema);
