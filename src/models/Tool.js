import mongoose from "mongoose";

const toolSchema = new mongoose.Schema(
  {
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    name: { type: String, required: true },
    description: { type: String },
    downloadUrl: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

toolSchema.index({ skill: 1, order: 1 });

export default mongoose.model("Tool", toolSchema);
