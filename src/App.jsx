import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Import component Bố cục tổng thể
import Layout from './components/Layout';
// Import các trang nội dung
import Dashboard from './pages/Dashboard';
import Ideas from './pages/Ideas/Ideas';

function App() {
  return (
    // Bắt buộc bao quanh toàn bộ bằng Router
    <Router>
      <Routes>
        {/* 1. Định nghĩa Layout cha (Có chứa Sidebar) */}
        <Route path="/" element={<Layout />}>
          {/* Khi người dùng gõ link gốc '/' -> Tự động nhảy sang '/dashboard' */}
          <Route index element={<Navigate to="/dashboard" />} />
          
          {/* Khi click vào link /dashboard -> Hiển thị Dashboard vào chỗ Outlet */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Khi click vào link /ideas -> Hiển thị Ideas vào chỗ Outlet */}
          <Route path="ideas" element={<Ideas />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;