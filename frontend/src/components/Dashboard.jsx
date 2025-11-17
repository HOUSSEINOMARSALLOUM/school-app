import { useState, useEffect } from "react";
import { Bell, Calendar, FileText, User, ChevronRight } from "lucide-react";
import { notificationsAPI, gradesAPI } from "../services/api";

const Dashboard = ({ user, onNavigate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await agendaAPI.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const features = [
    {
      icon: Bell,
      title: "Notifications",
      desc: `${unreadCount} new messages`,
      color: "from-blue-500 to-blue-600",
      page: "notifications",
    },
    {
      icon: Calendar,
      title: "Daily Agenda",
      desc: "View schedule",
      color: "from-emerald-500 to-emerald-600",
      page: "agenda",
    },
    {
      icon: FileText,
      title: "Grade Sheet",
      desc: "Check performance",
      color: "from-purple-500 to-purple-600",
      page: "grades",
    },
  ];

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Hello, {user.name}</h1>
            <p className="text-white/80 text-sm">Student: {user.studentName}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8">
        <div className="grid gap-4">
          {features.map((feature) => (
            <button
              key={feature.page}
              onClick={() => onNavigate(feature.page)}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 text-sm">{feature.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-8">
        <h2 className="font-semibold text-slate-800 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-200">
            <p className="text-emerald-600 text-sm font-medium mb-1">
              Overall Average
            </p>
            <p className="text-2xl font-bold text-emerald-700">88.9%</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
            <p className="text-blue-600 text-sm font-medium mb-1">Attendance</p>
            <p className="text-2xl font-bold text-blue-700">96%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
