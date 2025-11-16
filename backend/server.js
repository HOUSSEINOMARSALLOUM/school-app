import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDatabase } from "./db.js";
import authRoutes from "./routes/auth.js";
import notificationRoutes from "./routes/notifications.js";
import agendaRoutes from "./routes/agenda.js";
import gradeRoutes from "./routes/grades.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initDatabase();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/grades", gradeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
