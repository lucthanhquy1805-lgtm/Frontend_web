import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Eye, Clock3, Download, FileText } from 'lucide-react';
import { getIdeaById } from '../../services/ideasService';
import './IdeaDetails.css';

const IdeaDetails = () => {
    const { id } = useParams(); // Lấy ID bài viết từ trên thanh địa chỉ (URL)
    const navigate = useNavigate();
    
    const [idea, setIdea] = useState(null);
    const [loading, setLoading] = useState(true);

    // Tự động gọi API lấy dữ liệu khi vừa vào trang
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await getIdeaById(id);
                setIdea(data);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="loading-text">Đang tải dữ liệu...</div>;
    if (!idea) return <div className="error-text">Không tìm thấy bài viết!</div>;

    return (
        <div className="idea-details-page">
            {/* Nút Quay lại */}
            <button className="back-btn" onClick={() => navigate('/ideas')}>
                <ArrowLeft size={18} /> Back to All Ideas
            </button>

            <div className="details-layout">
                {/* --- CỘT TRÁI: NỘI DUNG CHÍNH --- */}
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

                    {/* HIỂN THỊ FILE ĐÍNH KÈM NẾU CÓ */}
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
                </div>

                {/* --- CỘT PHẢI: THỐNG KÊ & VOTE --- */}
                <div className="sidebar-col">
                    <div className="vote-card">
                        <h3>Cast Your Vote</h3>
                        <div className="vote-actions">
                            <button className="vote-btn up">
                                <ThumbsUp size={20} /> <span className="vote-count">{idea.thumbsUpCount}</span>
                            </button>
                            <button className="vote-btn down">
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
                                <span className="stat-value">{idea.commentCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdeaDetails;