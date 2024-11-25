import axios from "axios";

const apiClient = axios.create({
  baseURL: 'https://localhost:7290/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
      // Tangani error 401 (Unauthorized)
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('user');
          // Redirect ke halaman login
        window.location.href = '/login';
      }
      return Promise.reject(error);
  }
);

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         await refreshToken();
//         return api(originalRequest);
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;