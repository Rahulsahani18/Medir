// src/utils/api.js

// ✅ Set base URL dynamically based on environment
const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? '/api' // Local dev uses Vite proxy
    : 'https://oswal.omsoftsolution.in/doctor/doctor/api'; // Production

// Simple API utility
export const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'API GET request failed');
      }

      return response.json();
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'API POST request failed');
      }

      return response.json();
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  },
};
