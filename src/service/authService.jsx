import apiClient from "../axiosConfig";

const register = async (userData) => {
    const response = await apiClient.post("/User/Add-User-Roles", userData);
    return response.data;
};

const assign = async (userName, userData) => {
    const response = await apiClient.post(`/Auth/assign-role`, userData);
    return response.data;
};

const login = async (userData) => {
    const response = await apiClient.post("/Auth/login", userData);
    if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
    }  
    return response.data;  
}; 

const logout = async () => {
    await apiClient.post(`Auth/logout`);
    localStorage.removeItem('user');
};

const refreshToken = async () => {
    const response = await api.post(`/Auth/refresh-token`, );
    if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));  
    }
};
const authService = { 
    register, 
    login,
    logout,
    refreshToken,
};
    
export default authService;