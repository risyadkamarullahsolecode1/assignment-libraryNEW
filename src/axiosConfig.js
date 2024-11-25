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

export default apiClient;