// src/utils/axiosInterceptors.js
import axios from "axios";
import { logout } from "../Redux/authSlice";
import { toast } from "react-toastify";

let storeRef = null;
export const injectStore = (store) => { storeRef = store; };

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

// Request interceptor - get token from Redux store
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
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
      
      // Dispatch logout to clear Redux state
      if (storeRef) {
        storeRef.dispatch(logout());
      }
      
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