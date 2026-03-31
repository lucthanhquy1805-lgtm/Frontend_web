import { useState, useEffect } from 'react';
import { Search, Plus, Eye, ThumbsUp, ThumbsDown, MessageSquare, Clock3, X, Edit, Trash2, Upload } from 'lucide-react';
import { getIdeas, getCategoriesLookup, getTopicsLookup, getDepartmentsLookup, addIdea, updateIdea, deleteIdea } from '../../services/ideasService';
import './Ideas.css'; 
import { useNavigate } from 'react-router-dom';

const IdeasPage = () => {
    // 1. State Dữ liệu
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // 2. State cho các ô Dropdown
    const [categoriesList, setCategoriesList] = useState([]); 
    const [topicsList, setTopicsList] = useState([]);       
    const [departmentsList, setDepartmentsList] = useState([]); 

    // 3. State lưu trữ lựa chọn của người dùng
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Latest');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    
    // --- STATE CHO MODAL ADD IDEA ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingIdeaId, setEditingIdeaId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); 
    const [newIdea, setNewIdea] = useState({
        title: '',
        content: '',
        categoryId: '',
        topicId: '',
        isAnonymous: false,
        file: null
    });

    // --- EFFECT 1: Load dữ liệu Danh mục & Phòng ban ---
    useEffect(() => {
        const loadInitialData = async () => {
            const cats = await getCategoriesLookup();
            const depts = await getDepartmentsLookup();
            setCategoriesList(cats);
            setDepartmentsList(depts);
        };
        loadInitialData();
    }, []);

    // --- EFFECT 2: Xử lý logic CHỌN DANH MỤC -> LOAD CHỦ ĐỀ ---
    useEffect(() => {
        const loadTopics = async () => {
            if (selectedCategory === '') {
                const allTopics = await getTopicsLookup(''); 
                setTopicsList(allTopics);
                return; 
            }
            setSelectedTopic(''); 
            const filteredTopics = await getTopicsLookup(selectedCategory);
            setTopicsList(filteredTopics);
        };
        loadTopics();
    }, [selectedCategory]);

    // --- EFFECT 3: Gọi API lấy Ideas (ĐÃ THÊM refreshKey) ---
    useEffect(() => {
        const fetchIdeasData = async () => {
            setLoading(true);
            try {
                const data = await getIdeas(searchTerm, selectedCategory, selectedTopic, selectedDepartment, sortBy);
                setIdeas(data);
            } catch (err) {
                console.error("Lỗi tải ideas", err);
            } finally {
                setLoading(false);
            }
        };

        const delay = setTimeout(() => { fetchIdeasData(); }, 500); 
        return () => clearTimeout(delay);
    }, [searchTerm, selectedCategory, selectedTopic, selectedDepartment, sortBy, refreshKey]);

    // --- HÀM XỬ LÝ LƯU IDEA MỚI (ĐÃ SỬA ĐỂ TRUYỀN USER ID VÀ FILE) ---
    const handleAddIdeaSubmit = async (e) => {
        e.preventDefault();

        // 1. Lấy thông tin User đang đăng nhập từ LocalStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert("Vui lòng đăng nhập để đăng bài!");
            navigate('/login');
            return;
        }

        try {
            // 2. Tạo FormData để gửi được File và Dữ liệu text chuẩn với C# [FromForm]
            const formData = new FormData();
            formData.append('title', newIdea.title);
            formData.append('content', newIdea.content);
            formData.append('categoryId', newIdea.categoryId);
            formData.append('topicId', newIdea.topicId);
            formData.append('isAnonymous', newIdea.isAnonymous);
            
            // 🔥 TỰ ĐỘNG GẮN ID CỦA NGƯỜI DÙNG VÀO ĐÂY
            formData.append('userId', currentUser.id); 

            // Nếu có chọn file thì đính kèm file vào
            if (newIdea.file) {
                formData.append('file', newIdea.file);
            }

            if (editingIdeaId) {
                // NẾU CÓ ID -> GỌI API SỬA
                await updateIdea(editingIdeaId, formData);
                alert("✏️ Sửa ý tưởng thành công!");
            } else {
                // NẾU KHÔNG CÓ ID -> GỌI API THÊM
                await addIdea(formData);
                alert("🎉 Thêm ý tưởng thành công!");
            }

            setIsAddModalOpen(false); 
            setEditingIdeaId(null); 
            setRefreshKey(oldKey => oldKey + 1); 
            setNewIdea({ title: '', content: '', categoryId: '', topicId: '', isAnonymous: false, file: null }); 
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi xảy ra, vui lòng mở F12 xem chi tiết!");
        }
    };

    const handleEditClick = (idea) => {
        setEditingIdeaId(idea.id);
        setNewIdea({
            title: idea.title,
            content: idea.content,
            categoryId: idea.categoryId,
            topicId: idea.topicId,
            isAnonymous: idea.isAnonymous || false,
            file: null // Khi sửa tạm thời chưa load file cũ lên form
        });
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("🗑️ Bạn có chắc chắn muốn xóa ý tưởng này vĩnh viễn không?")) {
            try {
                await deleteIdea(id);
                setRefreshKey(oldKey => oldKey + 1); // Load lại danh sách
            } catch (error) {
                alert("❌ Lỗi không thể xóa!");
            }
        }
    };

    return (
        <div className="ideas-page-container">
            {/* --- HEADER --- */}
            <header className="ideas-header">
                <div className="header-left">
                    <h1>All Ideas</h1>
                    <div className="search-wrapper">
                        <Search className="search-icon" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search ideas..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="header-right">
                    <button className="add-idea-btn" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={20} /> Add Idea
                    </button>
                    {/* Đã bỏ qua avatar giả ở đây vì bạn đã có Top Bar xịn xò ở Layout rồi */}
                </div>
            </header>

            {/* --- FILTER & SORT BAR --- */}
            <section className="filter-sort-bar">
                <div className="sort-buttons">
                    {['Latest', 'Most Viewed', 'Most Popular'].map(type => (
                        <button 
                            key={type}
                            className={`sort-btn ${sortBy === type ? 'active' : ''}`}
                            onClick={() => setSortBy(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="filter-dropdowns">
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        {categoriesList.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>

                    <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                        <option value="">All Topics</option>
                        {topicsList.map(topic => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                    </select>

                    <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                        <option value="">All Departments</option>
                        {departmentsList.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                    </select>
                </div>
            </section>

            {/* --- IDEA GRID --- */}
            {loading ? (
                <div style={{padding: '50px', textAlign: 'center', color: '#888'}}>Đang tải dữ liệu...</div>
            ) : (
                <section className="ideas-grid">
                    {ideas.length > 0 ? ideas.map((idea) => (
                        <div className="idea-card" key={idea.id}>
                            
                            <div className="idea-card-header">
                                <span className="category-tag">{idea.categoryName}</span>
                                <div className="card-actions">
                                    <button onClick={() => handleEditClick(idea)} className="edit-btn"><Edit size={16} /></button>
                                    <button onClick={() => handleDeleteClick(idea.id)} className="delete-btn"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <h3 className="idea-card-title">{idea.title}</h3>
                            <p className="idea-card-content">{idea.content.substring(0, 100)}...</p>
                            
                            <div className="metadata-row">
                                <div className="author-info">
                                    <div className="author-avatar-small">
                                        {idea.authorName ? idea.authorName.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                    <span>{idea.authorName}</span>
                                </div>
                                <span className="department-tag">{idea.departmentName}</span>
                                <span className="topic-tag">{idea.topicName}</span>
                            </div>
                            
                            {/* KHU VỰC THỐNG KÊ (HÀNG 1) */}
                            <div className="stats-row">
                                <div className="stats-left">
                                    <div className="stat-item"><Eye size={16} /> {idea.viewCount}</div>
                                    <div className="stat-item"><ThumbsUp size={16} /> {idea.thumbsUpCount}</div>
                                    <div className="stat-item"><ThumbsDown size={16} /> {idea.thumbsDownCount}</div>
                                    <div className="stat-item"><MessageSquare size={16} /> {idea.commentCount}</div>
                                </div>
                            </div>
                            
                            {/* KHU VỰC NGÀY THÁNG VÀ NÚT XEM CHI TIẾT (HÀNG 2 - MỚI) */}
                            <div className="card-footer-action">
                                <div className="stat-date">
                                    <Clock3 size={16} /> {new Date(idea.createdAt).toLocaleDateString()}
                                </div>
                                <button 
                                    className="view-details-btn"
                                    onClick={() => navigate(`/ideas/${idea.id}`)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{padding: '50px', textAlign: 'center', color: '#888', width: '100%'}}>
                            Không tìm thấy ý tưởng nào khớp với bộ lọc.
                        </div>
                    )}
                </section>
            )}

            {/* === GIAO DIỆN MODAL ADD IDEA CHÈN VÀO ĐÂY === */}
            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Create New Idea</h2>
                            <button className="close-btn" onClick={() => setIsAddModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddIdeaSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Title <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Enter idea title..." 
                                    value={newIdea.title}
                                    onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category <span className="text-red-500">*</span></label>
                                    <select required value={newIdea.categoryId} onChange={(e) => setNewIdea({...newIdea, categoryId: e.target.value})}>
                                        <option value="">Select Category</option>
                                        {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Topic <span className="text-red-500">*</span></label>
                                    <select required value={newIdea.topicId} onChange={(e) => setNewIdea({...newIdea, topicId: e.target.value})}>
                                        <option value="">Select Topic</option>
                                        {topicsList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description <span className="text-red-500">*</span></label>
                                <textarea 
                                    required 
                                    rows="5" 
                                    placeholder="Describe your idea in detail..."
                                    value={newIdea.content}
                                    onChange={(e) => setNewIdea({...newIdea, content: e.target.value})}
                                ></textarea>
                            </div>

                            {/* KHU VỰC TẢI FILE */}
                            <div className="form-group">
                                <label>Attach Supporting Documents</label>
                                <div className="file-upload-area">
                                    <input 
                                        type="file" 
                                        id="idea-file" 
                                        className="file-input-hidden"
                                        onChange={(e) => setNewIdea({...newIdea, file: e.target.files[0]})}
                                    />
                                    <label htmlFor="idea-file" className="file-upload-label">
                                        <Upload size={28} color="#3b82f6" />
                                        <span className="upload-title">Choose Files</span>
                                        <span className="upload-subtitle">PDF, DOC, DOCX, TXT, PNG, JPG (Max 10MB per file)</span>
                                    </label>
                                </div>
                                {newIdea.file && (
                                    <div className="selected-file">
                                        📄 Đã chọn: <strong>{newIdea.file.name}</strong>
                                    </div>
                                )}
                            </div>

                            <div className="form-checkbox">
                                <input 
                                    type="checkbox" 
                                    id="isAnonymous" 
                                    checked={newIdea.isAnonymous}
                                    onChange={(e) => setNewIdea({...newIdea, isAnonymous: e.target.checked})}
                                />
                                <label htmlFor="isAnonymous">Post Anonymously (Ẩn danh)</label>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="submit-btn">Submit Idea</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IdeasPage;