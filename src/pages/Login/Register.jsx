import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import { registerUser, getDepartmentsLookup } from '../../services/ideasService';
import './Login.css'; // Tận dụng luôn CSS tuyệt đẹp của trang Login!

const Register = () => {
    const navigate = useNavigate();
    
    // State lưu trữ dữ liệu người dùng nhập vào
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        departmentId: ''
    });

    // State lưu danh sách Khoa (Department) và thông báo lỗi
    const [departments, setDepartments] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    // Vừa mở trang lên là tự động gọi C# lấy danh sách Khoa về để điền vào Dropdown
    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const depts = await getDepartmentsLookup();
                setDepartments(depts);
            } catch (error) {
                console.error("Lỗi tải danh sách phòng ban");
            }
        };
        fetchDepts();
    }, []);

    // Hàm cập nhật dữ liệu khi người dùng gõ phím
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Hàm xử lý khi bấm nút "Sign Up"
    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg(''); // Xóa lỗi cũ

        // Kiểm tra xem 2 ô mật khẩu có gõ giống nhau không
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            // Đẩy dữ liệu xuống hàm gọi API ở Bước 2
            await registerUser({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                departmentId: parseInt(formData.departmentId)
            });

            // Nếu không lỗi lầm gì thì báo thành công và đá về trang Login
            alert("🎉 Đăng ký thành công! Vui lòng đăng nhập bằng tài khoản vừa tạo.");
            navigate('/login');

        } catch (error) {
            // Nếu C# chửi (ví dụ: Trùng Email) thì hiện chữ đỏ lên
            setErrorMsg(error.message);
        }
    };

    return (
        <div className="login-container">
            {/* CỘT BÊN TRÁI: GIỚI THIỆU (Giữ nguyên phong cách của trang Login) */}
            <div className="login-left">
                <div className="brand">
                    <div className="logo-icon"><Lightbulb size={24} color="#1e40af" /></div>
                    <div className="brand-text">
                        <h2>University</h2>
                        <p>Idea Management</p>
                    </div>
                </div>

                <div className="intro-content">
                    <h1 className="intro-title">Join Our Innovation Hub</h1>
                    <p className="intro-desc">
                        Create an account to start sharing your ideas, collaborating with peers, and shaping the future of our university.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <CheckCircle2 size={24} className="check-icon" />
                            <div>
                                <h3>Voice Your Ideas</h3>
                                <p>Make your suggestions heard by the management.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <CheckCircle2 size={24} className="check-icon" />
                            <div>
                                <h3>Collaborate</h3>
                                <p>Discuss and refine ideas with other departments.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-text">© 2026 University Idea Management System. All rights reserved.</div>
            </div>

            {/* CỘT BÊN PHẢI: FORM ĐĂNG KÝ */}
            <div className="login-right">
                <div className="login-card" style={{ maxWidth: '500px' }}>
                    <h2>Create Account</h2>
                    <p className="subtitle">Please fill in your details to register</p>

                    {/* Nơi hiển thị lỗi đỏ */}
                    {errorMsg && (
                        <div style={{ color: '#ef4444', marginBottom: '15px', padding: '12px', background: '#fee2e2', borderRadius: '8px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="login-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" placeholder="your.email@university.edu" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Department</label>
                            <select name="departmentId" value={formData.departmentId} onChange={handleChange} required style={{ width: '100%', padding: '12px 15px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}>
                                <option value="" disabled>-- Select your department --</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Chia đôi cột cho 2 ô Mật khẩu nhìn cho gọn */}
                        <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Password</label>
                                <input type="password" name="password" placeholder="Create password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Confirm Password</label>
                                <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                        </div>

                        <button type="submit" className="sign-in-btn" style={{ marginTop: '10px' }}>Sign Up</button>
                    </form>

                    <div className="contact-admin">
                        Already have an account? <Link to="/login" style={{ color: '#1e40af', fontWeight: '600' }}>Sign In here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;