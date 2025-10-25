import axios from 'axios';

// Use backend URL from env variable - this makes it truly dynamic
// In dev: http://localhost:5000, In prod: https://your-backend.com
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Configure axios defaults with backend base URL
axios.defaults.baseURL = BACKEND_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
// Remove withCredentials to avoid CORS issues with wildcard origin
// axios.defaults.withCredentials = true;

console.log('[Axios Config] Backend URL:', BACKEND_URL);

// Add response interceptor for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract meaningful error message
    if (error.response) {
      // Server responded with error
      const data = error.response.data;
      const message = data?.msg || data?.message || data?.error || 
                     `Error ${error.response.status}: ${error.response.statusText}`;
      
      console.error(`[API Error ${error.response.status}]`, message);
      
      // Attach cleaned message to error
      error.message = message;
    } else if (error.request) {
      // Request made but no response
      console.error('[API Error] No response from server', error.request);
      error.message = 'Unable to connect to server. Please check your connection.';
    } else {
      // Something else happened
      console.error('[API Error]', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Add request interceptor to attach JWT token if exists
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Match backend key
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log all API requests for debugging
    if (config.url?.includes('/api/')) {
      console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
