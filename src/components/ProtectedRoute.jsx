import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    // 1. Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));

    // 2. Nếu chưa đăng nhập -> Đá về trang Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Nếu đã đăng nhập nhưng Role không nằm trong danh sách cho phép
    // (Ví dụ: Staff cố tình vào trang Admin)
    if (allowedRoles && !allowedRoles.includes(user.roleId)) {
        // Có thể đá về trang "Access Denied" hoặc Dashboard của họ
        return <Navigate to="/user-dashboard" replace />;
    }

   
    return children;
};

export default ProtectedRoute;