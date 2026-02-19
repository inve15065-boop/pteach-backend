import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const startServer = async () => {
  try {
    // Connect to DB
    await connectDB();
    console.log("MongoDB connected ✅");

    const app = express();

    // CORS - deployed frontend + localhost for local testing
    let FRONTEND_URL = process.env.FRONTEND_URL || "https://pteach-frontend.vercel.app";
    if (!FRONTEND_URL.startsWith("http")) FRONTEND_URL = "https://" + FRONTEND_URL;
    const allowedOrigins = [FRONTEND_URL, "http://pteach-frontend.vercel.app", "http://pteach-frontend.vercel.app", "http://pteach-frontend.vercel.app", "http://pteach-frontend.vercel.app"];
    app.use(cors({
      origin: (o, cb) => cb(null, !o || allowedOrigins.includes(o)),
      credentials: true,
    }));

    app.use(express.json());

    // Health check
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "ok", message: "PTeach Backend is live 🚀" });
    });

    app.get("/", (req, res) => {
      res.json({ message: "PTeach Backend Running 🚀" });
    });

    // API routes
    app.use("/api/auth", authRoutes);
    app.use("/api/skills", skillRoutes);
    app.use("/api/plans", planRoutes);
    app.use("/api/ai", aiRoutes);
    app.use("/api/community", communityRoutes);
    app.use("/api/projects", projectRoutes);

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ status: "error", message: "Something went wrong" });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
