import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

let db;

export async function initDatabase() {
  db = new Database("./school.db");

  // Create tables
  db.exec(`
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

  insertSampleData();
  console.log("✅ Database initialized successfully");
  return db;
}

function insertSampleData() {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
  if (userCount.count > 0) return;

  const hashedPassword = bcrypt.hashSync("password123", 10);
  const userInsert = db.prepare(
    "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)"
  );
  const userResult = userInsert.run([
    "parent@example.com",
    hashedPassword,
    "Sarah Ahmad",
    "parent",
  ]);
  const parentId = userResult.lastInsertRowid;

  const studentInsert = db.prepare(
    "INSERT INTO students (student_code, name, grade, parent_id) VALUES (?, ?, ?, ?)"
  );
  const studentResult = studentInsert.run([
    "QE2025",
    "Ahmad Khalil",
    "7th Grade",
    parentId,
  ]);
  const studentId = studentResult.lastInsertRowid;

  db.exec(`
    INSERT INTO notifications (title, message, type, date) VALUES
    ('Parent-Teacher Meeting', 'Annual parent-teacher meeting scheduled for next Thursday at 3:00 PM.', 'event', '2025-11-14'),
    ('Holiday Announcement', 'School will be closed on November 22nd for Independence Day.', 'announcement', '2025-11-13'),
    ('Exam Schedule Released', 'Mid-term examination schedule has been published.', 'academic', '2025-11-12'),
    ('Library Books Due', 'Library books borrowed in October are due by November 20th.', 'reminder', '2025-11-10')
  `);

  db.exec(`
    INSERT INTO agenda (date, time, subject, topic, teacher, grade) VALUES
    ('2025-11-15', '08:00', 'Mathematics', 'Algebra', 'Mr. Hassan', '7th Grade'),
    ('2025-11-15', '09:00', 'English', 'Poetry Analysis', 'Ms. Layla', '7th Grade'),
    ('2025-11-15', '10:00', 'Science', 'Motion and Forces', 'Dr. Fadi', '7th Grade')
  `);

  const subjects = [
    { name: "Mathematics", teacher: "Mr. Hassan", grades: [85, 92, 88] },
    { name: "English", teacher: "Ms. Layla", grades: [90, 87, 93] },
    { name: "Science", teacher: "Dr. Fadi", grades: [78, 85, 82] },
  ];

  const gradeInsert = db.prepare(
    "INSERT INTO grades (student_id, subject, grade_value, test_number, teacher, semester) VALUES (?, ?, ?, ?, ?, ?)"
  );

  for (const subject of subjects) {
    for (let i = 0; i < subject.grades.length; i++) {
      gradeInsert.run([
        studentId,
        subject.name,
        subject.grades[i],
        i + 1,
        subject.teacher,
        "Fall 2025",
      ]);
    }
  }

  console.log("✅ Sample data inserted");
}

export function getDB() {
  return db;
}
