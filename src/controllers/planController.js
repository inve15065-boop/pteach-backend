import mongoose from "mongoose";
import Plan from "../models/Plan.js";
import Skill from "../models/Skill.js";

// Get all plans for a user
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ createdBy: req.user.id }).populate("skill");
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new plan
export const createPlan = async (req, res) => {
  try {
    const { title, description, skill, startDate, endDate } = req.body;
    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return res.status(400).json({ message: "Title is required and must be at least 2 characters." });
    }
    if (!skill || !mongoose.Types.ObjectId.isValid(skill)) {
      return res.status(400).json({ message: "A valid skill id is required." });
    }
    const skillDoc = await Skill.findOne({ _id: skill, createdBy: req.user.id });
    if (!skillDoc) {
      return res.status(404).json({ message: "Skill not found for this user." });
    }
    let start = startDate ? new Date(startDate) : undefined;
    let end = endDate ? new Date(endDate) : undefined;
    if (start && isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid startDate." });
    }
    if (end && isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid endDate." });
    }
    if (start && end && end < start) {
      return res.status(400).json({ message: "endDate cannot be before startDate." });
    }
    const plan = new Plan({
      title,
      description,
      skill,
      startDate: start,
      endDate: end,
      createdBy: req.user.id,
    });
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
