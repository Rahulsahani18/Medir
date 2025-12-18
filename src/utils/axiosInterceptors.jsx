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

// Use default Content-Type for POST/PUT/PATCH
// If your backend expects form-data, keep 'application/x-www-form-urlencoded'
// If your backend expects JSON, use 'application/json'
apiClient.defaults.headers.post['Content-Type'] = 'application/json';
apiClient.defaults.headers.put['Content-Type'] = 'application/json';
apiClient.defaults.headers.patch['Content-Type'] = 'application/json';

// Request interceptor: Attach token in Authorization header
// This is the standard way that your backend expects
apiClient.interceptors.request.use(
  (config) => {
    if (storeRef) {
      const state = storeRef.getState();
      const token = state.auth?.access_token;

      // IMPORTANT: Only add Authorization header if token exists
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // ✅ Return only the data for successful responses
    return response;
  },
  (error) => {
    // Only handle 401 if we have a store reference
    if (error.response?.status === 401 && storeRef) {
      const originalRequest = error.config;
      
      // Prevent infinite retry loops
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        toast.error("Your session has expired. Please login again.", {
          position: "top-right",
          autoClose: 2500,
        });

        // Dispatch logout to clear tokens from Redux state
        storeRef.dispatch(logout());

        setTimeout(() => {
          if (window.location.pathname !== "/auth") {
            window.location.href = "/auth";
          }
        }, 2500);
      }
    }
    
    // Return the error data for the thunk to handle
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
