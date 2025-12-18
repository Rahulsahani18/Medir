import axios from "axios";
import { logout } from "../Redux/authSlice";
import { toast } from "react-toastify";

let storeRef = null;
export const injectStore = (store) => { storeRef = store; };

// ✅ Set base URL dynamically depending on environment
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://oswal.omsoftsolution.in/doctor/doctor/api" // Render / production
    : "/api"; // Vite dev proxy

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config) => {
    if (storeRef) {
      const state = storeRef.getState();
      const token = state.auth?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      toast.error("Your session has expired. Please login again.", {
        position: "top-right",
        autoClose: 2500,
      });

      if (storeRef) storeRef.dispatch(logout());

      setTimeout(() => {
        if (window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
      }, 2500);

      return Promise.reject(new Error("Session expired"));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
