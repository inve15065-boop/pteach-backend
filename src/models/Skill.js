import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    framework: { type: String },
    level: { type: String },
    duration: { type: String },
    icon: { type: String, default: "🔹" },
    order: { type: Number, default: 0 },
    isPredefined: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

skillSchema.index({ isPredefined: 1, order: 1 });
skillSchema.index({ createdBy: 1 });

export default mongoose.model("Skill", skillSchema);
