// src/Redux/dietHealthSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../utils/axiosInterceptors";
import {logout} from "../Redux/authSlice";

export const fetchDietPlans = createAsyncThunk(
  "dietHealth/fetchDietPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/diet");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch diet plans"
      );
    }
  }
);

export const fetchHealthAdvisories = createAsyncThunk(
  "dietHealth/fetchHealthAdvisories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/health_advisory");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch health advisories"
      );
    }
  }
);

const dietHealthSlice = createSlice({
  name: "dietHealth",
  initialState: {
    dietPlans: [],
    healthAdvisories: [],
    dietLoading: false,
    healthLoading: false,
    dietError: null,
    healthError: null,
    lastDietFetch: null,
    lastHealthFetch: null,
  },
  reducers: {
    refreshDietData: (state) => {
      state.lastDietFetch = null; // Force refetch
    },
    refreshHealthData: (state) => {
      state.lastHealthFetch = null; // Force refetch
    },
    clearDietData: (state) => {
      state.dietPlans = [];
      state.lastDietFetch = null;
    },
    clearHealthData: (state) => {
      state.healthAdvisories = [];
      state.lastHealthFetch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Diet Plans
      .addCase(fetchDietPlans.pending, (state) => {
        state.dietLoading = true;
        state.dietError = null;
      })
      .addCase(fetchDietPlans.fulfilled, (state, action) => {
        state.dietLoading = false;
        state.dietPlans = action.payload;
        state.lastDietFetch = new Date().toISOString();
      })
      .addCase(fetchDietPlans.rejected, (state, action) => {
        state.dietLoading = false;
        state.dietError = action.payload;
      })
      // Health Advisories
      .addCase(fetchHealthAdvisories.pending, (state) => {
        state.healthLoading = true;
        state.healthError = null;
      })
      .addCase(fetchHealthAdvisories.fulfilled, (state, action) => {
        state.healthLoading = false;
        state.healthAdvisories = action.payload;
        state.lastHealthFetch = new Date().toISOString();
      })
      .addCase(fetchHealthAdvisories.rejected, (state, action) => {
        state.healthLoading = false;
        state.healthError = action.payload;
      })
      .addCase(logout, (state) => {
      state.dietPlans = [];
      state.healthAdvisories = [];
      state.dietLoading = false;
      state.healthLoading = false;
      state.dietError = null;
      state.healthError = null;
      state.lastDietFetch = null;
      state.lastHealthFetch = null;
      });
  },
});

export const {
  refreshDietData,
  refreshHealthData,
  clearDietData,
  clearHealthData,
} = dietHealthSlice.actions;

export default dietHealthSlice.reducer;
