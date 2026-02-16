import express from "express";
import { getPlans, createPlan } from "../controllers/planController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPlans);
router.post("/", authMiddleware, createPlan);

export default router;
