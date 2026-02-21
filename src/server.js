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
import controlRoutes from "./routes/controlRoutes.js";
import xpRoutes from "./routes/xpRoutes.js";

dotenv.config();

const startServer = async () => {
  try {
    // Connect to DB
    await connectDB();
    console.log("MongoDB connected ✅");

    const app = express();

    // CORS - deployed frontend + localhost for local testing
    const normalizeUrl = (u) => {
      if (!u) return null;
      return u.startsWith("http") ? u : `https://${u}`;
    };
    const FRONTEND_URL_RAW = process.env.FRONTEND_URL || "https://pteach-frontend.vercel.app";
    const FRONTEND_URL = normalizeUrl(FRONTEND_URL_RAW);
    const allowedOrigins = Array.from(
      new Set([
        FRONTEND_URL,
        "https://pteach-frontend.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://localhost:3000",
      ])
    ).filter(Boolean);

    app.use(
      cors({
        origin: (origin, cb) => {
          if (!origin) return cb(null, true);
          return cb(null, allowedOrigins.includes(origin));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (origin && allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        if (req.method === "OPTIONS") return res.sendStatus(204);
      }
      next();
    });

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
    app.use("/api/control", controlRoutes);
    app.use("/api/xp", xpRoutes);

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
