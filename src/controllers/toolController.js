import mongoose from "mongoose";
import Tool from "../models/Tool.js";
import Skill from "../models/Skill.js";

export const getToolsBySkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return res.status(400).json({ message: "Invalid skill ID." });
    }
    const skill = await Skill.findOne({
      _id: skillId,
      $or: [{ isPredefined: true }, { createdBy: req.user.id }],
    });
    if (!skill) return res.status(404).json({ message: "Skill not found." });
    const tools = await Tool.find({ skill: skillId }).sort({ order: 1 });
    res.status(200).json(tools);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
