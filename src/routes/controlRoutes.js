import express from "express";
import { getControlData } from "../controllers/controlController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getControlData);

export default router;
