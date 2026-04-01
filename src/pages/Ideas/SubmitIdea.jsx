import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // THÊM: useLocation
import { Upload, Lightbulb, Info } from 'lucide-react';
import { getCategoriesLookup, getTopicsLookup, addIdea, updateIdea } from '../../services/ideasService'; // THÊM: updateIdea
import './SubmitIdea.css';

const SubmitIdea = () => {
    const navigate = useNavigate();
    const location = useLocation(); // THÊM: Nhận "gói hàng" từ MyIdeas truyền sang
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // THÊM: Bắt lấy dữ liệu bài viết cần sửa (nếu có)
    const ideaToEdit = location.state?.ideaToEdit;
    const isEditing = !!ideaToEdit; // Kiểm tra xem có phải đang ở chế độ sửa không

    const [categoriesList, setCategoriesList] = useState([]); 
    const [topicsList, setTopicsList] = useState([]);       
    
    // SỬA: Tự động điền dữ liệu cũ vào form nếu đang ở chế độ Edit
    const [newIdea, setNewIdea] = useState({
        title: ideaToEdit ? ideaToEdit.title : '',
        categoryId: ideaToEdit ? ideaToEdit.categoryId : '',
        topicId: ideaToEdit ? ideaToEdit.topicId : '',
        content: ideaToEdit ? ideaToEdit.content : '',
        isAnonymous: ideaToEdit ? ideaToEdit.isAnonymous : false,
        file: null // Không nạp lại file cũ lên form vì lý do bảo mật trình duyệt
    });
    
    // SỬA: Nếu đang sửa thì coi như đã đồng ý điều khoản
    const [agreedToTerms, setAgreedToTerms] = useState(isEditing ? true : false);

    // 1. Load Danh mục khi vào trang
    useEffect(() => {
        const fetchCategories = async () => {
            const cats = await getCategoriesLookup();
            setCategoriesList(cats);
        };
        fetchCategories();
    }, []);

    // 2. Load Chủ đề khi chọn Danh mục
    useEffect(() => {
        const fetchTopics = async () => {
            if (!newIdea.categoryId) {
                setTopicsList([]);
                return;
            }
            const filteredTopics = await getTopicsLookup(newIdea.categoryId);
            setTopicsList(filteredTopics);
        };
        fetchTopics();
    }, [newIdea.categoryId]);

    // 3. Xử lý Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreedToTerms) {
            alert("Vui lòng đồng ý với các Điều khoản và Điều kiện trước khi nộp ý tưởng!");
            return;
        }

        if (!currentUser) {
            alert("Vui lòng đăng nhập!");
            navigate('/login');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', newIdea.title);
            formData.append('content', newIdea.content);
            formData.append('categoryId', newIdea.categoryId);
            formData.append('topicId', newIdea.topicId);
            formData.append('isAnonymous', newIdea.isAnonymous);
            formData.append('userId', currentUser.id);

            if (newIdea.file) {
                formData.append('file', newIdea.file);
            }

            // THÊM: Logic chia ngã rẽ cho Thêm hoặc Sửa
            if (isEditing) {
                await updateIdea(ideaToEdit.id, formData);
                alert("✏️ Cập nhật ý tưởng thành công!");
            } else {
                await addIdea(formData);
                alert("🎉 Nộp ý tưởng thành công! Cảm ơn sự đóng góp của bạn.");
            }
            
            navigate('/my-ideas');
        } catch (error) {
            console.error(error);
            alert(`❌ Có lỗi xảy ra trong quá trình ${isEditing ? 'cập nhật' : 'nộp'} ý tưởng.`);
        }
    };

    return (
        <div className="submit-idea-container">
            <div className="submit-idea-card">
                
                {/* Header: SỬA để tự động đổi chữ tùy chế độ */}
                <div className="submit-header">
                    <div className="icon-wrapper">
                        <Lightbulb size={32} color="#3b82f6" />
                    </div>
                    <h1>{isEditing ? "Edit Idea" : "Submit New Idea"}</h1>
                    <p>{isEditing ? "Update your idea details below" : "Share your innovative ideas to help improve our university community"}</p>
                </div>

                <form onSubmit={handleSubmit} className="submit-form">
                    
                    <div className="form-group">
                        <label>Idea Title <span className="required">*</span></label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Enter a clear and descriptive title for your idea" 
                            value={newIdea.title}
                            onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                        />
                        <span className="form-hint">Keep it short and descriptive (max 100 characters)</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category <span className="required">*</span></label>
                            <select required value={newIdea.categoryId} onChange={(e) => setNewIdea({...newIdea, categoryId: e.target.value, topicId: ''})}>
                                <option value="">Select a category</option>
                                {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Topic <span className="required">*</span></label>
                            <select required value={newIdea.topicId} onChange={(e) => setNewIdea({...newIdea, topicId: e.target.value})} disabled={!newIdea.categoryId}>
                                <option value="">Select a topic</option>
                                {topicsList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Idea Description <span className="required">*</span></label>
                        <textarea 
                            required 
                            rows="6" 
                            placeholder="Provide a detailed description of your idea. Include:&#10;- What problem does it solve?&#10;- Who will benefit from it?&#10;- What are the expected outcomes?&#10;- How could it be implemented?"
                            value={newIdea.content}
                            onChange={(e) => setNewIdea({...newIdea, content: e.target.value})}
                        ></textarea>
                        <span className="form-hint">Minimum 50 characters required</span>
                    </div>

                    <div className="form-group">
                        {/* THÊM: Ghi chú nhỏ nếu đang ở chế độ sửa */}
                        <label>Attach Supporting Documents {isEditing && "(Leave blank to keep existing file)"}</label>
                        <div className="file-upload-box">
                            <input 
                                type="file" 
                                id="file-upload" 
                                className="hidden-input"
                                onChange={(e) => setNewIdea({...newIdea, file: e.target.files[0]})}
                            />
                            <label htmlFor="file-upload" className="upload-label">
                                <Upload size={24} color="#64748b" />
                                <span className="upload-text">Choose Files</span>
                                <span className="upload-subtext">PDF, DOC, DOCX, TXT, PNG, JPG (Max 10MB per file)</span>
                            </label>
                        </div>
                        {newIdea.file && (
                            <div className="file-selected-name">
                                📎 Đã đính kèm: <strong>{newIdea.file.name}</strong>
                            </div>
                        )}
                        {/* THÊM: Báo cho người dùng biết file cũ vẫn đang được giữ */}
                        {isEditing && !newIdea.file && ideaToEdit.filePath && (
                            <div className="file-selected-name" style={{color: '#64748b'}}>
                                📄 File đính kèm hiện tại đã được lưu. Chọn file mới để thay thế.
                            </div>
                        )}
                    </div>

                    <div className="checkbox-group">
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                checked={newIdea.isAnonymous}
                                onChange={(e) => setNewIdea({...newIdea, isAnonymous: e.target.checked})}
                            />
                            <div className="checkbox-text">
                                <strong>Submit anonymously</strong>
                                <span>Your name will not be displayed publicly with this idea.</span>
                            </div>
                        </label>
                        
                        {/* THÊM: Chỉ hiện yêu cầu đồng ý nếu là nộp bài mới */}
                        {!isEditing && (
                            <label className="checkbox-item">
                                <input 
                                    type="checkbox" 
                                    required
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                />
                                <div className="checkbox-text">
                                    <strong>I agree to the Terms and Conditions <span className="required">*</span></strong>
                                    <span>By submitting, you agree that your idea may be reviewed and implemented by the university.</span>
                                </div>
                            </label>
                        )}
                    </div>

                    {/* Hộp thông báo màu xanh */}
                    <div className="review-process-box">
                        <Info size={20} color="#3b82f6" className="info-icon" />
                        <div>
                            <strong>Review Process</strong>
                            <p>All submitted ideas will be reviewed by the university committee within 3-5 business days. You will receive updates on your idea's status via email.</p>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
                        {/* SỬA: Đổi chữ nút bấm */}
                        <button type="submit" className="btn-submit">{isEditing ? "Save Changes" : "Submit Idea"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitIdea;