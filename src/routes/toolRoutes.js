import express from "express";
import { getToolsBySkill } from "../controllers/toolController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/skill/:skillId", authMiddleware, getToolsBySkill);

export default router;
