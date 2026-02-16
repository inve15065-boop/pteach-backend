import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    framework: { type: String }, // e.g., React, Bootstrap
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
