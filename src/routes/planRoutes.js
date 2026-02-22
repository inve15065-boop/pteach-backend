import express from "express";
import {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getPlanSteps,
  addPlanStep,
  togglePlanStepComplete,
  getPlanAnalytics,
} from "../controllers/planController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPlans);
router.get("/:id/analytics", authMiddleware, getPlanAnalytics);
router.get("/:id/steps", authMiddleware, getPlanSteps);
router.post("/:id/steps", authMiddleware, addPlanStep);
router.patch("/:id/steps/:stepId/complete", authMiddleware, togglePlanStepComplete);
router.get("/:id", authMiddleware, getPlanById);
router.post("/", authMiddleware, createPlan);
router.put("/:id", authMiddleware, updatePlan);
router.delete("/:id", authMiddleware, deletePlan);

export default router;
