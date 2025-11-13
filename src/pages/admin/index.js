// pages/admin/index.js
import useUserProfile from "../../hooks/useUser";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, now } from "../../lib/firebase";
import { useRouter } from "next/router";

export default function AdminPanel() {
  const { user, profile, loading } = useUserProfile();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [classId, setClassId] = useState("");
  const [agendaItems, setAgendaItems] = useState("");
  const [studentName, setStudentName] = useState("");
  const [gradesJson, setGradesJson] = useState("");

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user)
    return (
      <div className="p-6">Please login as admin to access this page.</div>
    );
  if (!profile || profile.role !== "admin")
    return <div className="p-6">Access denied. You are not an admin.</div>;

  const createNotification = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "notifications"), {
      title,
      body,
      createdAt: now(),
      audience: "all",
      postedBy: user.uid,
    });
    setTitle("");
    setBody("");
    alert("Notification posted.");
  };

  const createAgenda = async (e) => {
    e.preventDefault();
    const items = agendaItems
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean);
    const date = new Date().toISOString().slice(0, 10);
    await addDoc(collection(db, "agendas"), {
      classId,
      date,
      items,
      createdAt: now(),
      createdBy: user.uid,
    });
    setClassId("");
    setAgendaItems("");
    alert("Agenda saved.");
  };

  const addGrades = async (e) => {
    e.preventDefault();
    // gradesJson should be a JSON array like: [{"subject":"Math","score":95},{"subject":"Arabic","score":88}]
    let grades;
    try {
      grades = JSON.parse(gradesJson);
    } catch (err) {
      alert("Grades JSON invalid.");
      return;
    }
    await addDoc(collection(db, "grades"), {
      studentName,
      classId,
      grades,
      lastUpdated: now(),
      createdBy: user.uid,
    });
    setStudentName("");
    setClassId("");
    setGradesJson("");
    alert("Grades saved.");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <section className="mb-6 bg-white p-4 rounded border">
        <h2 className="font-semibold mb-2">Post Notification</h2>
        <form onSubmit={createNotification} className="space-y-2">
          <input
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            className="w-full p-2 border rounded"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Message"
          />
          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Post
          </button>
        </form>
      </section>

      <section className="mb-6 bg-white p-4 rounded border">
        <h2 className="font-semibold mb-2">Create Today's Agenda</h2>
        <form onSubmit={createAgenda} className="space-y-2">
          <input
            className="w-full p-2 border rounded"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            placeholder="Class ID (e.g., G7, G9)"
          />
          <textarea
            className="w-full p-2 border rounded"
            value={agendaItems}
            onChange={(e) => setAgendaItems(e.target.value)}
            placeholder="One agenda item per line"
          />
          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Save Agenda
          </button>
        </form>
      </section>

      <section className="mb-6 bg-white p-4 rounded border">
        <h2 className="font-semibold mb-2">Add Student Grades</h2>
        <form onSubmit={addGrades} className="space-y-2">
          <input
            className="w-full p-2 border rounded"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Student name"
          />
          <input
            className="w-full p-2 border rounded"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            placeholder="Class ID"
          />
          <textarea
            className="w-full p-2 border rounded"
            value={gradesJson}
            onChange={(e) => setGradesJson(e.target.value)}
            placeholder='Enter grades JSON, e.g. [{"subject":"Math","score":95}]'
          />
          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Save Grades
          </button>
        </form>
      </section>

      <div className="text-sm text-gray-600">
        Tip: Create admin user docs in Firestore collection <code>users</code>{" "}
        with document id = user's uid and field <code>role: "admin"</code>.
      </div>
    </div>
  );
}
