// src/utils/apiClient.js (updated)

import axios from "axios";
import { logout } from "../Redux/authSlice";
import { toast } from "react-toastify";

let storeRef = null;
export const injectStore = (store) => { storeRef = store; };

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://oswal.omsoftsolution.in/doctor/doctor/api"
    : "/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// 🔥 CRITICAL CHANGE: Override default Content-Type for POST/PUT/PATCH
// This prevents preflight when combined with no custom headers
apiClient.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
apiClient.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
apiClient.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded';

// Request interceptor: Attach token via query param instead of header
// This avoids custom "Authorization" header → no preflight!
apiClient.interceptors.request.use(
  (config) => {
    if (storeRef) {
      const state = storeRef.getState();
      const token = state.auth?.access_token;

      if (token) {
        // Option 1: Send token as query param (works for GET, POST, etc.)
        config.params = config.params || {};
        config.params.access_token = token;

        // Option 2 (Alternative): Send in body for POST/PUT (if you prefer)
        // if (config.method !== 'get' && config.data) {
        //   config.data = new URLSearchParams({
        //     ...config.data,
        //     access_token: token
        //   });
        // }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Keep your 401 handler
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
