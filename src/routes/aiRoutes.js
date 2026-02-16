import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { askAI } from "../controllers/aiController.js";

const router = express.Router();

// Protected AI route
router.post("/ask", authMiddleware, askAI);

export default router;
