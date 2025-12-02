import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching doctors
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      // const response = await axios.get('https://oswal.omsoftsolution.in/doctor/doctor/api/doctors');
      const response = await axios.get('/api/doctors');
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
        state.error = action.payload || 'Failed to fetch doctors';
        state.doctors = [];
      });
  },
});

export const { clearError } = doctorSlice.actions;
export default doctorSlice.reducer;