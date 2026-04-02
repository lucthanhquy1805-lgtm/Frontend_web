import { useState, useEffect } from 'react'; // Gộp chung import ở đây
import { Lightbulb, MessageSquare, TrendingUp, CheckCircle, Clock, Eye, ArrowRight, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import { getUserDashboardStats } from '../../services/ideasService';

const UserDashboard = () => {
    const navigate = useNavigate();
    
    // 1. Tạo State để giữ dữ liệu từ API
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. Gọi API khi trang vừa load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getUserDashboardStats();
                setDashboardData(res);
            } catch (error) {
                console.error("Lỗi tải dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 3. Xử lý trạng thái đang tải
    if (loading) return <div className="loading-screen">Đang đồng bộ dữ liệu từ hệ thống...</div>;
    if (!dashboardData) return <div className="error-screen">Không thể kết nối dữ liệu.</div>;

    // 4. Map dữ liệu thật vào các thẻ thống kê (Stats)
    const statsCards = [
        { title: 'Total Ideas', count: dashboardData.totalIdeas, icon: <Lightbulb size={24} color="#3b82f6" />, bgColor: '#eff6ff' },
        { title: 'Latest Comments', count: dashboardData.totalComments, icon: <MessageSquare size={24} color="#22c55e" />, bgColor: '#f0fdf4' },
        { title: 'Popular Ideas', count: dashboardData.popularIdeasCount, icon: <TrendingUp size={24} color="#a855f7" />, bgColor: '#faf5ff' },
        { title: 'Active Topics', count: dashboardData.activeTopicsCount, icon: <CheckCircle size={24} color="#f97316" />, bgColor: '#fff7ed' },
    ];

    return (
        <div className="user-dashboard-container">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome back! Here's an overview of the idea management system.</p>
            </header>

            {/* 1. KHU VỰC THẺ THỐNG KÊ (DỮ LIỆU THẬT) */}
            <div className="stats-grid">
                {statsCards.map((stat, index) => (
                    <div className="stat-card" key={index}>
                        <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{stat.count.toLocaleString()}</h3>
                            <p className="stat-title">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. KHU VỰC DANH SÁCH (DỮ LIỆU THẬT) */}
            <div className="dashboard-middle-row">
                {/* Cột Trái: Latest Ideas */}
                <div className="latest-ideas-section">
                    <div className="section-header">
                        <h2>Latest Ideas</h2>
                        <button className="view-all-btn" onClick={() => navigate('/ideas')}>View All <ArrowRight size={16}/></button>
                    </div>
                    <div className="ideas-list">
                        {dashboardData.latestIdeas.map(idea => (
                            <div className="idea-list-item" key={idea.id} onClick={() => navigate(`/ideas/${idea.id}`)} style={{cursor: 'pointer'}}>
                                <h4>{idea.title}</h4>
                                <div className="idea-meta">
                                    <span>👤 {idea.authorName}</span> • <span>🏢 {idea.departmentName}</span> • <span><Clock size={12}/> {new Date(idea.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="idea-stats">
                                    <span className="text-blue-600"><TrendingUp size={14}/> {idea.upvotes} votes</span>
                                    <span className="text-gray-500"><MessageSquare size={14}/> {idea.commentCount} comments</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cột Phải: Most Viewed */}
                <div className="most-viewed-section">
                    <div className="section-header">
                        <h2>Most Viewed</h2>
                    </div>
                    <div className="ranked-list">
                        {dashboardData.mostViewedIdeas.map((idea, index) => (
                            <div className="ranked-item" key={idea.id} onClick={() => navigate(`/ideas/${idea.id}`)} style={{cursor: 'pointer'}}>
                                <div className="rank-number">{index + 1}</div>
                                <div className="ranked-info">
                                    <h4>{idea.title}</h4>
                                    <span className="dept-text">{idea.departmentName}</span>
                                    <div className="ranked-stats">
                                        <span><Eye size={14}/> {idea.viewCount} views</span>
                                        <span><TrendingUp size={14}/> {idea.upvotes} votes</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. KHU VỰC BIỂU ĐỒ (DỮ LIỆU THẬT) */}
            <div className="chart-section">
                <h2>Ideas by Department</h2>
                <div className="chart-container" style={{ width: '100%', height: 300, marginTop: '20px' }}>
                    <ResponsiveContainer>
                        <BarChart data={dashboardData.ideasByDepartment} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="departmentName" tick={{fontSize: 12}} interval={0} angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="ideaCount" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. KHU VỰC NÚT CALL TO ACTION */}
            <div className="cta-row">
                <div className="cta-card bg-blue">
                    <div className="cta-icon"><Lightbulb size={24}/></div>
                    <div className="cta-content">
                        <h3>Submit Your Idea</h3>
                        <p>Have an innovative idea to improve the university? Share it with the community!</p>
                        <button onClick={() => navigate('/ideas')}>Submit New Idea <ArrowRight size={16}/></button>
                    </div>
                </div>
                
                <div className="cta-card bg-purple">
                    <div className="cta-icon"><BarChart2 size={24}/></div>
                    <div className="cta-content">
                        <h3>View Reports</h3>
                        <p>Access detailed analytics and insights about idea submissions and engagement.</p>
                        <button onClick={() => navigate('/reports')}>View Analytics <ArrowRight size={16}/></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;