import axios from 'axios';

// This creates a central axios instance.
// It will automatically use the REACT_APP_API_URL from Vercel's
// environment variables, or default to localhost for development.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
});

// ********** THIS IS THE MISSING CODE **********
// This "interceptor" runs before every request made with "api"
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config; // Continue with the request
  },
  (error) => {
    // If there's an error, reject the promise
    return Promise.reject(error);
  }
);
// ***********************************************

export default api;