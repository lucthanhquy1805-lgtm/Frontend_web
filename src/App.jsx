import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Import component Bố cục tổng thể
import Layout from './components/Layout';
// Import các trang nội dung
import Dashboard from './pages/Dashboard';
import Ideas from './pages/Ideas/Ideas';
import CategoryPage from './pages/CategoryPage';
import Users from './pages/Users';
import ExportData from './pages/ExportData';
import Reports from './pages/Reports';
import Topics from './pages/Topics';
import IdeaDetails from './pages/IdeaDetails/IdeaDetails';
import Login from './pages/Login/Login';

function App() {
  return (
    <Router>
      <Routes>
        
        {/* 1. TRANG ĐỘC LẬP (KHÔNG CÓ SIDEBAR) */}
        <Route path="/login" element={<Login />} />


        {/* 2. CÁC TRANG BÊN TRONG HỆ THỐNG (CÓ SIDEBAR BAO BỌC) */}
        <Route path="/" element={<Layout />}>
          
          {/* Khi click vào link /dashboard -> Hiển thị Dashboard vào chỗ Outlet */}
          {/* 👇 ĐÃ SỬA DÒNG NÀY: VÀO WEB LÀ NHẢY RA TRANG LOGIN 👇 */}
          <Route index element={<Navigate to="/login" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ideas" element={<Ideas />} />
          <Route path="ideas/:id" element={<IdeaDetails />} /> 
          <Route path="categories" element={<CategoryPage />} />

          <Route path="users" element={<Users />} />
          <Route path='ExportData' element={<ExportData />} />
          <Route path='Reports' element={<Reports />} />
          <Route path='Topics' element={<Topics />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;