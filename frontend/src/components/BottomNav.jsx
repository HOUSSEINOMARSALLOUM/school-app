const BottomNav = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "agenda", icon: Calendar, label: "Agenda" },
    { id: "notifications", icon: Bell, label: "Alerts" },
    { id: "grades", icon: FileText, label: "Grades" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? "scale-110" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
