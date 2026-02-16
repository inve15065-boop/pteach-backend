import mongoose from "mongoose";

const communityMessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skill: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const CommunityMessage = mongoose.model("CommunityMessage", communityMessageSchema);

export default CommunityMessage; // ✅ default export
