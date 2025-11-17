import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Notifications from "./components/Notifications";
import Agenda from "./components/Agenda";
import Grades from "./components/Grades";
import BottomNav from "./components/BottomNav";
import "./index.css";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentPage, setCurrentPage] = useState("home");

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Dashboard
            user={user}
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
          />
        );
      case "notifications":
        return <Notifications />;
      case "agenda":
        return <Agenda />;
      case "grades":
        return <Grades />;
      default:
        return (
          <Dashboard
            user={user}
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
          />
        );
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {renderPage()}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}
