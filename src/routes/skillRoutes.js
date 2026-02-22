import express from "express";
import {
  getSkills,
  getPredefinedSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getSkills);
router.get("/predefined", authMiddleware, getPredefinedSkills);
router.get("/:id", authMiddleware, getSkillById);
router.post("/", authMiddleware, createSkill);
router.put("/:id", authMiddleware, updateSkill);
router.delete("/:id", authMiddleware, deleteSkill);

export default router;
