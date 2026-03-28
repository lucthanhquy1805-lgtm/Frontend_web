import axios from 'axios';

// Đảm bảo URL này khớp với cổng Backend .NET của bạn (Ví dụ: 7047, 7258...)
const API_BASE_URL = 'https://localhost:7047/api'; 

// 1. Hàm lấy danh sách Ideas kèm bộ lọc
export const getIdeas = async (search = '', categoryId = '', topicId = '', departmentId = '', sortBy = 'Latest') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Ideas`, {
            params: {
                search: search,
                categoryId: categoryId,
                topicId: topicId,
                departmentId: departmentId,
                sortBy: sortBy
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API Ideas:", error);
        throw error;
    }
};

// 2. Hàm lấy danh sách Categories cho ô Dropdown
export const getCategoriesLookup = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Ideas/categories`);
        return response.data; 
    } catch (error) {
        console.error("Lỗi lấy Categories:", error);
        return [];
    }
};

// 3. Hàm lấy danh sách Topics (Lọc theo categoryId nếu có)
export const getTopicsLookup = async (categoryId = '') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Ideas/topics`, {
            params: { categoryId: categoryId } 
        });
        return response.data; 
    } catch (error) {
        console.error("Lỗi lấy Topics:", error);
        return [];
    }
};

// 4. Hàm lấy danh sách Departments cho ô Dropdown
export const getDepartmentsLookup = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Ideas/departments`);
        return response.data; 
    } catch (error) {
        console.error("Lỗi lấy Departments:", error);
        return [];
    }
};