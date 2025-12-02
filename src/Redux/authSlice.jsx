// Redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for API calls
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/signup", {
        first_name: userData.firstname,
        last_name: userData.lastname,
        email: userData.email,
        mobile: userData.phone,
        password: userData.password,
        confirm_password: userData.confirmPassword
      });
      
      // Store tokens in localStorage if exists
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token || '');
        localStorage.setItem('user', JSON.stringify({
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          phone: userData.phone
        }));
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/login', {
        email: loginData.email,
        password: loginData.password
      });
      
      // Store tokens in localStorage
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token || '');
        localStorage.setItem('user', JSON.stringify({ 
          email: loginData.email 
        }));
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Refresh token function
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      
      if (!refresh_token) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post(`${API_BASE_URL}/refresh-token`, {
        refresh_token: refresh_token
      });
      
      // Update tokens in localStorage
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token || refresh_token);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get initial state from localStorage
const getInitialState = () => {
  const access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');
  const user = localStorage.getItem('user');
  
  return {
    user: user ? JSON.parse(user) : null,
    access_token: access_token || null,
    refresh_token: refresh_token || null,
    loading: false,
    error: null,
    isAuthenticated: !!access_token
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      // Clear all tokens from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Clear Redux state
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          firstname: action.meta.arg.firstname,
          lastname: action.meta.arg.lastname,
          email: action.meta.arg.email,
          phone: action.meta.arg.phone
        };
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = { email: action.meta.arg.email };
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      
      // Refresh token cases
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token || state.refresh_token;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        // Don't logout immediately on refresh failure
        // Let the actual API call fail with 401
      });
  }
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;