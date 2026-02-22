import mongoose from "mongoose";
import Skill from "../models/Skill.js";

// Validation helper - keeps validation out of model layer
const validateSkillInput = (body, isUpdate = false) => {
  const { title, description, framework } = body;
  if (!isUpdate && (!title || typeof title !== "string" || title.trim().length < 2)) {
    return { valid: false, message: "Title is required and must be at least 2 characters." };
  }
  if (isUpdate && title !== undefined && (typeof title !== "string" || title.trim().length < 2)) {
    return { valid: false, message: "Title must be at least 2 characters." };
  }
  if (framework !== undefined && framework !== null && typeof framework !== "string") {
    return { valid: false, message: "Framework must be a string." };
  }
  if (description !== undefined && description !== null && typeof description !== "string") {
    return { valid: false, message: "Description must be a string." };
  }
  return { valid: true };
};

// Get predefined skills (for skill selection - 50 system skills)
export const getPredefinedSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ isPredefined: true }).sort({ order: 1 });
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all skills for the user (user-created, for teachers/custom)
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ createdBy: req.user.id });
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single skill by id
export const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid skill ID." });
    }
    const skill = await Skill.findOne({ _id: id, createdBy: req.user.id });
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }
    res.status(200).json(skill);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create new skill
export const createSkill = async (req, res) => {
  try {
    const validation = validateSkillInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }
    const { title, description, framework } = req.body;
    const skill = new Skill({
      title: title.trim(),
      description: description?.trim() || undefined,
      framework: framework?.trim() || undefined,
      createdBy: req.user.id,
    });
    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update skill
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid skill ID." });
    }
    const validation = validateSkillInput(req.body, true);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }
    const skill = await Skill.findOne({ _id: id, createdBy: req.user.id });
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }
    if (req.body.title !== undefined) skill.title = req.body.title.trim();
    if (req.body.description !== undefined) skill.description = req.body.description?.trim() || "";
    if (req.body.framework !== undefined) skill.framework = req.body.framework?.trim() || "";
    await skill.save();
    res.status(200).json(skill);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete skill
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid skill ID." });
    }
    const skill = await Skill.findOneAndDelete({ _id: id, createdBy: req.user.id });
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }
    res.status(200).json({ message: "Skill deleted.", id: skill._id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
