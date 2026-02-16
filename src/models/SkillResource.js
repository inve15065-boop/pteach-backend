import mongoose from "mongoose";

const skillResourceSchema = new mongoose.Schema({
  skill: { type: String, required: true },          // e.g., "Web Development"
  type: { type: String, enum: ["PDF", "Code", "Link"], required: true },
  title: { type: String, required: true },         // e.g., "React Basics PDF"
  url: { type: String, required: true },           // location of the resource
  description: { type: String },
});

export default mongoose.model("SkillResource", skillResourceSchema);
