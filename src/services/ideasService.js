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

// === HÀM THÊM IDEA MỚI ĐÃ CHUYỂN SANG DẠNG FORMDATA ĐỂ GỬI FILE ===
export const addIdea = async (ideaData) => {
    try {
        // 1. Tạo một cái hộp FormData (multipart/form-data)
        const formData = new FormData();

        // 2. Nhét hết các trường chữ vào hộp
        formData.append('title', ideaData.title);
        formData.append('content', ideaData.content);
        formData.append('categoryId', ideaData.categoryId);
        formData.append('topicId', ideaData.topicId);
        formData.append('isAnonymous', ideaData.isAnonymous);
        
        // Gắn cứng (Gắn ID User và ID Năm học tạm thời)
        formData.append('userId', 1); 
        formData.append('academicYearId', 1);

        // 3. NHÉT CỤC FILE VÀO HỘP (NẾU NGƯỜI DÙNG CÓ CHỌN FILE)
        if (ideaData.file) {
            // Trường tên là 'File' phải KHỚP CHÍNH XÁC với tên trường 'File' trong CreateIdeaDto.cs của Backend
            formData.append('File', ideaData.file); 
        }

        // 4. Gửi cái hộp FormData này lên API bằng lệnh POST
        const response = await axios.post(`${API_BASE_URL}/Ideas`, formData, {
            // 💡 QUAN TRỌNG: Phải đặt header là form-data thì Backend .NET mới nhận ra
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
// Hàm SỬA ý tưởng
export const updateIdea = async (id, ideaData) => {
    try {
        const payload = { ...ideaData, userId: 1, academicYearId: 1 };
        const response = await axios.put(`${API_BASE_URL}/Ideas/${id}`, payload);
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