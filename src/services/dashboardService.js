import axios from 'axios';


const API_BASE_URL = 'https://localhost:7047/api'; 

export const getDashboardSummary = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Dashboard/summary`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API Dashboard:", error);
        throw error; 
    }
};