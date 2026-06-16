// Axios instance configuration for API requests
// This file sets up the base URL and default headers for all API calls

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.error(
    'VITE_API_URL is not defined. Add it to .env.development or .env.production.'
  );
}

// Create Axios instance with base URL pointing to the backend API
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
