import axios from 'axios';

// This creates a central axios instance.
// It will automatically use the REACT_APP_API_URL from Vercel's
// environment variables, or default to localhost for development.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
});

export default api;