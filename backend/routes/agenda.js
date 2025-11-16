import express from "express";
import { getDB } from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    const db = getDB();

    let query = "SELECT * FROM agenda WHERE 1=1";
    const params = [];

    if (date) {
      query += " AND date = ?";
      params.push(date);
    } else if (startDate && endDate) {
      query += " AND date BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    query += " ORDER BY date, time";

    const agenda = await db.all(query, params);
    res.json(agenda);
  } catch (error) {
    console.error("Get agenda error:", error);
    res.status(500).json({ error: "Failed to fetch agenda" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { date, time, subject, topic, teacher, grade } = req.body;
    const db = getDB();

    const result = await db.run(
      "INSERT INTO agenda (date, time, subject, topic, teacher, grade) VALUES (?, ?, ?, ?, ?, ?)",
      [date, time, subject, topic, teacher, grade]
    );

    res.status(201).json({ id: result.lastID, message: "Agenda item created" });
  } catch (error) {
    console.error("Create agenda error:", error);
    res.status(500).json({ error: "Failed to create agenda item" });
  }
});

export default router;
