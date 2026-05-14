import axios from "axios";

const API = axios.create({ baseURL: "/api" });

// Always attach the latest token from localStorage
API.interceptors.request.use((config) => {
  const user = localStorage.getItem("wfmUser");
  if (user) {
    const parsed = JSON.parse(user);
    config.headers.Authorization = `Bearer ${parsed.token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");

// Food — search, filter, paginate
export const getAllFood = (params) => API.get("/food", { params });
export const getFoodById = (id) => API.get(`/food/${id}`);
export const createFood = (data) => API.post("/food", data);
export const claimFood = (id) => API.put(`/food/${id}/claim`);
export const deleteFood = (id) => API.delete(`/food/${id}`);
export const getMyListings = () => API.get("/food/my-listings");

// Donations
export const getMyDonations = (role) =>
  API.get("/donations", { params: { role } });
export const updateDonationStatus = (id, status) =>
  API.put(`/donations/${id}/status`, { status });

// User
export const updateProfile = (data) => API.put("/user/profile", data);

// Admin
export const adminGetStats = () => API.get("/admin/stats");
export const adminGetUsers = () => API.get("/admin/users");
export const adminDeleteUser = (id) => API.delete(`/admin/users/${id}`);
export const adminGetFood = () => API.get("/admin/food");
export const adminDeleteFood = (id) => API.delete(`/admin/food/${id}`);

// Public stats
export const getImpactStats = () => API.get("/stats");

export default API;
