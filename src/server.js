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
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/community", communityRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "PTeach Backend Running 🚀" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
