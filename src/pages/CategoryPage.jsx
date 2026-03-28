import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../services/categoryService';
import { Folder, Search, Edit2, Trash2, Plus } from 'lucide-react'; // Dùng icon xịn xò
import './Dashboard.css'; // Sửa lại đường dẫn này nếu file CSS của bạn nằm ở chỗ khác nhé!

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // Bộ nhớ cho ô tìm kiếm
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getCategories();
            setCategories(data.categories || data.items || data);
        } catch (error) {
            console.error("Data retrieval error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { name: newName, description: newDesc, isActive: true };
            if (editingId) {
                payload.id = editingId;
                await updateCategory(editingId, payload);
            } else {
                await createCategory(payload);
            }
            setIsModalOpen(false);
            setEditingId(null);
            setNewName(""); setNewDesc("");
            fetchData(); // Tải lại dữ liệu
        } catch (error) {
            alert("An error occurred! Please check your input.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory(id);
                setCategories(categories.filter(cat => cat.id !== id));
            } catch (error) {
                alert("An error occurred while deleting the category!");
            }
        }
    };

    const handleEditClick = (category) => {
        setEditingId(category.id);
        setNewName(category.name);
        setNewDesc(category.description || "");
        setIsModalOpen(true);
    };

    // --- CÁC HÀM TÍNH TOÁN DỮ LIỆU TỰ ĐỘNG CHO GIAO DIỆN ---
    const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.isActive).length;
    // Tính tổng Idea (nếu Backend có trả về biến ideaCount, nếu không thì tạm để 0)
    const totalIdeas = categories.reduce((sum, c) => sum + (c.ideaCount || 0), 0); 

    if (loading) return <div className="dashboard-container">Đang tải dữ liệu...</div>;

    return (
        <div className="dashboard-container">
            {/* HEADER */}
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Categories</h1>
                    <p>Manage idea categories and organize submissions</p>
                </div>
                <button 
                    className="btn-primary"
                    onClick={() => { setEditingId(null); setNewName(""); setNewDesc(""); setIsModalOpen(true); }}
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* SEARCH BAR */}
            <div className="search-bar">
                <Search size={20} />
                <input 
                    type="text" 
                    placeholder="Search categories..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* KPI CARDS (Dùng lại class của cộng sự) */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper bg-blue"><Folder color="white" size={24} /></div>
                    <div className="kpi-info">
                        <h2>{totalCategories}</h2>
                        <p>Total Categories</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper bg-green"><Folder color="white" size={24} /></div>
                    <div className="kpi-info">
                        <h2>{activeCategories}</h2>
                        <p>Active Categories</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper bg-purple"><Folder color="white" size={24} /></div>
                    <div className="kpi-info">
                        <h2>{totalIdeas}</h2>
                        <p>Total Ideas</p>
                    </div>
                </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>CATEGORY</th>
                            <th>DESCRIPTION</th>
                            <th style={{ textAlign: 'center' }}>IDEAS</th>
                            <th style={{ textAlign: 'center' }}>STATUS</th>
                            <th style={{ textAlign: 'center' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((cat) => (
                            <tr key={cat.id}>
                                <td>
                                    <div className="cat-name-cell">
                                        <div className="kpi-icon-wrapper bg-blue" style={{ width: '32px', height: '32px', borderRadius: '6px' }}>
                                            <Folder color="white" size={16} />
                                        </div>
                                        {cat.name}
                                    </div>
                                </td>
                                <td>{cat.description}</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{cat.ideaCount || 0}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`badge ${cat.isActive ? 'active' : 'inactive'}`}>
                                        {cat.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button className="action-btn" onClick={() => handleEditClick(cat)}><Edit2 size={18} /></button>
                                    <button className="action-btn delete" onClick={() => handleDelete(cat.id)}><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL GIỮ NGUYÊN HOẶC TỰ STYLE THÊM SAU */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{editingId ? "Edit Category" : "Create New Category"}</h2>
                        <form onSubmit={handleAddSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category Name</label>
                                <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
                                <textarea rows="3" required value={newDesc} onChange={(e) => setNewDesc(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 15px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;