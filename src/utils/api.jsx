// src/utils/api.js

// Dynamic base URL – proxy in dev, direct in production
const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? '/api' // Vite proxy handles this locally
    : 'https://oswal.omsoftsolution.in/doctor/doctor/api';

export const api = {
  // GET requests – simple, no preflight needed
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // POST requests – using form-urlencoded to avoid CORS preflight
  async post(endpoint, data = {}) {
    // Convert object to URLSearchParams (form-encoded)
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData, // Send as form data
    });

    // Try to parse JSON, but handle non-JSON responses gracefully
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      // If backend returns plain text (rare), return as-is
      return { message: text, status: response.ok };
    }
  },
};
