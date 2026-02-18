import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
    startDate: { type: Date },
    endDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
