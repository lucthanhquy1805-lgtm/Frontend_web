import React from 'react';
// Import Sidebar chúng ta vừa tạo ở trên
import Sidebar from './Sidebar';
// Import Outlet để React biết chỗ nào sẽ đổ nội dung trang (Dashboard/Ideas) vào
import { Outlet } from 'react-router-dom';
import './Layout.css'; // Sẽ tạo CSS ở bước sau

const Layout = () => {
    return (
        <div className="layout-container">
            {/* 1. Thanh Menu cố định bên trái */}
            <Sidebar />

            {/* 2. Khu vực chứa nội dung chính thay đổi bên phải */}
            <main className="main-content">
                <Outlet /> {/* <-- Nội dung trang Dashboard hay Ideas sẽ hiện ra ở đây */}
            </main>
        </div>
    );
};

export default Layout;