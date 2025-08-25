// frontend/src/api/api.js
import axios from "axios";

// Create an Axios instance with a base URL.
// All requests made with this instance will be prefixed with this URL.
const API = axios.create({
  baseURL: "http://localhost:8001/api", // Your backend server URL
});

// IMPORTANT: Interceptor to add the token to every request
// This function will run before each request is sent.
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("ecobuddy_current_user"));

  if (user && user.token) {
    // If the user and token exist, add the Authorization header.
    // The backend's 'protect' middleware will use this header to authenticate the user.
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

// --- Auth Endpoints ---
export const login = (formData) => API.post("/auth/login", formData);
export const register = (formData) => API.post("/auth/register", formData);

// --- Pickup Endpoints ---
export const schedulePickup = (pickupData) => API.post("/pickups", pickupData);
export const getPickups = () => API.get("/pickups");

// --- Issue Endpoints ---
export const reportIssue = (issueData) => API.post("/issues", issueData);
export const getIssues = () => API.get("/issues");

// --- Notification Endpoints ---
export const getNotifications = () => API.get("/notifications");
export const markAllNotificationsAsRead = () =>
  API.put("/notifications/read-all");

// --- Report Endpoints ---
export const getUserReport = () => API.get('/reports');
// The export endpoint needs special handling for file download
export const exportUserReport = () => API.get('/reports/export', {
  responseType: 'blob', // Important: tells axios to handle the response as a file
});

// --- Community Endpoints ---
export const getCommunities = () => API.get("/communities");

// --- Admin Endpoints ---
export const getAdminStats = () => API.get("/admin/stats");
export const getAdminIssues = () => API.get("/admin/issues");
export const getAdminUsers = () => API.get("/admin/users");
export const getAdminPickups = () => API.get("/admin/pickups");
export const getAdminChartData = () => API.get("/admin/charts");
export const updateIssueStatus = (id, status) =>
  API.put(`/admin/issues/${id}`, { status });
export const createAnnouncement = (formData) =>
  API.post("/admin/announce", formData);
export const getAnnouncements = () => API.get("/admin/announcements");
export const updateAnnouncement = (id, data) =>
  API.put(`/admin/announcements/${id}`, data);
export const deleteAnnouncement = (id) =>
  API.delete(`/admin/announcements/${id}`);
// --- Auth Endpoints ---
export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });
export const resetPassword = (token, password) =>
  API.put(`/auth/reset-password/${token}`, { password });

export default API;
