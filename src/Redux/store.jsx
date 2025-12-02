// Redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from './doctorSlice';
import authReducer from './authSlice'; // Import the auth reducer

export const store = configureStore({
  reducer: {
    doctors: doctorReducer,
    auth: authReducer, // Add auth reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});