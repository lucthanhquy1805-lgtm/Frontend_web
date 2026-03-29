import React from 'react';
// Import Link để chuyển trang không bị load lại web, NavLink để biết đang ở trang nào
import { NavLink } from 'react-router-dom'; 
// Import icon đẹp giống Figma
import { LayoutDashboard, Lightbulb } from 'lucide-react';
import './Sidebar.css'; // Sẽ tạo CSS ở bước sau

const Sidebar = () => {
    // Định nghĩa danh sách các mục Menu
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'All Ideas', path: '/ideas', icon: <Lightbulb size={20} /> },
        { name: 'Categories', path: '/categories', icon: <Lightbulb size={20} /> },
        { name: 'Users', path: '/users', icon: <Lightbulb size={20} /> },
    ];

    return (
        <aside className="sidebar">
            {/* Logo hoặc tên dự án trên cùng */}
            <div className="sidebar-logo">
                <Lightbulb color="#3b82f6" size={28} />
                <span>IdeaHub</span>
            </div>
            
            {/* Danh sách các link chuyển trang */}
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <NavLink 
                        key={index} 
                        to={item.path} 
                        // class "active" tự động được thêm khi người dùng đang ở link đó
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;