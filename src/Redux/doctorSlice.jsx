import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api'; // Import the simple API utility

// Async thunk for fetching doctors
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      // Simple API call using our utility
      const response = await api.get('/doctors');
      
      // The api.get() already parses JSON, so response is the data object
      return response;
    } catch (error) {
      return rejectWithValue({ 
        message: error.message || 'Failed to fetch doctors' 
      });
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.doctors = [];
      });
  },
});

export const { clearError } = doctorSlice.actions;
export default doctorSlice.reducer;