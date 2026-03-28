import axios from 'axios';


const API_BASE_URL = 'https://localhost:7047/api'; 

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Categories/page-data`);
        return response.data; 
    } catch (error) {
        console.error("Error when calling Category API:", error);
        throw error;
    }
};


export const createCategory = async (categoryData) => {
    try {
        
        const response = await axios.post(`${API_BASE_URL}/Categories`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error when creating new Category:", error);
        throw error;
    }
};


export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/Categories/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error when deleting Category:", error);
        throw error;
    }
};


export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/Categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error when updating Category:", error);
        throw error;
    }
};