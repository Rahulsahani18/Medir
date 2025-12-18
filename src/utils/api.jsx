// Simple API utility - works everywhere
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? '/api'  // Local development
  : 'https://oswal.omsoftsolution.in/doctor/doctor/api'; 

export const api = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};
