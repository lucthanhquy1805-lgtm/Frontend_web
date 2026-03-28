import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage'; // Nhớ import file của bạn

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Nếu người dùng gõ link gốc, tự động bẻ lái sang trang Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Khai báo các con đường (URL) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;