import axios from "axios";
import authService from "./service/authService";

const apiClient = axios.create({
  baseURL: 'https://localhost:7155/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use( 
 
  (response) => response, 
 
  async (error) => { 
 
    const originalRequest = error.config; 
 
    if (error.response.status === 401 && !originalRequest._retry) { 
      originalRequest._retry = true; 
      try { 
        await authService.refreshToken(); 
        // await store.dispatch(refreshToken()).unwrap(); 
        return apiClient(originalRequest); 
      } catch (refreshError) { 
        localStorage.removeItem('user'); 
        window.location.href = '/login'; 
        return Promise.reject(refreshError); 
      } 
 
    } 
 
    return Promise.reject(error); 
 
  } 
 
); 

export default apiClient;