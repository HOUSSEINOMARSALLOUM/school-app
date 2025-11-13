// pages/index.js
import useUserProfile from "../hooks/useUser";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useEffect, useState } from "react";

export default function Home() {
  const { profile, loading } = useUserProfile();
  const [notifications, setNotifications] = useState([]);
  const [agenda, setAgenda] = useState([]);

  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, "notifications"),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      const snap = await getDocs(q);
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const today = new Date().toISOString().slice(0, 10);
      const q2 = query(collection(db, "agendas"));
      const snap2 = await getDocs(q2);
      const allAgendas = snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAgenda(allAgendas.filter((a) => a.date === today));
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome — Qab Elias Mixed Public School
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        {notifications.length === 0 && <p>No notifications yet.</p>}
        <ul>
          {notifications.map((n) => (
            <li key={n.id} className="border p-3 rounded my-2 bg-white">
              <strong className="block">{n.title}</strong>
              <p className="mt-1">{n.body}</p>
              <small className="text-gray-500">
                {n.createdAt?.toDate
                  ? n.createdAt.toDate().toLocaleString()
                  : ""}
              </small>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Today's Agenda</h2>
        {agenda.length === 0 && <p>No agenda for today.</p>}
        {agenda.map((a) => (
          <div key={a.id} className="border p-3 rounded my-2 bg-white">
            <h3 className="font-semibold">
              {a.classId} — {a.date}
            </h3>
            <ul className="list-disc ml-5 mt-2">
              {(a.items || []).map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
