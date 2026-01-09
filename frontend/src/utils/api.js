import axios from 'axios';

// 1. Define the Base URL dynamically
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

// Add a request interceptor to attach the token automatically
api.interceptors.request.use(
  (config) => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    const token = authData?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) or 403 (Forbidden)
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      
      originalRequest._retry = true; 

      try {
        const refreshResponse = await axios.get(`${BASE_URL}/auth/refresh`, {
          withCredentials: true 
        });

        const newAccessToken = refreshResponse.data.accessToken;
        const user = refreshResponse.data.user;

        localStorage.setItem('auth', JSON.stringify({ token: newAccessToken, user: user }));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);

      } catch (refreshError) {
        console.log("Session expired completely.");
        localStorage.removeItem('auth');
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
            window.location.href = '/'; 
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;