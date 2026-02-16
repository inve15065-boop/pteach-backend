import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skill: {
      type: String,
      required: true,
    },
    dailyGoal: {
      type: String,
      required: true,
    },
    reminderTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
