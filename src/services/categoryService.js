import axios from 'axios';

// Dùng chung địa chỉ API với Dashboard (Thay số 7047 bằng số cổng Swagger của bạn nếu nó khác nhé)
const API_BASE_URL = 'https://localhost:7047/api'; 

export const getCategories = async () => {
    try {
        // Chạy sang C# gọi lệnh GET lấy danh sách Categories
        const response = await axios.get(`${API_BASE_URL}/Categories/page-data`);
        return response.data; 
    } catch (error) {
        console.error("Lỗi khi gọi API Category:", error);
        throw error;
    }
};

// Hàm gửi dữ liệu từ React lên C# để thêm mới
export const createCategory = async (categoryData) => {
    try {
        // Lần này là lệnh POST, mang theo cục hàng 'categoryData'
        const response = await axios.post(`${API_BASE_URL}/Categories`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm Category mới:", error);
        throw error;
    }
};

// Gửi mã ID lên để yêu cầu C# xóa
export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/Categories/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa Category:", error);
        throw error;
    }
};

// Gửi hàng đi để cập nhật (Dùng lệnh PUT)
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/Categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật Category:", error);
        throw error;
    }
};