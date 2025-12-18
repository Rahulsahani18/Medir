import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./authSlice";
import apiClient from "../utils/axiosInterceptors";

// ✅ UPDATED: Get token from Redux state (not localStorage)
const getAuthToken = (getState) => {
  const state = getState();
  return state.auth?.access_token; // Get from Redux (persisted by Redux Persist)
};

// Cache duration (1 hour = 3600000 ms)
const CACHE_DURATION = 3600000;

// Check if cache is valid
const isCacheValid = (state) => {
  if (!state.profile || !state.cacheTimestamp) return false;
  
  const currentTime = Date.now();
  const cacheAge = currentTime - state.cacheTimestamp;
  return cacheAge < CACHE_DURATION;
};

// Save cache timestamp
const saveCacheTimestamp = (state) => {
  state.cacheTimestamp = Date.now();
};

// FETCH PROFILE - With Redux Persist caching
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (forceRefresh = false, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState); // Get from Redux state
      if (!token) {
        throw new Error("No authentication token found. Please login.");
      }

      const state = getState().user;
      
      // Check cache first if not forcing refresh
      if (!forceRefresh && isCacheValid(state)) {
        console.log("Returning cached profile from Redux state");
        return state.profile; // Return from Redux state (persisted)
      }

      // Fetch fresh data from API
      const response = await apiClient.get("/profile");
      console.log("Profile API Response:", response.data);

      if (response.data.status === true && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Fetch profile error:", error);

      // If API fails, try to return cached data from Redux state
      const state = getState().user;
      if (state.profile) {
        console.log("API failed, returning cached profile from Redux state");
        return state.profile;
      }

      let errorMessage = "Failed to fetch user profile";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Unauthorized - Please login again";
        } else if (error.response.status === 404) {
          errorMessage = "Profile endpoint not found";
        } else {
          errorMessage =
            error.response.data?.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error - Cannot connect to server";
      } else {
        errorMessage = error.message;
      }

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

// Force refresh profile (clear cache and fetch fresh)
export const forceRefreshUserProfile = createAsyncThunk(
  "user/forceRefreshUserProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState); // Get from Redux state
      if (!token) {
        throw new Error("No authentication token found. Please login.");
      }

      // Fetch fresh data
      const response = await apiClient.get("/profile");
      console.log("Force refresh profile response:", response.data);

      if (response.data.status === true && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Force refresh profile error:", error);
      
      let errorMessage = "Failed to refresh profile";
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Unauthorized - Please login again";
        } else if (error.response.status === 404) {
          errorMessage = "Profile endpoint not found";
        } else {
          errorMessage =
            error.response.data?.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error - Cannot connect to server";
      } else {
        errorMessage = error.message;
      }

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

// UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (profileData, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getAuthToken(getState); // Get from Redux state
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Sending profile update data:", profileData);

      const response = await apiClient.post("/profile_update", profileData);
      console.log("Update profile response:", response.data);

      // Check response for success
      const responseText =
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data);

      const isSuccess =
        responseText.includes('"status":true') ||
        responseText.includes("successfully") ||
        response.data?.status === true;

      if (isSuccess) {
        // After successful update, force refresh profile data
        dispatch(forceRefreshUserProfile());

        return {
          message: "Profile updated successfully",
          updateData: profileData,
        };
      } else {
        throw new Error(response.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);

      let errorMessage = "Failed to update user profile";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Unauthorized - Please login again";
        } else {
          errorMessage =
            error.response.data?.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error - Cannot connect to server";
      } else {
        errorMessage = error.message;
      }

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

// UPLOAD PROFILE PHOTO
export const uploadProfilePhoto = createAsyncThunk(
  "user/uploadProfilePhoto",
  async (file, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getAuthToken(getState); // Get from Redux state
      if (!token) {
        throw new Error("No authentication token found");
      }

      // File validation
      if (file.size > 4 * 1024 * 1024) {
        throw new Error("File size should be less than 4MB");
      }

      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/svg+xml",
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error("Only JPG, PNG, and SVG files are allowed");
      }

      // Create preview URL for immediate UI update
      const previewUrl = URL.createObjectURL(file);
      dispatch(setTemporaryAvatar(previewUrl));

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await apiClient.post("/profile_update", formData);
      console.log("Upload photo response:", response.data);

      // Check response for success
      const responseText =
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data);

      const isSuccess =
        responseText.includes('"status":true') ||
        responseText.includes("successfully") ||
        response.data?.status === true;

      if (isSuccess) {
        // After successful upload, force refresh profile data
        dispatch(forceRefreshUserProfile());

        return {
          message: "Profile photo uploaded successfully",
        };
      } else {
        throw new Error(response.data?.message || "Failed to upload photo");
      }
    } catch (error) {
      console.error("Upload profile photo error:", error);

      let errorMessage = "Failed to upload profile photo";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Unauthorized - Please login again";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Error ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error - Cannot connect to server";
      } else {
        errorMessage = error.message;
      }

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

// ✅ UPDATED: Initial state with cache timestamp
const initialState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  uploadLoading: false,
  uploadError: null,
  previousProfile: null,
  tempAvatar: null,
  locationIds: {
    city_id: null,
    state_id: null,
    country_id: null,
  },
  cacheTimestamp: null, // ✅ Add cache timestamp
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
      state.updateError = null;
      state.uploadError = null;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.previousProfile = null;
      state.tempAvatar = null;
      state.cacheTimestamp = null; // Clear cache timestamp
      state.locationIds = {
        city_id: null,
        state_id: null,
        country_id: null,
      };
    },
    // Set temporary avatar for immediate preview
    setTemporaryAvatar: (state, action) => {
      state.tempAvatar = action.payload;
    },
    // Clear temporary avatar
    clearTemporaryAvatar: (state) => {
      if (state.tempAvatar) {
        URL.revokeObjectURL(state.tempAvatar);
      }
      state.tempAvatar = null;
    },
    // Update profile locally
    updateProfileLocally: (state, action) => {
      if (state.profile) {
        state.previousProfile = { ...state.profile };
        state.profile = { ...state.profile, ...action.payload };
        saveCacheTimestamp(state); // Update cache timestamp
      }
    },
    // Update location IDs
    updateLocationIds: (state, action) => {
      const { city_id, state_id, country_id } = action.payload;
      if (city_id !== undefined) state.locationIds.city_id = city_id;
      if (state_id !== undefined) state.locationIds.state_id = state_id;
      if (country_id !== undefined) state.locationIds.country_id = country_id;
    },
    // Update address fields locally
    updateAddressLocally: (state, action) => {
      if (state.profile) {
        state.previousProfile = { ...state.profile };
        state.profile = {
          ...state.profile,
          address: action.payload.address || state.profile.address,
          pincode: action.payload.pincode || state.profile.pincode,
        };
        saveCacheTimestamp(state); // Update cache timestamp
      }
    },
    // Revert local update
    revertLocalUpdate: (state) => {
      if (state.previousProfile) {
        state.profile = state.previousProfile;
        state.previousProfile = null;
      }
    },
    // Update specific field immediately
    updateFieldImmediately: (state, action) => {
      const { field, value } = action.payload;
      if (state.profile) {
        state.profile[field] = value;
        saveCacheTimestamp(state); // Update cache timestamp
      }
    },
    // Manual cache invalidation
    invalidateProfileCache: (state) => {
      state.cacheTimestamp = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        saveCacheTimestamp(state); // ✅ Save cache timestamp on successful fetch
        state.error = null;
        // Clear temp avatar when fresh data arrives
        if (state.tempAvatar) {
          URL.revokeObjectURL(state.tempAvatar);
        }
        state.tempAvatar = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Force Refresh Profile cases
      .addCase(forceRefreshUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forceRefreshUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        saveCacheTimestamp(state); // ✅ Save cache timestamp
        state.error = null;
        if (state.tempAvatar) {
          URL.revokeObjectURL(state.tempAvatar);
        }
        state.tempAvatar = null;
      })
      .addCase(forceRefreshUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateError = null;
        state.previousProfile = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      // Upload Profile Photo cases
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state) => {
        state.uploadLoading = false;
        state.uploadError = null;
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.payload;
        // Clear temp avatar on error
        if (state.tempAvatar) {
          URL.revokeObjectURL(state.tempAvatar);
        }
        state.tempAvatar = null;
      })
      
      // Handle logout - clear everything
      .addCase(logout, (state) => {
        // Clear all state
        state.profile = null;
        state.loading = false;
        state.error = null;
        state.updateLoading = false;
        state.updateError = null;
        state.uploadLoading = false;
        state.uploadError = null;
        state.previousProfile = null;
        state.cacheTimestamp = null; // Clear cache
        
        // Clear temp avatar URL
        if (state.tempAvatar) {
          URL.revokeObjectURL(state.tempAvatar);
        }
        state.tempAvatar = null;
        
        state.locationIds = {
          city_id: null,
          state_id: null,
          country_id: null,
        };
      });
  },
});

export const {
  clearUserError,
  clearUserProfile,
  setTemporaryAvatar,
  clearTemporaryAvatar,
  updateProfileLocally,
  updateLocationIds,
  updateAddressLocally,
  revertLocalUpdate,
  updateFieldImmediately,
  invalidateProfileCache,
} = userSlice.actions;

export default userSlice.reducer;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { logout } from "./authSlice";
// import apiClient from "../utils/axiosInterceptors";

// // ✅ UPDATED: Get token from Redux state
// const getAuthToken = (getState) => {
//   const state = getState();
//   return state.auth?.access_token;
// };

// // Cache duration (reduced for better validation)
// const CACHE_DURATION = 300000; // 5 minutes instead of 1 hour

// // Check if cache is valid
// const isCacheValid = (state) => {
//   if (!state.profile || !state.cacheTimestamp) return false;
  
//   const currentTime = Date.now();
//   const cacheAge = currentTime - state.cacheTimestamp;
//   return cacheAge < CACHE_DURATION;
// };

// // Save cache timestamp
// const saveCacheTimestamp = (state) => {
//   state.cacheTimestamp = Date.now();
// };

// // ✅ UPDATED: FETCH PROFILE - Always validate token on page mount
// export const fetchUserProfile = createAsyncThunk(
//   "user/fetchUserProfile",
//   async (_, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const token = getAuthToken(getState);
      
//       // Always check if token exists first
//       if (!token) {
//         console.log("No token found, skipping profile fetch");
//         throw new Error("No authentication token found");
//       }

//       // ✅ IMPORTANT: Always fetch from API to validate token
//       // This will trigger axios interceptor if token is expired
//       const response = await apiClient.get("/profile");
//       console.log("Profile API Response:", response.data);

//       if (response.data.status === true && response.data.data) {
//         return response.data.data;
//       } else {
//         throw new Error(response.data.message || "Failed to fetch profile");
//       }
//     } catch (error) {
//       console.error("Fetch profile error:", error);
      
//       // Let the axios interceptor handle 401 errors
//       // It will automatically logout and redirect if token is expired
      
//       // Only return cached data if it's a non-401 error and we have cached data
//       if (error.response?.status !== 401) {
//         const state = getState().user;
//         if (state.profile) {
//           console.log("Non-401 error, returning cached profile");
//           return state.profile;
//         }
//       }
      
//       // For 401 or no cached data, throw error
//       let errorMessage = "Failed to fetch user profile";

//       if (error.response) {
//         if (error.response.status === 401) {
//           // Let interceptor handle this - it will logout and redirect
//           errorMessage = "Session expired";
//         } else if (error.response.status === 404) {
//           errorMessage = "Profile endpoint not found";
//         } else {
//           errorMessage = error.response.data?.message || `Error ${error.response.status}`;
//         }
//       } else if (error.request) {
//         errorMessage = "Network error - Cannot connect to server";
//       } else {
//         errorMessage = error.message;
//       }

//       return rejectWithValue({
//         message: errorMessage,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//     }
//   }
// );

// // ✅ NEW: Check if token is valid without fetching full profile
// export const validateToken = createAsyncThunk(
//   "user/validateToken",
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const token = getAuthToken(getState);
      
//       if (!token) {
//         return { isValid: false, message: "No token found" };
//       }

//       // Make a lightweight request to validate token
//       const response = await apiClient.get("/profile");
      
//       return {
//         isValid: response.data.status === true,
//         message: "Token is valid"
//       };
//     } catch (error) {
//       console.error("Token validation error:", error);
//       return rejectWithValue({
//         isValid: false,
//         message: error.response?.status === 401 ? "Token expired" : "Token validation failed"
//       });
//     }
//   }
// );

// // Force refresh profile
// export const forceRefreshUserProfile = createAsyncThunk(
//   "user/forceRefreshUserProfile",
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const token = getAuthToken(getState);
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await apiClient.get("/profile");
//       console.log("Force refresh profile response:", response.data);

//       if (response.data.status === true && response.data.data) {
//         return response.data.data;
//       } else {
//         throw new Error(response.data.message || "Failed to fetch profile");
//       }
//     } catch (error) {
//       console.error("Force refresh profile error:", error);
      
//       let errorMessage = "Failed to refresh profile";
      
//       if (error.response) {
//         if (error.response.status === 401) {
//           errorMessage = "Session expired";
//         } else if (error.response.status === 404) {
//           errorMessage = "Profile endpoint not found";
//         } else {
//           errorMessage = error.response.data?.message || `Error ${error.response.status}`;
//         }
//       } else if (error.request) {
//         errorMessage = "Network error - Cannot connect to server";
//       } else {
//         errorMessage = error.message;
//       }

//       return rejectWithValue({
//         message: errorMessage,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//     }
//   }
// );

// // UPDATE PROFILE (keep existing)
// export const updateUserProfile = createAsyncThunk(
//   "user/updateUserProfile",
//   async (profileData, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const token = getAuthToken(getState);
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       console.log("Sending profile update data:", profileData);

//       const response = await apiClient.post("/profile_update", profileData);
//       console.log("Update profile response:", response.data);

//       const responseText = typeof response.data === "string" 
//         ? response.data 
//         : JSON.stringify(response.data);

//       const isSuccess = responseText.includes('"status":true') ||
//         responseText.includes("successfully") ||
//         response.data?.status === true;

//       if (isSuccess) {
//         dispatch(forceRefreshUserProfile());
//         return {
//           message: "Profile updated successfully",
//           updateData: profileData,
//         };
//       } else {
//         throw new Error(response.data?.message || "Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Update profile error:", error);

//       let errorMessage = "Failed to update user profile";

//       if (error.response) {
//         if (error.response.status === 401) {
//           errorMessage = "Session expired";
//         } else {
//           errorMessage = error.response.data?.message || `Error ${error.response.status}`;
//         }
//       } else if (error.request) {
//         errorMessage = "Network error - Cannot connect to server";
//       } else {
//         errorMessage = error.message;
//       }

//       return rejectWithValue({
//         message: errorMessage,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//     }
//   }
// );

// // UPLOAD PROFILE PHOTO (keep existing)
// export const uploadProfilePhoto = createAsyncThunk(
//   "user/uploadProfilePhoto",
//   async (file, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const token = getAuthToken(getState);
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       if (file.size > 4 * 1024 * 1024) {
//         throw new Error("File size should be less than 4MB");
//       }

//       const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
//       if (!validTypes.includes(file.type)) {
//         throw new Error("Only JPG, PNG, and SVG files are allowed");
//       }

//       const previewUrl = URL.createObjectURL(file);
//       dispatch(setTemporaryAvatar(previewUrl));

//       const formData = new FormData();
//       formData.append("avatar", file);

//       const response = await apiClient.post("/profile_update", formData);
//       console.log("Upload photo response:", response.data);

//       const responseText = typeof response.data === "string" 
//         ? response.data 
//         : JSON.stringify(response.data);

//       const isSuccess = responseText.includes('"status":true') ||
//         responseText.includes("successfully") ||
//         response.data?.status === true;

//       if (isSuccess) {
//         dispatch(forceRefreshUserProfile());
//         return { message: "Profile photo uploaded successfully" };
//       } else {
//         throw new Error(response.data?.message || "Failed to upload photo");
//       }
//     } catch (error) {
//       console.error("Upload profile photo error:", error);

//       let errorMessage = "Failed to upload profile photo";

//       if (error.response) {
//         if (error.response.status === 401) {
//           errorMessage = "Session expired";
//         } else if (error.response.data?.message) {
//           errorMessage = error.response.data.message;
//         } else {
//           errorMessage = `Error ${error.response.status}`;
//         }
//       } else if (error.request) {
//         errorMessage = "Network error - Cannot connect to server";
//       } else {
//         errorMessage = error.message;
//       }

//       return rejectWithValue({
//         message: errorMessage,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//     }
//   }
// );

// // Initial state
// const initialState = {
//   profile: null,
//   loading: false,
//   error: null,
//   updateLoading: false,
//   updateError: null,
//   uploadLoading: false,
//   uploadError: null,
//   previousProfile: null,
//   tempAvatar: null,
//   locationIds: {
//     city_id: null,
//     state_id: null,
//     country_id: null,
//   },
//   cacheTimestamp: null,
//   tokenValid: false, // ✅ NEW: Track token validity
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     clearUserError: (state) => {
//       state.error = null;
//       state.updateError = null;
//       state.uploadError = null;
//     },
//     clearUserProfile: (state) => {
//       state.profile = null;
//       state.previousProfile = null;
//       state.tempAvatar = null;
//       state.cacheTimestamp = null;
//       state.tokenValid = false; // Reset token validity
//       state.locationIds = {
//         city_id: null,
//         state_id: null,
//         country_id: null,
//       };
//     },
//     setTokenValid: (state, action) => {
//       state.tokenValid = action.payload;
//     },
//     // ... (keep existing reducers)
//     setTemporaryAvatar: (state, action) => {
//       state.tempAvatar = action.payload;
//     },
//     clearTemporaryAvatar: (state) => {
//       if (state.tempAvatar) {
//         URL.revokeObjectURL(state.tempAvatar);
//       }
//       state.tempAvatar = null;
//     },
//     updateProfileLocally: (state, action) => {
//       if (state.profile) {
//         state.previousProfile = { ...state.profile };
//         state.profile = { ...state.profile, ...action.payload };
//         saveCacheTimestamp(state);
//       }
//     },
//     updateLocationIds: (state, action) => {
//       const { city_id, state_id, country_id } = action.payload;
//       if (city_id !== undefined) state.locationIds.city_id = city_id;
//       if (state_id !== undefined) state.locationIds.state_id = state_id;
//       if (country_id !== undefined) state.locationIds.country_id = country_id;
//     },
//     updateAddressLocally: (state, action) => {
//       if (state.profile) {
//         state.previousProfile = { ...state.profile };
//         state.profile = {
//           ...state.profile,
//           address: action.payload.address || state.profile.address,
//           pincode: action.payload.pincode || state.profile.pincode,
//         };
//         saveCacheTimestamp(state);
//       }
//     },
//     revertLocalUpdate: (state) => {
//       if (state.previousProfile) {
//         state.profile = state.previousProfile;
//         state.previousProfile = null;
//       }
//     },
//     updateFieldImmediately: (state, action) => {
//       const { field, value } = action.payload;
//       if (state.profile) {
//         state.profile[field] = value;
//         saveCacheTimestamp(state);
//       }
//     },
//     invalidateProfileCache: (state) => {
//       state.cacheTimestamp = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Profile cases
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.profile = action.payload;
//         saveCacheTimestamp(state);
//         state.tokenValid = true; // ✅ Token is valid
//         state.error = null;
//         if (state.tempAvatar) {
//           URL.revokeObjectURL(state.tempAvatar);
//         }
//         state.tempAvatar = null;
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         // If error is 401, token is not valid
//         if (action.payload?.status === 401) {
//           state.tokenValid = false;
//         }
//       })

//       // Token validation cases
//       .addCase(validateToken.fulfilled, (state, action) => {
//         state.tokenValid = action.payload.isValid;
//       })
//       .addCase(validateToken.rejected, (state) => {
//         state.tokenValid = false;
//       })

//       // Force Refresh Profile cases
//       .addCase(forceRefreshUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(forceRefreshUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.profile = action.payload;
//         saveCacheTimestamp(state);
//         state.tokenValid = true;
//         state.error = null;
//         if (state.tempAvatar) {
//           URL.revokeObjectURL(state.tempAvatar);
//         }
//         state.tempAvatar = null;
//       })
//       .addCase(forceRefreshUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         if (action.payload?.status === 401) {
//           state.tokenValid = false;
//         }
//       })

//       // Update Profile cases
//       .addCase(updateUserProfile.pending, (state) => {
//         state.updateLoading = true;
//         state.updateError = null;
//       })
//       .addCase(updateUserProfile.fulfilled, (state) => {
//         state.updateLoading = false;
//         state.updateError = null;
//         state.previousProfile = null;
//       })
//       .addCase(updateUserProfile.rejected, (state, action) => {
//         state.updateLoading = false;
//         state.updateError = action.payload;
//       })

//       // Upload Profile Photo cases
//       .addCase(uploadProfilePhoto.pending, (state) => {
//         state.uploadLoading = true;
//         state.uploadError = null;
//       })
//       .addCase(uploadProfilePhoto.fulfilled, (state) => {
//         state.uploadLoading = false;
//         state.uploadError = null;
//       })
//       .addCase(uploadProfilePhoto.rejected, (state, action) => {
//         state.uploadLoading = false;
//         state.uploadError = action.payload;
//         if (state.tempAvatar) {
//           URL.revokeObjectURL(state.tempAvatar);
//         }
//         state.tempAvatar = null;
//       })
      
//       // Handle logout
//       .addCase(logout, (state) => {
//         state.profile = null;
//         state.loading = false;
//         state.error = null;
//         state.updateLoading = false;
//         state.updateError = null;
//         state.uploadLoading = false;
//         state.uploadError = null;
//         state.previousProfile = null;
//         state.cacheTimestamp = null;
//         state.tokenValid = false;
        
//         if (state.tempAvatar) {
//           URL.revokeObjectURL(state.tempAvatar);
//         }
//         state.tempAvatar = null;
        
//         state.locationIds = {
//           city_id: null,
//           state_id: null,
//           country_id: null,
//         };
//       });
//   },
// });

// export const {
//   clearUserError,
//   clearUserProfile,
//   setTokenValid,
//   setTemporaryAvatar,
//   clearTemporaryAvatar,
//   updateProfileLocally,
//   updateLocationIds,
//   updateAddressLocally,
//   revertLocalUpdate,
//   updateFieldImmediately,
//   invalidateProfileCache,
// } = userSlice.actions;

// export default userSlice.reducer;