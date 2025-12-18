import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api'; // Adjust path if needed

const initialState = {
  user: null,
  access_token: null,
  refresh_token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// REGISTER USER
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/signup', {
        first_name: userData.firstname,
        last_name: userData.lastname,
        email: userData.email,
        mobile: userData.phone,
        password: userData.password,
        confirm_password: userData.confirmPassword,
      });

      console.log('Register Response:', response);

      // Assuming API returns { status: true, message: "..." } on success
      if (response.status === true) {
        return response;
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      console.error('Register Error:', error);
      return rejectWithValue({
        status: false,
        message: error.message || 'Registration failed',
      });
    }
  }
);

// LOGIN USER
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', {
        email: loginData.email,
        password: loginData.password,
      });

      console.log('Login Response:', response);

      // Adjust based on your actual API response
      if (response.access_token || (response.status === true && response.access_token)) {
        return response;
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      console.error('Login Error:', error);
      return rejectWithValue({
        status: false,
        message: error.message || 'Login failed',
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
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          firstname: action.meta.arg.firstname,
          lastname: action.meta.arg.lastname,
          email: action.meta.arg.email,
          phone: action.meta.arg.phone,
        };
        state.isAuthenticated = false; // Registration ≠ login
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;
        const token = payload.access_token || payload.data?.access_token;
        const refresh = payload.refresh_token || payload.data?.refresh_token;
        const user = payload.user || payload.data?.user || { email: action.meta.arg.email };

        if (token) {
          state.isAuthenticated = true;
          state.access_token = token;
          state.refresh_token = refresh || null;
          state.user = user;
        } else {
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
