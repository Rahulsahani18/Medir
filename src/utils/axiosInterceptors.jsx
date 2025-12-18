// src/utils/apiClient.js (FIXED VERSION)

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

// Force form-urlencoded for POST/PUT/PATCH to avoid preflight
apiClient.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
apiClient.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
apiClient.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded';

// 🔥 Attach token WITHOUT using Authorization header
apiClient.interceptors.request.use(
  (config) => {
    if (storeRef) {
      const state = storeRef.getState();
      const token = state.auth?.access_token;

      if (token) {
        if (config.method === 'get') {
          // For GET: send as query param
          config.params = config.params || {};
          config.params.access_token = token;
        } else {
          // For POST/PUT/PATCH/DELETE: send in body
          // Convert data to URLSearchParams if not already
          if (config.data instanceof URLSearchParams) {
            config.data.append('access_token', token);
          } else {
            const formData = new URLSearchParams();
            // Copy existing data
            if (config.data) {
              Object.keys(config.data).forEach(key => {
                formData.append(key, config.data[key]);
              });
            }
            formData.append('access_token', token);
            config.data = formData;
          }
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Keep your 401 handler (unchanged)
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
