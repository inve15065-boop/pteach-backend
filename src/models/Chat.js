import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  messages: [
    {
      sender: { type: String, enum: ["student", "ai"], required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);
