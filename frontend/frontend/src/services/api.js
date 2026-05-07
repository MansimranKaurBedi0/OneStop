import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://onestop-ecef.onrender.com/api", // apna backend port
});

export default api;
