import express from "express";
import { getDB } from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const notifications = await db.all(
      `
      SELECT n.*, 
             CASE WHEN nr.id IS NOT NULL THEN 1 ELSE 0 END as read
      FROM notifications n
      LEFT JOIN notification_reads nr 
        ON n.id = nr.notification_id AND nr.user_id = ?
      ORDER BY n.date DESC
    `,
      [req.user.userId]
    );

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.post("/:id/read", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    await db.run(
      "INSERT OR IGNORE INTO notification_reads (notification_id, user_id) VALUES (?, ?)",
      [req.params.id, req.user.userId]
    );
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, message, type, date } = req.body;
    const db = getDB();

    const result = await db.run(
      "INSERT INTO notifications (title, message, type, date) VALUES (?, ?, ?, ?)",
      [title, message, type, date]
    );

    res
      .status(201)
      .json({ id: result.lastID, message: "Notification created" });
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

export default router;
