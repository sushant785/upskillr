import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
  (response) => response, // If success, just return response
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) or 403 (Forbidden)
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      
      originalRequest._retry = true; // Mark as retried to prevent infinite loops

      try {
        // A. Call the refresh endpoint
        // We use a clean 'axios' instance here to avoid circular interceptors
        const refreshResponse = await axios.get("http://localhost:5000/api/auth/refresh", {
          withCredentials: true // Send the cookie!
        });

        // B. Get the new token
        const newAccessToken = refreshResponse.data.accessToken;
        const user = refreshResponse.data.user;

        // C. Update LocalStorage so the Request Interceptor sees it next time
        localStorage.setItem('auth', JSON.stringify({ token: newAccessToken, user: user }));

        // D. Update the header of the FAILED request with the NEW token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // F. If Refresh fails, user is truly expired. Logout.
        console.log("Session expired completely.");
        localStorage.removeItem('auth');
        window.location.href = '/'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;