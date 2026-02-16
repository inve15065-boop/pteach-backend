import express from "express";
import { getSkills, createSkill } from "../controllers/skillController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getSkills);
router.post("/", authMiddleware, createSkill);

export default router;
