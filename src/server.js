import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";

dotenv.config();

const startServer = async () => {
  try {
    // Connect to DB
    await connectDB();
    console.log("MongoDB connected ✅");

    const app = express();

    // CORS
    const FRONTEND_URL = process.env.FRONTEND_URL || "https://pteach-frontend.vercel.app";
    app.use(cors({ origin: FRONTEND_URL, credentials: true }));

    app.use(express.json());

    // Railway health check (fast, no DB)
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "ok", message: "PTeach Backend is live 🚀" });
    });

    // Root route (frontend or testing)
    app.get("/", (req, res) => {
      res.json({ message: "PTeach Backend Running 🚀" });
    });

    // Your API routes
    app.use("/api/auth", authRoutes);
    app.use("/api/skills", skillRoutes);
    app.use("/api/plans", planRoutes);
    app.use("/api/ai", aiRoutes);
    app.use("/api/community", communityRoutes);
    // --- Add this error handler ---
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ status: "error", message: "Something went wrong" });
    });
    // -----------------------------

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
