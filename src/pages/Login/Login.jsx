import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import './Login.css';
import { loginUser } from '../../services/ideasService';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(''); 

    try {
        
        const userData = await loginUser(email, password);
        
      
        localStorage.setItem('currentUser', JSON.stringify(userData));

       
        alert(`Xin chào ${userData.fullName}! Đăng nhập thành công.`);

       
        if (userData.roleId === 1) {
           
            navigate('/dashboard');
        } else {
           
            navigate('/user-dashboard');
        }

    } catch (error) {
     
        setErrorMsg(error.message);
    }
};

    return (
        <div className="login-container">
            {/* CỘT BÊN TRÁI: GIỚI THIỆU */}
            <div className="login-left">
                <div className="brand">
                    <div className="logo-icon"><Lightbulb size={24} color="#1e40af" /></div>
                    <div className="brand-text">
                        <h2>University</h2>
                        <p>Idea Management</p>
                    </div>
                </div>

                <div className="intro-content">
                    <h1 className="intro-title">Transform Ideas Into Reality</h1>
                    <p className="intro-desc">
                        A collaborative platform where university staff can submit, discuss, and vote on innovative ideas to improve our institution.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <CheckCircle2 size={24} className="check-icon" />
                            <div>
                                <h3>Submit Ideas</h3>
                                <p>Share your innovative proposals with the community</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <CheckCircle2 size={24} className="check-icon" />
                            <div>
                                <h3>Vote & Comment</h3>
                                <p>Engage with ideas through voting and discussions</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <CheckCircle2 size={24} className="check-icon" />
                            <div>
                                <h3>Track Progress</h3>
                                <p>Monitor the status and implementation of ideas</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-text">
                    © 2026 University Idea Management System. All rights reserved.
                </div>
            </div>

            {/* CỘT BÊN PHẢI: FORM ĐĂNG NHẬP */}
            <div className="login-right">
                <div className="login-card">
                    <h2>Welcome Back</h2>
                    <p className="subtitle">Please sign in to your account to continue</p>

                    {/* HIỂN THỊ LỖI CHỮ ĐỎ Ở ĐÂY NẾU CÓ */}
                    {errorMsg && (
                        <div style={{ color: '#ef4444', marginBottom: '15px', padding: '12px', background: '#fee2e2', borderRadius: '8px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="your.email@university.edu" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                placeholder="Enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-actions">
                            <label className="remember-me">
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>

                        <button type="submit" className="sign-in-btn">Sign In</button>
                    </form>

                    <div className="contact-admin">
                    Don't have an account? <Link to="/register" style={{ color: '#1e40af', fontWeight: '600' }}>Sign Up here</Link>
                </div>
                    <div className="terms">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;