import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";

let db;

export async function initDatabase() {
  db = await open({
    filename: "./school.db",
    driver: sqlite3.Database,
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'parent',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      grade TEXT NOT NULL,
      parent_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'announcement',
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notification_reads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      notification_id INTEGER,
      user_id INTEGER,
      read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (notification_id) REFERENCES notifications(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS agenda (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      time TEXT NOT NULL,
      subject TEXT NOT NULL,
      topic TEXT,
      teacher TEXT,
      grade TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      subject TEXT NOT NULL,
      grade_value REAL NOT NULL,
      test_number INTEGER,
      teacher TEXT,
      semester TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
  `);

  // Insert sample data
  await insertSampleData();

  console.log("✅ Database initialized successfully");
  return db;
}

async function insertSampleData() {
  // Check if data already exists
  const userCount = await db.get("SELECT COUNT(*) as count FROM users");
  if (userCount.count > 0) return;

  // Create sample parent user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const result = await db.run(
    "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
    ["parent@example.com", hashedPassword, "Sarah Ahmad", "parent"]
  );
  const parentId = result.lastID;

  // Create sample student
  const studentResult = await db.run(
    "INSERT INTO students (student_code, name, grade, parent_id) VALUES (?, ?, ?, ?)",
    ["QE2025", "Ahmad Khalil", "7th Grade", parentId]
  );
  const studentId = studentResult.lastID;

  // Insert sample notifications
  await db.run(`
    INSERT INTO notifications (title, message, type, date) VALUES
    ('Parent-Teacher Meeting', 'Annual parent-teacher meeting scheduled for next Thursday at 3:00 PM. Please confirm your attendance.', 'event', '2025-11-14'),
    ('Holiday Announcement', 'School will be closed on November 22nd for Independence Day celebration.', 'announcement', '2025-11-13'),
    ('Exam Schedule Released', 'Mid-term examination schedule has been published. Please check the agenda section.', 'academic', '2025-11-12'),
    ('Library Books Due', 'Reminder: Library books borrowed in October are due for return by November 20th.', 'reminder', '2025-11-10')
  `);

  // Insert sample agenda
  await db.run(`
    INSERT INTO agenda (date, time, subject, topic, teacher, grade) VALUES
    ('2025-11-15', '08:00', 'Mathematics', 'Algebra - Linear Equations', 'Mr. Hassan', '7th Grade'),
    ('2025-11-15', '09:00', 'English', 'Literature - Poetry Analysis', 'Ms. Layla', '7th Grade'),
    ('2025-11-15', '10:00', 'Science', 'Physics - Motion and Forces', 'Dr. Fadi', '7th Grade'),
    ('2025-11-15', '11:00', 'Arabic', 'Grammar - Sentence Structure', 'Mr. Karim', '7th Grade'),
    ('2025-11-15', '12:00', 'Lunch Break', '', '', '7th Grade'),
    ('2025-11-15', '13:00', 'History', 'Lebanese Independence', 'Ms. Nour', '7th Grade'),
    ('2025-11-15', '14:00', 'Art', 'Watercolor Painting', 'Ms. Rania', '7th Grade'),
    ('2025-11-16', '08:00', 'Science', 'Chemistry - Chemical Reactions', 'Dr. Fadi', '7th Grade'),
    ('2025-11-16', '09:00', 'Mathematics', 'Geometry - Triangles', 'Mr. Hassan', '7th Grade'),
    ('2025-11-16', '10:00', 'Physical Education', 'Basketball Practice', 'Coach Ali', '7th Grade'),
    ('2025-11-16', '11:00', 'French', 'Conversation Practice', 'Mme. Sophie', '7th Grade')
  `);

  // Insert sample grades
  const subjects = [
    { name: "Mathematics", teacher: "Mr. Hassan", grades: [85, 92, 88] },
    { name: "English", teacher: "Ms. Layla", grades: [90, 87, 93] },
    { name: "Science", teacher: "Dr. Fadi", grades: [78, 85, 82] },
    { name: "Arabic", teacher: "Mr. Karim", grades: [95, 92, 94] },
    { name: "History", teacher: "Ms. Nour", grades: [88, 90, 85] },
    { name: "French", teacher: "Mme. Sophie", grades: [82, 85, 88] },
    { name: "Art", teacher: "Ms. Rania", grades: [95, 98, 96] },
  ];

  for (const subject of subjects) {
    for (let i = 0; i < subject.grades.length; i++) {
      await db.run(
        "INSERT INTO grades (student_id, subject, grade_value, test_number, teacher, semester) VALUES (?, ?, ?, ?, ?, ?)",
        [
          studentId,
          subject.name,
          subject.grades[i],
          i + 1,
          subject.teacher,
          "Fall 2025",
        ]
      );
    }
  }

  console.log("✅ Sample data inserted");
}

export function getDB() {
  return db;
}
