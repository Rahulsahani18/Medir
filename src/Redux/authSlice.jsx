import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// ✅ INITIAL STATE
const initialState = {
  user: null,
  access_token: null,
  refresh_token: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

// ✅ REGISTER USER - Using form-urlencoded to avoid CORS preflight
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new URLSearchParams();
      formData.append('first_name', userData.firstname);
      formData.append('last_name', userData.lastname);
      formData.append('email', userData.email);
      formData.append('mobile', userData.phone);
      formData.append('password', userData.password);
      formData.append('confirm_password', userData.confirmPassword);

      const response = await api.post('/signup', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log("Register Response:", response);

      return response; // Let Redux Persist handle storage if needed
    } catch (error) {
      console.error("Register Error:", error);
      return rejectWithValue({
        status: false,
        message: error.response?.data?.message || error.message || 'Registration failed'
      });
    }
  }
);

// ✅ LOGIN USER - Using form-urlencoded to avoid CORS preflight
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const formData = new URLSearchParams();
      formData.append('email', loginData.email);
      formData.append('password', loginData.password);

      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log("Login Response:", response);

      // Adjust based on your actual API response structure
      // Common patterns: { status: true, access_token: "...", user: {...} }
      // or { data: { access_token: ... }, message: "success" }

      if (response?.access_token || (response?.status === true && response?.data?.access_token)) {
        return response; // Full response or normalized
      } else {
        throw new Error(response?.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error("Login Error:", error);
      return rejectWithValue({
        status: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
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
    },
    setTokens: (state, action) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token || null;
      state.isAuthenticated = !!action.payload.access_token;
    },
  },
  extraReducers: (builder) => {
    builder
      // === REGISTER ===
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming registration doesn't auto-login
        // You can optionally auto-login here if API returns token
        state.user = {
          firstname: action.meta.arg.firstname,
          lastname: action.meta.arg.lastname,
          email: action.meta.arg.email,
          phone: action.meta.arg.phone,
        };
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === LOGIN ===
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        // Flexible handling for different response shapes
        const accessToken = payload.access_token || payload.data?.access_token;
        const refreshToken = payload.refresh_token || payload.data?.refresh_token;
        const userData = payload.user || payload.data?.user || { email: action.meta.arg.email };

        if (accessToken) {
          state.isAuthenticated = true;
          state.access_token = accessToken;
          state.refresh_token = refreshToken || null;
          state.user = userData;
        } else {
          state.isAuthenticated = false;
          state.error = { message: payload.message || 'Login failed' };
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, updateUser, setTokens } = authSlice.actions;
export default authSlice.reducer;
