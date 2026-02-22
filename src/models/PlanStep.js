import mongoose from "mongoose";

const planStepSchema = new mongoose.Schema(
  {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    day: { type: Number, required: true },
    week: { type: Number, required: true },
    month: { type: Number, required: true },
    learningTopic: { type: String, required: true },
    durationMinutes: { type: Number, default: 30 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    note: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

planStepSchema.index({ plan: 1, day: 1, week: 1 });
planStepSchema.index({ plan: 1, completed: 1 });

export default mongoose.model("PlanStep", planStepSchema);
