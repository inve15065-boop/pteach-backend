import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher"], default: "student" },
    xp: { type: Number, default: 0 },
    selectedSkill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", default: null },
    phone: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ selectedSkill: 1 });

export default mongoose.model("User", userSchema);
