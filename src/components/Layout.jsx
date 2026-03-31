import React from 'react';
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react'; // Icon Đăng xuất
import './Layout.css';

const Layout = () => {
    const navigate = useNavigate();

    // 1. ĐỌC "THẺ TỪ" TỪ BỘ NHỚ
    // Lấy thông tin user đã đăng nhập, nếu không có thì trả về object rỗng {} để tránh lỗi
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

    // 2. HÀM XỬ LÝ ĐĂNG XUẤT
    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
            localStorage.removeItem('currentUser'); // Bỏ thẻ từ
            navigate('/login'); // Đuổi ra ngoài trang Login
        }
    };

    // 3. HÀM DỊCH SỐ ROLE SANG CHỮ
    const getRoleName = (roleId) => {
        switch(roleId) {
            case 1: return 'Administrator';
            case 2: return 'QA Manager';
            case 3: return 'QA Coordinator';
            case 4: return 'Staff';
            default: return 'Guest';
        }
    };

    return (
        <div className="layout-container">
            {/* 1. Thanh Menu cố định bên trái */}
            <Sidebar />

            {/* 2. Khu vực chứa nội dung chính bên phải */}
            <main className="main-content">
                
                {/* --- THANH TOP BAR (HEADER) --- */}
                <header className="top-header" style={{ 
                    display: 'flex', justifyContent: 'flex-end', alignItems: 'center', 
                    padding: '15px 30px', background: 'white', borderBottom: '1px solid #e2e8f0', 
                    marginBottom: '20px' 
                }}>
                    <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        
                        {/* Hiển thị Tên và Chức vụ thật */}
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '700', color: '#1e293b' }}>
                                {currentUser.fullName || 'Khách'}
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>
                                {getRoleName(currentUser.roleId)}
                            </div>
                        </div>

                        {/* Avatar chữ cái đầu tiên của tên */}
                        <div className="avatar" style={{ 
                            width: '40px', height: '40px', borderRadius: '50%', 
                            background: '#1e40af', color: 'white', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px'
                        }}>
                            {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>

                        {/* Nút Đăng xuất */}
                        <button onClick={handleLogout} style={{ 
                            display: 'flex', alignItems: 'center', gap: '5px', 
                            background: '#fee2e2', color: '#ef4444', border: 'none', 
                            padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', 
                            marginLeft: '15px', fontWeight: '600', transition: '0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#fca5a5'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
                        >
                            <LogOut size={18} /> Logout
                        </button>

                    </div>
                </header>
                {/* --- KẾT THÚC TOP BAR --- */}

                {/* Khu vực Outlet được bọc thêm padding cho đẹp */}
                <div className="page-content" style={{ padding: '0 30px' }}>
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default Layout;