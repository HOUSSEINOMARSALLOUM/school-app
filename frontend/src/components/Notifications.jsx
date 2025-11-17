const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await mockAPI.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "event":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "announcement":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "academic":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (selectedNotification) {
    return (
      <div className="pb-20">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
          <button
            onClick={() => setSelectedNotification(null)}
            className="mb-4 text-white/80 hover:text-white"
          >
            ← Back to Notifications
          </button>
          <h1 className="text-2xl font-bold">{selectedNotification.title}</h1>
          <p className="text-white/80 text-sm mt-2">
            {new Date(selectedNotification.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getTypeColor(
                selectedNotification.type
              )}`}
            >
              {selectedNotification.type.toUpperCase()}
            </div>
            <p className="text-slate-700 leading-relaxed">
              {selectedNotification.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Notifications</h1>
        <p className="text-white/80 text-sm">
          Stay updated with school announcements
        </p>
      </div>

      <div className="p-6 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => setSelectedNotification(notification)}
              className="w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-800 flex-1 pr-2">
                  {notification.title}
                  {!notification.read && (
                    <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                  )}
                </h3>
                <span className="text-xs text-slate-500">
                  {new Date(notification.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 text-sm line-clamp-2 mb-2">
                {notification.message}
              </p>
              <div
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                  notification.type
                )}`}
              >
                {notification.type}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
