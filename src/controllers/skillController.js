import Skill from "../models/Skill.js";

// Get all skills
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ createdBy: req.user.id }); // only user’s skills
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create new skill
export const createSkill = async (req, res) => {
  try {
    const { title, description, framework } = req.body;
    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return res.status(400).json({ message: "Title is required and must be at least 2 characters." });
    }
    if (framework && typeof framework !== "string") {
      return res.status(400).json({ message: "Framework must be a string." });
    }
    if (description && typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string." });
    }
    const skill = new Skill({
      title,
      description,
      framework,
      createdBy: req.user.id,
    });
    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
