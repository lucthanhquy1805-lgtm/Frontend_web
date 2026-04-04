import React, { useState } from "react";
import {
  FileText,
  Database,
  Download,
  Calendar,
  FileJson,
  CheckCircle2,
  Loader2,
  PieChart
} from "lucide-react";
import "./ExportData.css";

const ExportData = () => {
  const [fileFormat, setFileFormat] = useState("CSV");
  const [dateRange, setDateRange] = useState("All Time");
  
  // Trạng thái Loading để xoay icon khi đang tải dữ liệu
  const [exportingCard, setExportingCard] = useState(null);

  // ĐÃ LƯỢC BỎ XLSX VÀ PDF
  const exportOptions = [
    {
      title: "CSV",
      description: "Comma-separated values (Excel compatible)",
      icon: <FileText size={20} />,
    },
    {
      title: "JSON",
      description: "JavaScript Object Notation",
      icon: <FileJson size={20} />,
    },
  ];

  const dateOptions = [
    "All Time",
    "Last 12 Months",
    "Last Quarter",
    "Last Month",
  ];

  // Khai báo các thẻ kèm theo đường dẫn API của C#
  const exportCards = [
    {
      id: "ideas",
      title: "Ideas Data",
      description: "Export all ideas with details, status, votes, and comments",
      endpoint: "https://localhost:7047/api/Ideas", 
      icon: <FileText size={24} />,
      iconClass: "blue",
    },
    {
      id: "users",
      title: "Users Data",
      description: "Export user information, departments, and activity",
      endpoint: "https://localhost:7047/api/Users/page-data",
      icon: <Database size={24} />,
      iconClass: "green",
    },
    {
      id: "analytics",
      title: "Analytics Report",
      description: "Export comprehensive analytics, KPI summaries, and department statistics",
      endpoint: "https://localhost:7047/api/Reports/summary", 
      icon: <PieChart size={24} />,
      iconClass: "orange",
    },
    {
      id: "topics",
      title: "Topics & Categories Data",
      description: "Export system topics, categories and their statistics",
      endpoint: "https://localhost:7047/api/Topics/page-data", 
      icon: <Database size={24} />,
      iconClass: "orange",
    },
  ];

  const [recentExports, setRecentExports] = useState([]);

  // ==========================================
  // HÀM PHÉP THUẬT 1: BIẾN JSON THÀNH CSV
  // ==========================================
  const convertToCSV = (objArray) => {
    // Nếu dữ liệu không phải là mảng (VD: Object rỗng), ép nó thành mảng
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : (Array.isArray(objArray) ? objArray : [objArray]);
    
    if (!array || !array.length) return '';

    // Lấy tên cột từ key của Object đầu tiên
    const headers = Object.keys(array[0]);
    
    // Tạo chuỗi dòng tiêu đề
    let str = headers.join(',') + '\r\n';

    // Tạo các dòng dữ liệu
    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line !== '') line += ',';
            
            // Xử lý dữ liệu để tránh lỗi dấu phẩy hoặc ngoặc kép bên trong nội dung
            let cellValue = array[i][index] === null || array[i][index] === undefined ? "" : array[i][index];
            if (typeof cellValue === 'object') cellValue = JSON.stringify(cellValue);
            
            // Bọc data trong dấu ngoặc kép để an toàn cho CSV
            line += `"${String(cellValue).replace(/"/g, '""')}"`; 
        }
        str += line + '\r\n';
    }
    return str;
  };

  // ==========================================
  // HÀM PHÉP THUẬT 2: TẢI FILE VỀ MÁY
  // ==========================================
  const downloadFile = (content, fileName, format) => {
    let mimeType = format === "CSV" ? "text/csv;charset=utf-8;" : "application/json";
    let fileContent = format === "CSV" ? "\uFEFF" + content : JSON.stringify(content, null, 2); // Thêm BOM (\uFEFF) để Excel đọc tiếng Việt không bị lỗi font

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // HÀM XỬ LÝ KHI BẤM NÚT EXPORT
  // ==========================================
  const handleExport = async (card) => {
    try {
      setExportingCard(card.id);
      
      // 1. Gọi API lấy dữ liệu thô (JSON) từ Backend
      const response = await fetch(card.endpoint);
      if (!response.ok) throw new Error("Lỗi khi tải dữ liệu từ server");
      let data = await response.json();

      // Mẹo: Nếu data bọc trong túi (VD: data.items, data.users), hãy bóc nó ra
      let actualData = data.items || data.users || data.ideas || data.topics || data;

      if (card.id === "analytics" && fileFormat === "CSV") {
        // C# trả về cục data phức tạp, nếu xuất CSV thì ta ưu tiên lấy mảng thống kê phòng ban cho đẹp
        if (data.departmentStats && data.departmentStats.length > 0) {
          actualData = data.departmentStats;
        } else {
          // Nếu không có mảng, ta gom các số KPI tổng thành 1 dòng CSV
          actualData = [{
            Total_Ideas: data.totalIdeas || 0,
            Total_Contributors: data.totalContributors || 0,
            Total_Comments: data.totalComments || 0
          }];
        }
      }

      // 2. Chuyển đổi định dạng nếu cần
      let finalContent = actualData;
      if (fileFormat === "CSV") {
        finalContent = convertToCSV(actualData);
      }

      // 3. Tải file về máy
      downloadFile(finalContent, card.title.replace(/\s+/g, '_'), fileFormat);

      // 4. Cập nhật lịch sử Export (Hiển thị cho đẹp)
      setRecentExports(prev => [
        {
          name: `${card.title} Export`,
          time: new Date().toLocaleString(),
          format: fileFormat,
          size: fileFormat === "CSV" ? `${(finalContent.length / 1024).toFixed(1)} KB` : "Auto"
        },
        ...prev
      ].slice(0, 5)); // Chỉ giữ 5 lịch sử gần nhất

    } catch (error) {
      console.error("Export failed:", error);
      alert(`Không thể lấy dữ liệu cho ${card.title}. Vui lòng kiểm tra lại kết nối Backend!`);
    } finally {
      setExportingCard(null);
    }
  };

  // Xử lý nút Export Toàn bộ Database (Gọi tất cả API cùng lúc)
  const handleExportCompleteDB = async () => {
    if (fileFormat === "CSV") {
      alert("Chế độ 'Complete Database' với CSV sẽ tải về nhiều file riêng biệt.");
    }
    
    // Lặp qua tất cả các card và tải về
    for (const card of exportCards) {
      await handleExport(card);
    }
  };

  return (
    <div className="export-page">
      <div className="export-header">
        <h1>Export Data</h1>
        <p>Download system data in various formats for reporting and analysis</p>
      </div>

      {/* KHU VỰC CHỌN FORMAT FILE */}
      <div className="export-settings-card">
        <h2>Export Settings</h2>
        
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', color: '#334155', marginBottom: '15px' }}>File Format</h3>
          
          {/* Lưới 2 cột cho CSV và JSON */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {exportOptions.map((item) => (
              <label
                key={item.title}
                className={`option-card ${fileFormat === item.title ? "selected" : ""}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  padding: '20px',
                  borderRadius: '10px',
                  border: fileFormat === item.title ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: fileFormat === item.title ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="radio"
                  name="fileFormat"
                  value={item.title}
                  checked={fileFormat === item.title}
                  onChange={() => setFileFormat(item.title)}
                  style={{ marginTop: '5px' }}
                />
                <div className="option-content">
                  <div className="option-title-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <span className="option-icon" style={{ color: fileFormat === item.title ? '#2563eb' : '#64748b' }}>
                      {item.icon}
                    </span>
                    <span className="option-title" style={{ fontWeight: 'bold', color: '#0f172a' }}>
                      {item.title}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{item.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="section-title">Select Data to Export</div>

      <div className="export-cards-grid">
        {exportCards.map((card) => (
          <div className="export-data-card" key={card.id}>
            <div className="export-data-top">
              <div className={`export-data-icon ${card.iconClass}`}>{card.icon}</div>
            </div>

            <h3>{card.title}</h3>
            <p>{card.description}</p>

            <button 
              className="export-btn" 
              onClick={() => handleExport(card)}
              disabled={exportingCard === card.id}
              style={{ cursor: exportingCard === card.id ? 'wait' : 'pointer' }}
            >
              {exportingCard === card.id ? (
                <><Loader2 size={18} className="animate-spin" /> Exporting...</>
              ) : (
                <><Download size={18} /> Export {fileFormat}</>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="complete-export-banner">
        <div className="complete-export-left">
          <div className="complete-export-icon">
            <Database size={26} />
          </div>
          <div>
            <h3>Export Complete Database</h3>
            <p>Download all system data including ideas, users, comments, and analytics</p>
          </div>
        </div>

        <button className="complete-export-btn" onClick={handleExportCompleteDB}>
          <Download size={18} />
          Export Complete Database ({fileFormat})
        </button>
      </div>

      {/* KHU VỰC HIỂN THỊ LỊCH SỬ EXPORT */}
      <div className="recent-exports-card">
        <h2 style={{ marginBottom: '20px' }}>Recent Exports</h2>
        
        {recentExports.length === 0 ? (
           <p style={{ color: '#64748b', fontStyle: 'italic', padding: '10px 0' }}>No recent exports during this session.</p>
        ) : (
          <div className="recent-exports-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentExports.map((item, idx) => (
              <div 
                className="recent-export-item" 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              >
                <div className="recent-export-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="recent-export-status" style={{ color: '#10b981', display: 'flex' }}>
                    <CheckCircle2 size={24} />
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '15px' }}>{item.name}</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{item.time}</p>
                  </div>
                </div>

                <div className="recent-export-right" style={{ textAlign: 'right' }}>
                  <strong style={{ display: 'block', color: '#0f172a', fontSize: '14px', marginBottom: '2px' }}>{item.format}</strong>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{item.size}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportData;