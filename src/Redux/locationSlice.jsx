// locationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const createApiClient = () => {
  return axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    },
    // timeout: 10000,
  });
};

// Helper function to remove duplicates by ID
const removeDuplicatesById = (array) => {
  const seen = new Set();
  return array.filter(item => {
    const duplicate = seen.has(item.id);
    seen.add(item.id);
    return !duplicate;
  });
};

// Fetch countries
export const fetchCountries = createAsyncThunk(
  'location/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get('/countries');
      
      if (response.data.status === true && response.data.data) {
        const uniqueCountries = removeDuplicatesById(response.data.data);
        return uniqueCountries;
      } else {
        throw new Error('Failed to fetch countries');
      }
    } catch (error) {
      console.error('Fetch countries error:', error);
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch countries'
      });
    }
  }
);

// Fetch states by country ID
export const fetchStates = createAsyncThunk(
  'location/fetchStates',
  async (countryId, { rejectWithValue }) => {
    try {
      if (!countryId) return [];
      
      const apiClient = createApiClient();
      const response = await apiClient.get(`/states/${countryId}`);
      
      if (response.data.status === true && response.data.data) {
        const uniqueStates = removeDuplicatesById(response.data.data);
        return uniqueStates;
      } else {
        throw new Error('Failed to fetch states');
      }
    } catch (error) {
      console.error('Fetch states error:', error);
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch states'
      });
    }
  }
);

// Fetch cities by state ID
export const fetchCities = createAsyncThunk(
  'location/fetchCities',
  async (stateId, { rejectWithValue }) => {
    try {
      if (!stateId) return [];
      
      const apiClient = createApiClient();
      const response = await apiClient.get(`/cities/${stateId}`);
      
      if (response.data.status === true && response.data.data) {
        const uniqueCities = removeDuplicatesById(response.data.data);
        return uniqueCities;
      } else {
        throw new Error('Failed to fetch cities');
      }
    } catch (error) {
      console.error('Fetch cities error:', error);
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch cities'
      });
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    countries: [],
    states: [],
    cities: [],
    loading: {
      countries: false,
      states: false,
      cities: false
    },
    error: {
      countries: null,
      states: null,
      cities: null
    }
  },
  reducers: {
    clearLocationError: (state) => {
      state.error = {
        countries: null,
        states: null,
        cities: null
      };
    },
    clearStates: (state) => {
      state.states = [];
      state.cities = [];
    },
    clearCities: (state) => {
      state.cities = [];
    },
    resetLocationData: (state) => {
      state.states = [];
      state.cities = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading.countries = true;
        state.error.countries = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading.countries = false;
        state.countries = action.payload;
        state.error.countries = null;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading.countries = false;
        state.error.countries = action.payload;
      })
      
      // States
      .addCase(fetchStates.pending, (state) => {
        state.loading.states = true;
        state.error.states = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading.states = false;
        state.states = action.payload;
        state.error.states = null;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading.states = false;
        state.error.states = action.payload;
        state.states = [];
      })
      
      // Cities
      .addCase(fetchCities.pending, (state) => {
        state.loading.cities = true;
        state.error.cities = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading.cities = false;
        state.cities = action.payload;
        state.error.cities = null;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading.cities = false;
        state.error.cities = action.payload;
        state.cities = [];
      });
  },
});

export const { clearLocationError, clearStates, clearCities, resetLocationData } = locationSlice.actions;
export default locationSlice.reducer;