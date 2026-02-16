const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

// Add XP
router.post("/add", protect, async (req, res) => {
  const { points } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.xp = (user.xp || 0) + points;
    await user.save();
    res.json({ xp: user.xp });
  } catch (err) {
    res.status(500).json({ message: "Failed to add XP" });
  }
});

module.exports = router;
