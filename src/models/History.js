import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["ai_chat", "community_chat", "plan_completion", "skill_change", "login"],
      required: true,
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
    description: { type: String },
  },
  { timestamps: true }
);

historySchema.index({ user: 1, createdAt: -1 });
historySchema.index({ user: 1, type: 1 });

export default mongoose.model("History", historySchema);
