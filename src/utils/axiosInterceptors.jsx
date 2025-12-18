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

// ✅ SMART INTERCEPTOR: Use header for same-origin, query param for cross-origin
apiClient.interceptors.request.use(
  (config) => {
    if (storeRef) {
      const state = storeRef.getState();
      const token = state.auth?.access_token;

      if (token) {
        // Check if we're making a cross-origin request
        const isCrossOrigin = window.location.origin !== new URL(BASE_URL).origin;
        
        if (!isCrossOrigin || config.url === '/login' || config.url === '/signup') {
          // Same-origin or auth endpoints: Use Authorization header
          config.headers.Authorization = `Bearer ${token}`;
          console.log(`✅ Using Authorization header for ${config.url}`);
        } else {
          // Cross-origin: Use query parameter
          config.params = {
            ...config.params,
            access_token: token
          };
          console.log(`🌐 Using query param for cross-origin: ${config.url}`);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor - Fix 401 handling
apiClient.interceptors.response.use(
  (response) => {
    // ✅ Return only the data for successful responses
    return response.data;
  },
  (error) => {
    // Don't auto-logout if it's a login request
    const isAuthRequest = error.config?.url?.includes('/login') || 
                         error.config?.url?.includes('/signup');
    
    if (error.response?.status === 401 && !isAuthRequest && storeRef) {
      const originalRequest = error.config;
      
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        console.log("🔐 401 Detected - Logging out user");
        
        toast.error("Your session has expired. Please login again.", {
          position: "top-right",
          autoClose: 2500,
        });

        // Clear the auth state
        storeRef.dispatch(logout());
        
        // Delay redirect to show toast
        setTimeout(() => {
          if (window.location.pathname !== "/auth") {
            window.location.href = "/auth";
          }
        }, 2500);
      }
    }
    
    // Return error data for the thunk to handle
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
