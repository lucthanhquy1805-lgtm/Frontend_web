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

// =========================================================
// 🔥 ĐÃ SỬA: HÀM THÊM IDEA MỚI 
// Nhận trực tiếp FormData từ Ideas.jsx gửi sang, không cần tạo lại nữa
// =========================================================
export const addIdea = async (formDataPayload) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Ideas`, formDataPayload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm Idea mới kèm file:", error);
        throw error;
    }
};

// =========================================================
// 🔥 ĐÃ SỬA: Hàm SỬA ý tưởng
// Cập nhật để hỗ trợ gửi FormData (nếu sau này có sửa file)
// =========================================================
export const updateIdea = async (id, formDataPayload) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/Ideas/${id}`, formDataPayload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi sửa Idea:", error);
        throw error;
    }
};

// Hàm XÓA ý tưởng
export const deleteIdea = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/Ideas/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa Idea:", error);
        throw error;
    }
};

export const getIdeaById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Ideas/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết Idea:", error);
        throw error;
    }
};

export const getCommentsByIdeaId = async (ideaId) => {
    const response = await axios.get(`${API_BASE_URL}/Ideas/${ideaId}/comments`);
    return response.data;
};

export const postComment = async (commentData) => {
    const response = await axios.post(`${API_BASE_URL}/Ideas/comments`, commentData);
    return response.data;
};

// Gửi API Like / Dislike
export const reactToIdea = async (ideaId, reactionType, userId) => {
    try {
        // Truyền thêm userId vào body gửi đi
        const response = await axios.post(`${API_BASE_URL}/Ideas/${ideaId}/react`, { 
            reactionType: reactionType,
            userId: userId 
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi đánh giá ý tưởng:", error);
        throw error;
    }
};

// Xóa bình luận
export const deleteComment = async (commentId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/Ideas/comments/${commentId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Auth/login`, { email, password });
        return response.data; // Trả về thông tin User
    } catch (error) {
        // Lấy câu chửi "Email hoặc mật khẩu sai" từ C# trả về
        if (error.response && error.response.status === 401) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Lỗi kết nối tới máy chủ!");
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Auth/register`, userData);
        return response.data;
    } catch (error) {
        // Bắt lỗi từ C# gửi lên (ví dụ: "Email này đã được sử dụng!")
        if (error.response && error.response.data) {
            throw new Error(error.response.data); 
        }
        throw new Error("Lỗi kết nối tới máy chủ!");
    }
};
export const getUserDashboardStats = async () => {
    try {
        // Gọi đến API Summary mà chúng ta vừa nâng cấp ở DashboardController
        const response = await axios.get(`${API_BASE_URL}/Dashboard/summary`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Dashboard:", error);
        throw error;
    }
};