// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { Navigate } from 'react-router-dom';

// // Helper function to get token
// const getAuthToken = (getState) => {
//   const state = getState();
//   return state.auth?.access_token || localStorage.getItem("access_token");
// };

// // Create axios instance for API calls - Use FormData instead of JSON
// const createApiClient = (token) => {
//   const headers = {};
  
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   // Note: We're NOT setting Content-Type header - let axios set it automatically for FormData
//   return axios.create({
//     baseURL: '/api', // This will be proxied by Vite
//     headers: headers,
//     timeout: 10000,
//   });
// };

// // Async thunk for booking appointment
// export const bookAppointment = createAsyncThunk(
//   'book/appointment',
//   async (bookingData, thunkAPI) => {
//     try {
//       const token = getAuthToken(thunkAPI.getState);
//       const apiClient = createApiClient(token);
      
//       console.log('Original booking data:', bookingData);
      
//       // Create FormData instead of JSON
//       const formData = new FormData();
      
//       // Append ALL required fields - ensure they're not empty or undefined
//       const requiredFields = [
//         'doctor_id',
//         'consultation_type_id', 
//         'date',
//         'time_slot',
//         'first_name',
//         'last_name',
//         'phone',
//         'email',
//         'patient_type'
//       ];
      
//       // Also include optional fields
//       const optionalFields = ['symptoms', 'reason', 'attachment'];
      
//       // Append required fields
//       requiredFields.forEach(field => {
//         const value = bookingData[field] || '';
//         console.log(`Appending ${field}:`, value);
//         formData.append(field, value.toString().trim());
//       });
      
//       // Append optional fields if they exist
//       optionalFields.forEach(field => {
//         if (bookingData[field]) {
//           console.log(`Appending ${field}:`, bookingData[field]);
//           formData.append(field, bookingData[field]);
//         }
//       });
      
//       // Log FormData contents for debugging
//       console.log('FormData entries:');
//       for (let pair of formData.entries()) {
//         console.log(pair[0] + ':', pair[1]);
//       }
      

//       // with the correct boundary
//       const response = await apiClient.post('/book_appointment', formData);
      
//       console.log('Booking response received:', response.data);
      
//       // Return the exact backend response
//       return response.data;
      
//     } catch (error) {
//       console.error('Booking error details:', error);
      
//       let errorMessage = '';
      
//       // Extract ONLY backend error message
//       if (error.response && error.response.data) {
//         console.error('Error response data:', error.response.data);
//         window.location.href("/auth")
        
//         // Use only the backend message if it exists
//         if (error.response.data.msg) {
//           errorMessage = error.response.data.msg;
//         } else if (typeof error.response.data === 'string') {
//           errorMessage = error.response.data;
//         } else {
//           errorMessage = 'An error occurred';
//           window.location.href("/auth")
//         }
//       } else if (error.request) {
//         errorMessage = 'Network error - Cannot connect to server';
//           window.location.href("/auth")
//       } else {
//         errorMessage = error.message;
//       }

//       // Return only the error message string
//       return thunkAPI.rejectWithValue(errorMessage);
//     }
//   }
// );

// const initialState = {
//   isLoading: false,
//   isSuccess: false,
//   isError: false,
//   message: '', // This will contain only backend messages
//   appointmentData: null,
// };

// const bookSlice = createSlice({
//   name: 'book',
//   initialState,
//   reducers: {
//     resetBookingState: (state) => {
//       state.isLoading = false;
//       state.isSuccess = false;
//       state.isError = false;
//       state.message = '';
//       state.appointmentData = null;
//     },
//     clearBookingError: (state) => {
//       state.isError = false;
//       state.message = '';
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(bookAppointment.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false;
//         state.isSuccess = false;
//         state.message = '';
//         state.appointmentData = null;
//       })
//       .addCase(bookAppointment.fulfilled, (state, action) => {
//         state.isLoading = false;
        
//         if (action.payload && typeof action.payload === 'object') {
//           // Use only backend status and message
//           state.isSuccess = Boolean(action.payload.status);
//           state.isError = !action.payload.status;
          
//           // ONLY show backend message, no frontend modifications
//           if (action.payload.msg) {
//             state.message = action.payload.msg;
//           } else if (action.payload.status) {
//             // If backend returns success without message, show generic success
//             state.message = 'Appointment booked successfully';
//           } else {
//             // If backend returns failure without message
//             state.message = 'Failed to book appointment';
//           }
          
//           state.appointmentData = action.payload;
//         } else {
//           state.isSuccess = false;
//           state.isError = true;
//           state.message = 'Invalid response from server';
//           state.appointmentData = null;
//         }
//       })
//       .addCase(bookAppointment.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.isSuccess = false;
        
//         // action.payload contains ONLY the backend error message
//         state.message = action.payload || 'Network error occurred';
//         state.appointmentData = null;
//       });
//   },
// });

// export const { resetBookingState, clearBookingError } = bookSlice.actions;
// export default bookSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/axiosInterceptors';
import axios from 'axios';

// Helper function to get token
const getAuthToken = (getState) => {
  const state = getState();
  return state.auth?.access_token || localStorage.getItem("access_token");
};

// Create axios instance for API calls
// const createApiClient = (token) => {
//   const headers = {};
  
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   return axios.create({
//     baseURL: '/api',
//     headers: headers,
//     timeout: 10000,
//   });
// };

// Async thunk for booking appointment
export const bookAppointment = createAsyncThunk(
  'book/appointment',
  async (bookingData, thunkAPI) => {
    try {
      const token = getAuthToken(thunkAPI.getState);
      
      // Check if token exists before making the request
      if (!token) {
        // Dispatch an action to trigger redirect in component
        return thunkAPI.rejectWithValue({
          message: 'No authentication token found',
          redirectToAuth: true
        });
      }
      
      // const apiClient = createApiClient(token);
      
      console.log('Original booking data:', bookingData);
      
      // Create FormData
      const formData = new FormData();
      
      const requiredFields = [
        'doctor_id',
        'consultation_type_id', 
        'date',
        'time_slot',
        'first_name',
        'last_name',
        'phone',
        'email',
        'patient_type'
      ];
      
      const optionalFields = ['symptoms', 'reason', 'attachment'];
      
      // Append required fields
      requiredFields.forEach(field => {
        const value = bookingData[field] || '';
        formData.append(field, value.toString().trim());
      });
      
      // Append optional fields if they exist
      optionalFields.forEach(field => {
        if (bookingData[field]) {
          formData.append(field, bookingData[field]);
        }
      });
      
      // Log FormData contents for debugging
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      const response = await apiClient.post('/book_appointment', formData);
      console.log('Booking response received:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('Booking error details:', error);
      
      let errorMessage = '';
      let redirectToAuth = false;
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        
        // Check for 401 Unauthorized or invalid token
        if (error.response.status === 401) {
          redirectToAuth = true;
          errorMessage = 'Session expired. Please login again.';
          
          // Clear invalid token from storage
          localStorage.removeItem('access_token');
        } 
        // Extract backend error message
        else if (error.response.data.msg) {
          errorMessage = error.response.data.msg;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else {
          errorMessage = 'An error occurred';
        }
      } else if (error.request) {
        errorMessage = 'Network error - Cannot connect to server';
      } else {
        errorMessage = error.message;
      }

      // Return error with redirect flag
      return thunkAPI.rejectWithValue({
        message: errorMessage,
        redirectToAuth: redirectToAuth
      });
    }
  }
);

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  appointmentData: null,
  redirectToAuth: false, // Add redirect flag to state
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.appointmentData = null;
      state.redirectToAuth = false; // Reset redirect flag
    },
    clearBookingError: (state) => {
      state.isError = false;
      state.message = '';
      state.redirectToAuth = false; // Reset redirect flag
    },
    resetRedirectFlag: (state) => {
      state.redirectToAuth = false; // Explicit action to reset redirect
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
        state.appointmentData = null;
        state.redirectToAuth = false;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.redirectToAuth = false;
        
        if (action.payload && typeof action.payload === 'object') {
          state.isSuccess = Boolean(action.payload.status);
          state.isError = !action.payload.status;
          
          if (action.payload.msg) {
            state.message = action.payload.msg;
          } else if (action.payload.status) {
            state.message = 'Appointment booked successfully';
          } else {
            state.message = 'Failed to book appointment';
          }
          
          state.appointmentData = action.payload;
        } else {
          state.isSuccess = false;
          state.isError = true;
          state.message = 'Invalid response from server';
          state.appointmentData = null;
        }
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        
        // Check if payload has redirect flag
        if (action.payload && typeof action.payload === 'object') {
          state.message = action.payload.message || 'Network error occurred';
          state.redirectToAuth = action.payload.redirectToAuth || false;
        } else {
          state.message = action.payload || 'Network error occurred';
          state.redirectToAuth = false;
        }
        
        state.appointmentData = null;
      });
  },
});

export const { resetBookingState, clearBookingError, resetRedirectFlag } = bookSlice.actions;
export default bookSlice.reducer;