import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
    startDate: { type: Date },
    endDate: { type: Date },
    timePerSessionMinutes: { type: Number, default: 30 },
    totalDays: { type: Number },
    totalWeeks: { type: Number },
    totalMonths: { type: Number },
    reminderTime: { type: String },
    reminderEnabled: { type: Boolean, default: false },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

planSchema.index({ createdBy: 1 });
planSchema.index({ assignedTo: 1 });

export default mongoose.model("Plan", planSchema);
