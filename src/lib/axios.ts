import axios from 'axios';

// Use backend URL from env variable - this makes it truly dynamic
// In dev: http://localhost:5000, In prod: https://your-backend.com
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Configure axios defaults with backend base URL
axios.defaults.baseURL = BACKEND_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
// Always send cookies for cross-site requests so httpOnly JWT works (server must allow credentials)
axios.defaults.withCredentials = true;

console.log('[Axios Config] Backend URL:', BACKEND_URL);

// Add response interceptor for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silently pass errors through without logging everywhere
    return Promise.reject(error);
  }
);

// Add request interceptor to attach JWT token if exists
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
