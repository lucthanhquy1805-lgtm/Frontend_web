import React from 'react';
import { NavLink } from 'react-router-dom'; 
import { 
    LayoutDashboard, 
    Lightbulb, 
    PlusCircle, 
    UserCircle, 
    Grid, 
    Building, 
    Users 
} from 'lucide-react'; 
import './Sidebar.css';

const Sidebar = () => {
    // 1. Lấy thông tin User từ localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const isAdmin = user?.roleId === 1;

    // 2. Định nghĩa Menu động dựa trên Role
    const menuItems = [
        { 
            name: 'Dashboard', 
            path: isAdmin ? '/dashboard' : '/user-dashboard', 
            icon: <LayoutDashboard size={20} /> 
        },
        { 
            name: 'All Ideas', 
            path: '/ideas', 
            icon: <Lightbulb size={20} /> 
        },
    ];

    // --- NẾU LÀ USER: Thêm Submit và My Ideas ---
    if (!isAdmin) {
        menuItems.push(
            { name: 'Submit Idea', path: '/ideas', icon: <PlusCircle size={20} /> },
            { name: 'My Ideas', path: '/my-ideas', icon: <UserCircle size={20} /> }
        );
    }

    // --- NẾU LÀ ADMIN: Thêm Quản lý hệ thống ---
    if (isAdmin) {
        menuItems.push(
            { name: 'Categories', path: '/categories', icon: <Grid size={20} /> },
            { name: 'Departments', path: '/departments', icon: <Building size={20} /> },
            { name: 'Manage Users', path: '/users', icon: <Users size={20} /> }
        );
    }

    return (
        <aside className="sidebar">
            {/* Logo dự án */}
            <div className="sidebar-logo">
                <Lightbulb color="#3b82f6" size={28} />
                <span>IdeaHub</span>
            </div>
            
            {/* Danh sách Menu */}
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <NavLink 
                        key={index} 
                        to={item.path} 
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
            
            {/* Đã xóa phần Logout ở đây để tránh trùng lặp! */}
        </aside>
    );
};

export default Sidebar;