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
