import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add XP
router.post("/add", authMiddleware, async (req, res) => {
  const { points } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const value = Number(points) || 0;
    user.xp = (user.xp || 0) + value;
    await user.save();
    res.json({ xp: user.xp, message: "XP updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add XP" });
  }
});

export default router;
