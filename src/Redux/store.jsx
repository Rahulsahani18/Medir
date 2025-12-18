// src/Redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { combineReducers } from 'redux';

// Import your slices
import doctorReducer from './doctorSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';
import locationReducer from './locationSlice'
import bookingReducer from './bookingSlice'
import appointmentReducer from './appointmentSlice'
import dietHealthReducer from './dietHealthSlice' // Add this

import { injectStore } from "../utils/axiosInterceptors";

// Combine reducers
const rootReducer = combineReducers({
  doctors: doctorReducer,
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
  book: bookingReducer,
  appointment: appointmentReducer,
  dietHealth: dietHealthReducer, // Add this
});

// Redux Persist configuration - Add dietHealth to whitelist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'dietHealth'], // Add dietHealth to persist
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor for PersistGate
export const persistor = persistStore(store);

// Inject store into axios interceptors
injectStore(store);