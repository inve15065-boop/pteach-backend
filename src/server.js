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
import toolRoutes from "./routes/toolRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

dotenv.config();

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
      console.error("FATAL: JWT_SECRET is required in production.");
      process.exit(1);
    }

    await connectDB();
    console.log("MongoDB connected ✅");

    const app = express();

    // CORS - whitelist only; full protocol URLs; no wildcard with credentials
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

    app.use(express.json());

    try {
      const rateLimit = (await import("express-rate-limit")).default;
      app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { status: "error", message: "Too many requests." } }));
      app.use("/api/auth/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));
      app.use("/api/auth/register", rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));
    } catch (e) {
      // Rate limit optional
    }

    // Health check
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "ok", message: "PTeach Backend is live 🚀" });
    });
    app.get("/api/health", (req, res) => {
      res.status(200).json({ status: "ok", message: "PTeach API is live 🚀" });
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
    app.use("/api/tools", toolRoutes);
    app.use("/api/history", historyRoutes);
    // Aliases without /api prefix (for deployments expecting root-mounted routes)
    app.use("/auth", authRoutes);
    app.use("/skills", skillRoutes);
    app.use("/plans", planRoutes);
    app.use("/ai", aiRoutes);
    app.use("/community", communityRoutes);
    app.use("/projects", projectRoutes);
    app.use("/control", controlRoutes);
    app.use("/xp", xpRoutes);
    app.use("/tools", toolRoutes);
    app.use("/history", historyRoutes);
    // API 404 helper
    app.use(/^\/api(\/|$)/, (req, res) => {
      res.status(404).json({
        status: "error",
        message: "API endpoint not found",
        path: req.originalUrl,
      });
    });

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
