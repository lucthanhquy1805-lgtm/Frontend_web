import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Import component Bố cục tổng thể
import Layout from './components/Layout';
// Import các trang nội dung
import Dashboard from './pages/Dashboard';
import Ideas from './pages/Ideas/Ideas';
import CategoryPage from './pages/CategoryPage';
import IdeaDetails from './pages/IdeaDetails/IdeaDetails';
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';
import UserDashboard from './pages/User/UserDashboard';
import SubmitIdea from './pages/Ideas/SubmitIdea';
import MyIdeas from './pages/Ideas/MyIdeas';

// --- 🛡️ COMPONENT BẢO VỆ ĐƯỜNG DẪN (PROTECTED ROUTE) ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  // Nếu chưa đăng nhập -> Đá về Login
  if (!user) return <Navigate to="/login" replace />;

  // Nếu đã đăng nhập nhưng sai quyền (Ví dụ Staff đòi vào trang Admin)
  if (allowedRoles && !allowedRoles.includes(user.roleId)) {
    // Nếu là Admin thì về trang admin, nếu là user thì về user-dashboard
    return <Navigate to={user.roleId === 1 ? "/dashboard" : "/user-dashboard"} replace />;
  }

  return children;
};

// --- 🏠 COMPONENT ĐIỀU HƯỚNG TRANG CHỦ TỰ ĐỘNG ---
const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return <Navigate to="/login" replace />;
  // Tự động đẩy về đúng Dashboard dựa trên Role khi vào dấu "/"
  return <Navigate to={user.roleId === 1 ? "/dashboard" : "/user-dashboard"} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        
        {/* 1. TRANG ĐỘC LẬP (KHÔNG CÓ SIDEBAR) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* 2. CÁC TRANG BÊN TRONG HỆ THỐNG (CÓ SIDEBAR BAO BỌC) */}
        <Route path="/" element={<Layout />}>
          
          {/* 👇 SỬA DÒNG NÀY: VÀO WEB LÀ TỰ NHẬN DIỆN ĐỂ VỀ ĐÚNG TRANG CHỦ 👇 */}
          <Route index element={<HomeRedirect />} />

          {/* 🛡️ CHỈ DÀNH CHO USER (RoleId khác 1, ví dụ 2,3,4) */}
          <Route path="/user-dashboard" element={
            <ProtectedRoute allowedRoles={[2, 3, 4, 5]}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/submit-idea" element={
    <ProtectedRoute allowedRoles={[2, 3, 4, 5]}>
        <SubmitIdea />
    </ProtectedRoute>
} />
<Route path="/my-ideas" element={
    <ProtectedRoute allowedRoles={[2, 3, 4, 5]}>
        <MyIdeas />
    </ProtectedRoute>
} />
          
          {/* 🛡️ CHỈ DÀNH CHO ADMIN (RoleId = 1) */}
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={[1]}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="categories" element={
            <ProtectedRoute allowedRoles={[1]}>
              <CategoryPage />
            </ProtectedRoute>
          } />

          {/* 🛡️ CHUNG CHO TẤT CẢ NGƯỜI ĐÃ ĐĂNG NHẬP */}
          <Route path="ideas" element={
            <ProtectedRoute>
              <Ideas />
            </ProtectedRoute>
          } />

          <Route path="ideas/:id" element={
            <ProtectedRoute>
              <IdeaDetails />
            </ProtectedRoute>
          } /> 

        </Route>

      </Routes>
    </Router>
  );
}

export default App;