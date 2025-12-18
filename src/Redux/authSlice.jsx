// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '../utils/api'; // Import the simple API utility

// // Async thunks for API calls
// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/signup', {
//         first_name: userData.firstname,
//         last_name: userData.lastname,
//         email: userData.email,
//         mobile: userData.phone,
//         password: userData.password,
//         confirm_password: userData.confirmPassword
//       });
      
//       console.log("Register Response:", response);
      
//       // Store user info (register doesn't return tokens)
//       if (response.status === true) {
//         localStorage.setItem('user', JSON.stringify({
//           firstname: userData.firstname,
//           lastname: userData.lastname,
//           email: userData.email,
//           phone: userData.phone
//         }));
//       }
      
//       return response;
      
//     } catch (error) {
//       console.error("Register Error:", error);
//       return rejectWithValue({ 
//         status: false, 
//         message: error.message || 'Registration failed' 
//       });
//     }
//   }
// );

// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (loginData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/login', {
//         email: loginData.email,
//         password: loginData.password
//       });
      
//       console.log("Login Response:", response);
      
//       // Store tokens in localStorage
//       if (response.status === true && response.access_token) {
//         localStorage.setItem('access_token', response.access_token);
//         localStorage.setItem('refresh_token', response.refresh_token || '');
//         localStorage.setItem('user', JSON.stringify({ 
//           email: loginData.email 
//         }));
//       }
      
//       return response;
      
//     } catch (error) {
//       console.error("Login Error:", error);
//       return rejectWithValue({ 
//         status: false, 
//         message: error.message || 'Login failed' 
//       });
//     }
//   }
// );

// // Get initial state from localStorage
// const getInitialState = () => {
//   const access_token = localStorage.getItem('access_token');
//   const refresh_token = localStorage.getItem('refresh_token');
//   const user = localStorage.getItem('user');
  
//   return {
//     user: user ? JSON.parse(user) : null,
//     access_token: access_token || null,
//     refresh_token: refresh_token || null,
//     loading: false,
//     error: null,
//     isAuthenticated: !!access_token
//   };
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: getInitialState(),
//   reducers: {
//     logout: (state) => {
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       localStorage.removeItem('user');
//       localStorage.removeItem('userProfile');
//       state.user = null;
//       state.access_token = null;
//       state.refresh_token = null;
//       state.isAuthenticated = false;
//       state.error = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     updateUser: (state, action) => {
//       state.user = { ...state.user, ...action.payload };
//       localStorage.setItem('user', JSON.stringify(state.user));
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Register cases
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         if (action.payload.status === true) {
//           state.user = {
//             firstname: action.meta.arg.firstname,
//             lastname: action.meta.arg.lastname,
//             email: action.meta.arg.email,
//             phone: action.meta.arg.phone
//           };
//           state.isAuthenticated = false; // User needs to login
//         }
//         state.error = null;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Login cases
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
        
//         if (action.payload.status === true && action.payload.access_token) {
//           state.isAuthenticated = true;
//           state.user = { email: action.meta.arg.email };
//           state.access_token = action.payload.access_token;
//           state.refresh_token = action.payload.refresh_token;
//         } else if (action.payload.status === false && !action.payload.access_token) {
//           state.isAuthenticated = false;
//           state.error = { 
//             status: false, 
//             message: 'Something error' 
//           };
//         }
        
//         state.error = null;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const { logout, clearError, updateUser } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// ✅ INITIAL STATE - No localStorage calls!
const initialState = {
  user: null,
  access_token: null,
  refresh_token: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

// ✅ REGISTER - No localStorage calls!
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
        confirm_password: userData.confirmPassword
      });
      
      console.log("Register Response:", response);
      
      // ✅ Just return response, Redux Persist will handle storage
      return response;
      
    } catch (error) {
      console.error("Register Error:", error);
      return rejectWithValue({ 
        status: false, 
        message: error.message || 'Registration failed' 
      });
    }
  }
);

// ✅ LOGIN - No localStorage calls!
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', {
        email: loginData.email,
        password: loginData.password
      });
      
      console.log("Login Response:", response);
      
      if (response.status === true && response.access_token) {
        // ✅ Return structured data for Redux state
        // return {
        //   access_token: response.access_token,
        //   refresh_token: response.refresh_token || null,
        //   user: { email: loginData.email }
        // };
        return response;
      } else {
        // Handle login failure
        throw new Error(response.message || 'Login failed');
      }
      
    } catch (error) {
      console.error("Login Error:", error);
      return rejectWithValue({ 
        status: false, 
        message: error.message || 'Login failed' 
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ✅ LOGOUT - No localStorage calls!
    logout: (state) => {
      // Just clear Redux state - Redux Persist will handle localStorage
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // ✅ UPDATE USER - No localStorage calls!
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Redux Persist will automatically save to localStorage
    },
    
    // Optional: Set tokens manually if needed
    setTokens: (state, action) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.isAuthenticated = !!action.payload.access_token;
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
        if (action.payload.status === true) {
          // Set user data in Redux state
          state.user = {
            firstname: action.meta.arg.firstname,
            lastname: action.meta.arg.lastname,
            email: action.meta.arg.email,
            phone: action.meta.arg.phone
          };
          state.isAuthenticated = false; // Registration doesn't auto-login
        }
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        
        // Check if action.payload is the structured response from loginUser thunk
        if (action.payload.access_token) {
          state.isAuthenticated = true;
          state.access_token = action.payload.access_token;
          state.refresh_token = action.payload.refresh_token;
          state.user = action.payload.user || { email: action.meta.arg.email };
        } else if (action.payload.status === false) {
          // Handle API returning status: false
          state.isAuthenticated = false;
          state.error = { 
            status: false, 
            message: action.payload.message || 'Login failed' 
          };
        }
        
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  }
});

export const { logout, clearError, updateUser, setTokens } = authSlice.actions;
export default authSlice.reducer;