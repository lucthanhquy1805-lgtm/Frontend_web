import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, ThumbsUp, ThumbsDown, MessageSquare, Clock3, Eye } from 'lucide-react';
import { getIdeas, deleteIdea } from '../../services/ideasService';
import './MyIdeas.css';

const MyIdeas = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const [myIdeas, setMyIdeas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyIdeas = async () => {
            if (!currentUser) {
                navigate('/login');
                return;
            }
            try {
                const allIdeas = await getIdeas('', '', '', '', 'Latest');
                
                // Bộ lọc thông minh bắt bài viết của chính chủ
                const userIdeas = allIdeas.filter(idea => {
                    const idFromIdea = idea.userId || idea.UserId || idea.authorId;
                    const myId = currentUser.id || currentUser.Id;

                    if (idFromIdea && myId) {
                        return idFromIdea == myId; 
                    } else {
                        const myName = currentUser.fullName || currentUser.userName;
                        return idea.authorName === myName;
                    }
                });

                setMyIdeas(userIdeas);
            } catch (error) {
                console.error("Lỗi tải danh sách ý tưởng của tôi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyIdeas();
    }, [currentUser, navigate]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa ý tưởng này không?")) {
            try {
                await deleteIdea(id);
                setMyIdeas(myIdeas.filter(idea => idea.id !== id));
            } catch (error) {
                alert("Lỗi khi xóa ý tưởng!");
            }
        }
    };

    // --- TÍNH TOÁN THỐNG KÊ MỚI ---
    const totalIdeas = myIdeas.length;
    const totalViews = myIdeas.reduce((sum, idea) => sum + (idea.viewCount || 0), 0); 
    const totalComments = myIdeas.reduce((sum, idea) => sum + (idea.commentCount || 0), 0); 
    const totalVotes = myIdeas.reduce((sum, idea) => sum + (idea.thumbsUpCount || 0) + (idea.thumbsDownCount || 0), 0);

    if (loading) return <div className="loading-screen">Đang tải ý tưởng của bạn...</div>;

    return (
        <div className="my-ideas-container">
            <div className="my-ideas-header">
                <h1>My Ideas</h1>
                <p>Quản lý toàn bộ các ý tưởng sáng tạo mà bạn đã đóng góp.</p>
            </div>

            {/* --- 1. KHU VỰC THỐNG KÊ (ĐÃ CẬP NHẬT) --- */}
            <div className="stats-cards-row">
                <div className="stat-card">
                    <div className="stat-title">Total Ideas</div>
                    <div className="stat-value text-blue">{totalIdeas}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Total Views</div>
                    <div className="stat-value text-yellow">{totalViews}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Total Comments</div>
                    <div className="stat-value text-green">{totalComments}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Total Votes</div>
                    <div className="stat-value text-purple">{totalVotes}</div>
                </div>
            </div>

            {/* ĐÃ XÓA THANH TAB STATUS Ở ĐÂY VÌ KHÔNG CẦN THIẾT NỮA */}

            {/* --- 3. DANH SÁCH BÀI VIẾT --- */}
            <div className="my-ideas-list">
                {myIdeas.length > 0 ? myIdeas.map(idea => (
                    <div className="list-item-card" key={idea.id}>
                        <div className="item-header">
                            <h3 onClick={() => navigate(`/ideas/${idea.id}`)} className="item-title">
                                {idea.title}
                            </h3>
                            <div className="item-actions">
                                <button 
                                    className="icon-btn edit" 
                                    onClick={() => navigate('/submit-idea', { state: { ideaToEdit: idea } })}
                                    title="Sửa ý tưởng"
                                >
                                    <Edit size={16} />
                                </button>

                                <button 
                                    className="icon-btn delete" 
                                    onClick={() => handleDelete(idea.id)}
                                    title="Xóa ý tưởng"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="item-meta">
                            {/* ĐÃ ĐỔI BADGE THÀNH TRẠNG THÁI PUBLISHED */}
                            <span className="status-badge" style={{background: '#dcfce7', color: '#16a34a'}}>Published</span>
                            <span className="item-date"><Clock3 size={14} style={{display:'inline', marginRight:'4px'}}/> Posted on: {new Date(idea.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <p className="item-desc">{idea.content.substring(0, 150)}...</p>
                        
                        <div className="item-tags">
                            <span className="tag">{idea.categoryName}</span>
                            <span className="tag">{idea.topicName}</span>
                        </div>

                        <div className="item-footer">
                            <div className="item-stats">
                                <span className="stat-gray"><Eye size={14}/> {idea.viewCount || 0} views</span>
                                <span className="stat-green"><ThumbsUp size={14}/> {idea.thumbsUpCount} upvotes</span>
                                <span className="stat-red"><ThumbsDown size={14}/> {idea.thumbsDownCount} downvotes</span>
                                <span className="stat-gray"><MessageSquare size={14}/> {idea.commentCount} comments</span>
                            </div>
                            <div className="net-votes">
                                Net: <strong>{idea.thumbsUpCount - idea.thumbsDownCount > 0 ? '+' : ''}{idea.thumbsUpCount - idea.thumbsDownCount}</strong>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="empty-state">
                        <p>Bạn chưa nộp ý tưởng nào. Hãy bắt đầu đóng góp ngay hôm nay!</p>
                    </div>
                )}
            </div>

            {/* --- 4. CALL TO ACTION --- */}
            <div className="bottom-cta-box">
                <h2>Got another great idea?</h2>
                <p>Keep the momentum going and submit your next innovative idea today!</p>
                <button onCl000ick={() => navigate('/submit-idea')} className="cta-submit-btn">
                    Submit New Idea
                </button>
            </div>
        </div>
    );
};

export default MyIdeas;