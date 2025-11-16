import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, studentCode } = req.body;
    const db = getDB();

    // Find user
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Find student
    const student = await db.get(
      "SELECT * FROM students WHERE student_code = ? AND parent_id = ?",
      [studentCode, user.id]
    );

    if (!student) {
      return res.status(401).json({ error: "Invalid student code" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, studentId: student.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentCode: student.student_code,
        studentName: student.name,
        grade: student.grade,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, studentCode, studentName, grade } = req.body;
    const db = getDB();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await db.run(
      "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, name, "parent"]
    );

    // Create student
    await db.run(
      "INSERT INTO students (student_code, name, grade, parent_id) VALUES (?, ?, ?, ?)",
      [studentCode, studentName, grade, userResult.lastID]
    );

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
