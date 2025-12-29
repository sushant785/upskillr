import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Set your base backend URL here
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
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth'); 
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);


export default api;