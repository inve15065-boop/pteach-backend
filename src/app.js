import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
s

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "https://pteach-frontend.vercel.app",

  credentials: true
}));


app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/community", communityRoutes);

// Health test route
app.get("/", (req, res) => {
  res.json({ message: "PTeach Backend Running 🚀" });
});

export default app;
