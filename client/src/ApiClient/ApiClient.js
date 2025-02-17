import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, 
  withCredentials: true,
});

// Add an interceptor to set Authorization header dynamically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
