import express from "express";
import { registerUser, loginUser, getMe, selectSkill } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRegister, validateLogin } from "../middleware/authValidation.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/me", authMiddleware, getMe);
router.post("/select-skill", authMiddleware, selectSkill);

export default router;
