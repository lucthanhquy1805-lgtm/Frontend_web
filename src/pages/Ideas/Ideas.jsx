import { useState, useEffect } from 'react';
import { Search, Plus, Eye, ThumbsUp, ThumbsDown, MessageSquare, Clock3 } from 'lucide-react';
import { getIdeas, getCategoriesLookup, getTopicsLookup, getDepartmentsLookup } from '../../services/ideasService'; 
import './Ideas.css'; 

const IdeasPage = () => {
    // 1. State Dữ liệu
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    
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

    // --- EFFECT 1: Load dữ liệu Danh mục & Phòng ban lúc mới vào trang ---
    useEffect(() => {
        const loadInitialData = async () => {
            const cats = await getCategoriesLookup();
            const depts = await getDepartmentsLookup();
            setCategoriesList(cats);
            setDepartmentsList(depts);
        };
        loadInitialData();
    }, []);

    // --- EFFECT 2: Xử lý logic CHỌN DANH MỤC -> LOAD CHỦ ĐỀ TƯƠNG ỨNG ---
    useEffect(() => {
        const loadTopics = async () => {
            if (selectedCategory === '') {
                const allTopics = await getTopicsLookup(''); 
                setTopicsList(allTopics);
                return; 
            }
            // Reset ô Topic về rỗng khi đổi Danh mục khác
            setSelectedTopic(''); 
            const filteredTopics = await getTopicsLookup(selectedCategory);
            setTopicsList(filteredTopics);
        };
        loadTopics();
    }, [selectedCategory]);

    // --- EFFECT 3: Gọi API lấy Ideas mỗi khi bộ lọc thay đổi ---
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

        const delay = setTimeout(() => { fetchIdeasData(); }, 500); // Đợi gõ xong mới tìm
        return () => clearTimeout(delay);
    }, [searchTerm, selectedCategory, selectedTopic, selectedDepartment, sortBy]);

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
                    <button className="add-idea-btn"><Plus size={20} /> Add Idea</button>
                    <div className="user-avatar-placeholder">U</div>
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
                            <span className="category-tag">{idea.categoryName}</span>
                            <h3 className="idea-card-title">{idea.title}</h3>
                            <p className="idea-card-content">{idea.content.substring(0, 100)}...</p>
                            
                            <div className="metadata-row">
                                <div className="author-info">
                                    <div className="author-avatar-small">A</div>
                                    <span>{idea.authorName}</span>
                                </div>
                                <span className="department-tag">{idea.departmentName}</span>
                                <span className="topic-tag">{idea.topicName}</span>
                            </div>
                            
                            <div className="stats-row">
                                <div className="stats-left">
                                    <div className="stat-item"><Eye size={16} /> {idea.viewCount}</div>
                                    <div className="stat-item"><ThumbsUp size={16} /> {idea.thumbsUpCount}</div>
                                    <div className="stat-item"><ThumbsDown size={16} /> {idea.thumbsDownCount}</div>
                                    <div className="stat-item"><MessageSquare size={16} /> {idea.commentCount}</div>
                                </div>
                                <div className="stat-date">
                                    <Clock3 size={16} /> {new Date(idea.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div style={{padding: '50px', textAlign: 'center', color: '#888', width: '100%'}}>
                            Không tìm thấy ý tưởng nào khớp với bộ lọc.
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default IdeasPage;