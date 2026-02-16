import express from "express";
import { generateProject } from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route
router.post("/generate", authMiddleware, generateProject);

export default router;
