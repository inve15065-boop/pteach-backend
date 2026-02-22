import mongoose from "mongoose";
import History from "../models/History.js";

export const getHistory = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(50, Math.max(1, parseInt(limit)));
    const query = { user: req.user.id };
    if (type && ["ai_chat", "community_chat", "plan_completion", "skill_change", "login"].includes(type)) {
      query.type = type;
    }
    const [items, total] = await Promise.all([
      History.find(query).sort({ createdAt: -1 }).skip(skip).limit(Math.min(50, Math.max(1, parseInt(limit)))).lean(),
      History.countDocuments(query),
    ]);
    res.status(200).json({
      items,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
