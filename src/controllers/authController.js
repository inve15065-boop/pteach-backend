import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logHistory } from "../utils/historyLogger.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER (validation done in authValidation middleware)
export const registerUser = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    logHistory(user._id, "login", {}, "User registered").catch(() => {});
    const populated = await User.findById(user._id).select("-password").populate("selectedSkill");
    res.status(201).json({
      user: {
        _id: populated._id,
        name: populated.name,
        email: populated.email,
        role: populated.role,
        selectedSkill: populated.selectedSkill,
      },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ME (protected - for AuthContext)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("selectedSkill");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SELECT SKILL (for new users - saves primary skill to profile)
export const selectSkill = async (req, res) => {
  try {
    const { skillId } = req.body;
    if (!skillId) {
      return res.status(400).json({ message: "Skill ID is required." });
    }
    const Skill = (await import("../models/Skill.js")).default;
    const skill = await Skill.findOne({ _id: skillId, isPredefined: true });
    if (!skill) {
      return res.status(404).json({ message: "Invalid or non-predefined skill." });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { selectedSkill: skillId },
      { new: true }
    ).select("-password").populate("selectedSkill");
    logHistory(req.user.id, "skill_change", { skillId }, "Primary skill changed").catch(() => {});
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN (validation done in authValidation middleware)
export const loginUser = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      logHistory(user._id, "login", {}, "User logged in").catch(() => {});
      const token = generateToken(user._id);
      const populated = await User.findById(user._id).select("-password").populate("selectedSkill");
    res.json({
        user: {
          _id: populated._id,
          name: populated.name,
          email: populated.email,
          role: populated.role,
          selectedSkill: populated.selectedSkill,
        },
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
