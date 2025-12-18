import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./authSlice";
import apiClient from "../utils/axiosInterceptors";


// API client setup
// const createApiClient = () => {
//   return axios.create({
//     baseURL: "/api",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     timeout: 15000,
//   });
// };

// Get auth token
const getAuthToken = (getState) => {
  const state = getState();
  return state.auth?.access_token || localStorage.getItem("access_token");
};

// Fetch appointments from API (always hits API, no caching)
export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      if (!token) {
        throw new Error("No authentication token found. Please login.");
      }

      // const apiClient = createApiClient();
      const response = await apiClient.get("/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Appointments API Response:", response.data);

      if (response.data.status === true && response.data.appointments) {
        return response.data.appointments;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch appointments"
        );
      }
    } catch (error) {
      console.error("Fetch appointments error:", error);
      
      let errorMessage = "Failed to fetch appointments";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Unauthorized - Please login again";
        } else {
          errorMessage =
            error.response.data?.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error - Cannot connect to server";
      } else {
        errorMessage = error.message;
      }

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

// Refresh appointments (simple wrapper for consistency)
// export const refreshAppointments = createAsyncThunk(
//   "appointment/refreshAppointments",
//   async (_, { dispatch }) => {
//     return dispatch(fetchAppointments());
//   }
// );

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointments: [], // Empty initial state
    loading: false,
    error: null,
  },
  reducers: {
    clearAppointments: (state) => {
      state.appointments = [];
      state.error = null;
    },
    clearAppointmentError: (state) => {
      state.error = null;
    },
    // Add new appointment locally (for immediate UI update after booking)
    addNewAppointment: (state, action) => {
      state.appointments.unshift(action.payload);
    },
    // Update appointments list (used after booking success)
    updateAppointmentsList: (state, action) => {
      state.appointments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Clear appointments on API failure
        state.appointments = [];
      })
      .addCase(logout, (state) => {
        state.loading = false;
        state.error = null;
        state.appointments = [];
      });
  },
});

export const {
  clearAppointments,
  clearAppointmentError,
  addNewAppointment,
  updateAppointmentsList,
} = appointmentSlice.actions;
export default appointmentSlice.reducer;