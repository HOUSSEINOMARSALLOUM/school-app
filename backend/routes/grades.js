import express from "express";
import { getDB } from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const studentId = req.user.studentId;

    const student = await db.get("SELECT * FROM students WHERE id = ?", [
      studentId,
    ]);
    const grades = await db.all(
      "SELECT * FROM grades WHERE student_id = ? ORDER BY subject, test_number",
      [studentId]
    );

    // Group by subject
    const subjectMap = {};
    grades.forEach((grade) => {
      if (!subjectMap[grade.subject]) {
        subjectMap[grade.subject] = {
          name: grade.subject,
          teacher: grade.teacher,
          grades: [],
          semester: grade.semester,
        };
      }
      subjectMap[grade.subject].grades.push(grade.grade_value);
    });

    // Calculate averages
    const subjects = Object.values(subjectMap).map((subject) => ({
      ...subject,
      average:
        subject.grades.reduce((a, b) => a + b, 0) / subject.grades.length,
    }));

    res.json({
      student: student.name,
      grade: student.grade,
      semester: grades[0]?.semester || "Fall 2025",
      subjects,
    });
  } catch (error) {
    console.error("Get grades error:", error);
    res.status(500).json({ error: "Failed to fetch grades" });
  }
});

router.post("/upload", authenticateToken, async (req, res) => {
  try {
    const { studentId, grades } = req.body;
    const db = getDB();

    for (const grade of grades) {
      await db.run(
        "INSERT INTO grades (student_id, subject, grade_value, test_number, teacher, semester) VALUES (?, ?, ?, ?, ?, ?)",
        [
          studentId,
          grade.subject,
          grade.value,
          grade.testNumber,
          grade.teacher,
          grade.semester,
        ]
      );
    }

    res.json({ message: "Grades uploaded successfully" });
  } catch (error) {
    console.error("Upload grades error:", error);
    res.status(500).json({ error: "Failed to upload grades" });
  }
});

export default router;
