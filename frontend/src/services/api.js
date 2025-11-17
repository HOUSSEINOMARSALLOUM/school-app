import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, studentCode) =>
    api.post("/auth/login", { email, studentCode }),
  register: (data) => api.post("/auth/register", data),
};

export const notificationsAPI = {
  getAll: () => api.get("/notifications"),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
  create: (data) => api.post("/notifications", data),
};

export const agendaAPI = {
  getByDate: (date) => api.get("/agenda", { params: { date } }),
  getByRange: (startDate, endDate) =>
    api.get("/agenda", { params: { startDate, endDate } }),
  create: (data) => api.post("/agenda", data),
};

export const gradesAPI = {
  getAll: () => api.get("/grades"),
  upload: (data) => api.post("/grades/upload", data),
};

export default api;
