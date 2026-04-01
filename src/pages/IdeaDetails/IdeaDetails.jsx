import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Eye, Clock3, Download, FileText, Trash2 } from 'lucide-react';
import { getIdeaById, getCommentsByIdeaId, postComment, reactToIdea, deleteComment } from '../../services/ideasService';
import './IdeaDetails.css';

const IdeaDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    // ĐỌC THÔNG TIN NGƯỜI DÙNG TỪ LOCALSTORAGE
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // State cho bài viết
    const [idea, setIdea] = useState(null);
    const [loading, setLoading] = useState(true);

    // State cho phần bình luận
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isAnonymousComment, setIsAnonymousComment] = useState(false);

    // Tự động gọi API lấy dữ liệu khi vừa vào trang
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const ideaData = await getIdeaById(id);
                setIdea(ideaData);

                try {
                    const commentData = await getCommentsByIdeaId(id);
                    setComments(commentData);
                } catch (cmtError) {
                    console.error("Lấy bình luận thất bại:", cmtError);
                }

            } catch (error) {
                console.error("Lỗi khi lấy chi tiết Idea:", error);
                setIdea(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Hàm xử lý gửi bình luận mới
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        if (!currentUser) {
            alert("Vui lòng đăng nhập để bình luận!");
            return;
        }

        try {
            const newCmt = await postComment({
                ideaId: parseInt(id),
                content: commentText,
                isAnonymous: isAnonymousComment,
                userId: currentUser.id // 🔥 THÊM: Gửi kèm ID của người đang đăng nhập
            });
            
            setComments([newCmt, ...comments]);
            setCommentText(""); 
        } catch (error) {
            const errorMessage = error.response?.data || "Không kết nối được tới máy chủ";
            alert("❌ Lỗi: " + errorMessage);
        }
    };

    // Hàm xử lý khi bấm Like / Dislike
    const handleVote = async (reactionType) => {
        if (!currentUser) {
            alert("Vui lòng đăng nhập để đánh giá bài viết!");
            return;
        }

        try {
            // 🔥 THÊM: Truyền userId vào hàm reactToIdea
            const updatedCounts = await reactToIdea(id, reactionType, currentUser.id);
            
            setIdea(prevIdea => ({
                ...prevIdea,
                thumbsUpCount: updatedCounts.thumbsUpCount,
                thumbsDownCount: updatedCounts.thumbsDownCount
            }));
        } catch (error) {
            const realError = error.response?.data || "Lỗi mạng không xác định";
            alert("Chi tiết lỗi: " + JSON.stringify(realError));
        }
    };

    // Hàm xử lý xóa bình luận
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) return;

        try {
            await deleteComment(commentId);
            setComments(comments.filter(cmt => cmt.id !== commentId));
        } catch (error) {
            alert("Lỗi khi xóa bình luận!");
        }
    };  

    if (loading) return <div className="loading-text">Đang tải dữ liệu...</div>;
    if (!idea) return <div className="error-text">Không tìm thấy bài viết!</div>;

    return (
        <div className="idea-details-page">
            <button className="back-btn" onClick={() => navigate('/ideas')}>
                <ArrowLeft size={18} /> Back to All Ideas
            </button>

            <div className="details-layout">
                <div className="main-content-col">
                    <h1 className="detail-title">{idea.title}</h1>
                    
                    <div className="detail-meta">
                        <span className="author-name">👤 {idea.authorName || 'Anonymous'}</span>
                        <span className="publish-date"><Clock3 size={16} /> {new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="detail-tags">
                        <span className="tag category">{idea.categoryName}</span>
                        <span className="tag topic">{idea.topicName}</span>
                        <span className="tag department">{idea.departmentName}</span>
                    </div>

                    <div className="detail-description">
                        <h3>Idea Description</h3>
                        <p>{idea.content}</p>
                    </div>

                    {idea.filePath && (
                        <div className="detail-attachments">
                            <h3>Attached Documents</h3>
                            <div className="attachment-box">
                                <div className="file-info">
                                    <FileText size={24} color="#3b82f6" />
                                    <span>Tài liệu đính kèm</span>
                                </div>
                                <a href={`https://localhost:7047${idea.filePath}`} target="_blank" rel="noreferrer" className="download-btn">
                                    <Download size={16} /> Download
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="comments-section">
                        <h3>Comments ({comments.length})</h3>
                        
                        <form className="comment-form" onSubmit={handleCommentSubmit}>
                            <textarea 
                                placeholder="Share your thoughts or suggestions..." 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            ></textarea>
                            <div className="comment-form-footer">
                                <label className="anon-checkbox">
                                    <input 
                                        type="checkbox" 
                                        checked={isAnonymousComment}
                                        onChange={(e) => setIsAnonymousComment(e.target.checked)}
                                    /> Post anonymously
                                </label>
                                <button type="submit" className="submit-comment-btn">Submit Comment</button>
                            </div>
                        </form>

                       <div className="comments-list">
                            {comments.map(cmt => (
                                <div className="comment-item" key={cmt.id}>
                                    <img src={cmt.avatar || `https://ui-avatars.com/api/?name=${cmt.authorName}`} alt="avatar" className="comment-avatar" />
                                    <div className="comment-content" style={{ flex: 1 }}>
                                        <div className="comment-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <span className="comment-author">{cmt.authorName}</span>
                                                <span className="comment-time">{new Date(cmt.createdAt).toLocaleString()}</span>
                                            </div>
                                            
                                            {/* 🔥 LOGIC MỚI: Admin HOẶC Chủ bình luận mới thấy nút Xóa */}
                                            {(currentUser?.roleId === 1 || currentUser?.id === cmt.userId) && (
                                                <button 
                                                    onClick={() => handleDeleteComment(cmt.id)}
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}
                                                    title="Xóa bình luận này"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="comment-text">{cmt.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="sidebar-col">
                    <div className="vote-card">
                        <h3>Cast Your Vote</h3>
                        <div className="vote-actions">
                            <button className="vote-btn up" onClick={() => handleVote(1)}>
                                <ThumbsUp size={20} /> <span className="vote-count">{idea.thumbsUpCount}</span>
                            </button>
                            
                            <button className="vote-btn down" onClick={() => handleVote(2)}>
                                <ThumbsDown size={20} /> <span className="vote-count">{idea.thumbsDownCount}</span>
                            </button>
                        </div>
                        
                        <div className="stats-divider"></div>
                        
                        <div className="stats-list">
                            <div className="stat-row">
                                <span className="stat-label">Views</span>
                                <span className="stat-value"><Eye size={16}/> {idea.viewCount}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Comments</span>
                                <span className="stat-value">{comments.length > 0 ? comments.length : idea.commentCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdeaDetails;