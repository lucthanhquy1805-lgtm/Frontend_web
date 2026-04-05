import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/dashboardService';
import { Lightbulb, Users, MessageSquare, Hash, UserPlus, FileText, CheckCircle, FolderPlus, Download, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; 

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getDashboardSummary();
                setData(result);
            } catch (err) {
                console.error("Lỗi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-screen">Đang tải dữ liệu Admin...</div>;
    if (!data) return <div className="error-screen">Lỗi kết nối API!</div>;

    return (
        <div className="dashboard-container">
            {/* --- HEADER --- */}
            <div className="dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Manage and monitor the University Idea Management System</p>
                </div>
            </div>

            {/* --- TOP 4 KPI CARDS --- */}
           <div className="kpi-grid">
                <div className="kpi-card" >
                    <div className="kpi-icon-wrapper bg-blue"><Lightbulb size={24} color="#fff" /></div>
                    <div className="kpi-info">
                        <h2>{data.totalIdeas}</h2>
                        <p>Total Ideas</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper bg-green"><Users size={24} color="#fff" /></div>
                    <div className="kpi-info">
                        <h2>{data.totalUsers}</h2>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper bg-purple"><MessageSquare size={24} color="#fff" /></div>
                    <div className="kpi-info">
                        <h2>{data.totalComments}</h2>
                        <p>Total Comments</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper bg-orange"><Hash size={24} color="#fff" /></div>
                    <div className="kpi-info">
                        <h2>{data.activeCategories}</h2>
                        <p>Active Categories</p>
                    </div>
                </div>
            </div>

            {/* --- MIDDLE SECTION: CHART & RECENT ACTIVITY --- */}
            <div className="middle-section">
                <div className="chart-card">
                    <h3>Ideas by Department</h3>
                    <p className="subtitle">Distribution of ideas across departments</p>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data.ideasByDepartment} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="departmentName" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                                <Tooltip cursor={{fill: '#f5f5f5'}} />
                                <Bar dataKey="ideaCount" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="activity-card">
                    <h3>Recent Activity</h3>
                    <p className="subtitle">Latest system updates</p>
                    <div className="activity-list">
                        {data.recentActivities && data.recentActivities.length > 0 ? (
                            data.recentActivities.map((act, index) => (
                                <div className="activity-item" key={index}>
                                    <div className="activity-icon bg-light-green"><UserPlus size={16} color="#16a34a"/></div>
                                    <div className="activity-details">
                                        <h4>{act.actionType}</h4>
                                        <p>{act.description} • {new Date(act.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">No recent activity.</p>
                        )}
                    </div>
                </div>
            </div>

            <h3 className="section-title">Management Tools</h3>
            <div className="tools-grid">
                
                <div className="tool-card" onClick={() => navigate('/users')} style={{ cursor: 'pointer' }}>
                    <div className="tool-icon bg-light-blue"><Users size={20} color="#2563eb" /></div>
                    <h4>Manage Users</h4>
                    <p>Add, edit, and manage user accounts and permissions</p>
                </div>
                
                <div className="tool-card" onClick={() => navigate('/categories')} style={{ cursor: 'pointer' }}>
                    <div className="tool-icon bg-light-green"><FolderPlus size={20} color="#16a34a" /></div>
                    <h4>Manage Categories</h4>
                    <p>Organize and maintain idea categories</p>
                </div>
                
                <div className="tool-card" onClick={() => navigate('/topics')} style={{ cursor: 'pointer' }}>
                    <div className="tool-icon bg-light-purple"><Hash size={20} color="#9333ea" /></div>
                    <h4>Manage Topics</h4>
                    <p>Create and edit discussion topics</p>
                </div>

                <div className="tool-card" onClick={() => navigate('/ideas')} style={{ cursor: 'pointer' }}>
                    <div className="tool-icon bg-light-orange" style={{ backgroundColor: '#ffedd5' }}>
                        <Lightbulb size={20} color="#ea580c" />
                    </div>
                    <h4>Manage Ideas</h4>
                    <p>Review, approve, and moderate submitted ideas</p>
                </div>

                <div className="tool-card" onClick={() => navigate('/export-data')} style={{ cursor: 'pointer' }}>
                    <div className="tool-icon bg-light-slate" style={{ backgroundColor: '#f1f5f9' }}>
                        <Download size={20} color="#475569" />
                    </div>
                    <h4>Export Data</h4>
                    <p>Download system data and generate reports</p>
                </div>

                <div className="tool-card" onClick={() => navigate('/reports')} style={{ cursor: 'pointer' }}>
                    <div className="tool-icon bg-light-teal" style={{ backgroundColor: '#ccfbf1' }}>
                        <BarChart2 size={20} color="#0d9488" />
                    </div>
                    <h4>View Reports</h4>
                    <p>Access analytics and detailed statistics</p>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;