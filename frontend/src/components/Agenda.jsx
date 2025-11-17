import { useEffect, useState } from "react";
import { agendaAPI } from "../services/api";

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState("2025-11-15");
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgenda();
  }, [selectedDate]);

  const loadAgenda = async () => {
    setLoading(true);
    try {
      const data = await agendaAPI.getAgenda(selectedDate);
      setAgenda(data[selectedDate] || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dates = ["2025-11-15", "2025-11-16"];

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Daily Agenda</h1>
        <p className="text-white/80 text-sm">Your child's schedule</p>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {dates.map((date) => {
            const d = new Date(date);
            const isSelected = date === selectedDate;
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                <div className="text-xs opacity-80 mb-1">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="text-lg font-bold">{d.getDate()}</div>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : agenda.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-slate-500">
                No classes scheduled for this day
              </p>
            </div>
          ) : (
            agenda.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 shadow-md border-l-4 border-emerald-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        {item.time}
                      </span>
                      {item.subject === "Lunch Break" && (
                        <span className="text-xs text-slate-500">🍽️</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg mb-1">
                      {item.subject}
                    </h3>
                    {item.topic && (
                      <p className="text-slate-600 text-sm mb-1">
                        {item.topic}
                      </p>
                    )}
                    {item.teacher && (
                      <p className="text-slate-500 text-xs">{item.teacher}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
