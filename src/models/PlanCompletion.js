import mongoose from "mongoose";

const planCompletionSchema = new mongoose.Schema(
  {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    planStep: { type: mongoose.Schema.Types.ObjectId, ref: "PlanStep", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    completed: { type: Boolean, required: true },
    completedAt: { type: Date },
    note: { type: String },
  },
  { timestamps: true }
);

planCompletionSchema.index({ plan: 1, user: 1 });
planCompletionSchema.index({ user: 1, completedAt: -1 });

export default mongoose.model("PlanCompletion", planCompletionSchema);
