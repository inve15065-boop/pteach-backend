import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/communityController.js";

const router = express.Router();

// Send message
router.post("/send", authMiddleware, sendMessage);

// Get messages for a skill
router.get("/messages/:skill", authMiddleware, getMessages);

export default router;
