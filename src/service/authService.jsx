import apiClient from "../axiosConfig";

const register = async (userData) => {
    const response = await apiClient.post("/Auth/register", userData);
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
    
const authService = { 
    register, 
    login,
    logout
};
    
export default authService;