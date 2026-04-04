import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Lightbulb,
  Users,
  MessageSquare,
  FileBarChart,
  AlertCircle,
  UserRoundX,
  MessageCircleMore,
  Loader2 
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import getReportsSummary from "../services/reportsService";

//Import 2 thư viện xuất PDF
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import "./Reports.css";

const Reports = () => {
  const [reportData, setReportData] = useState({
    totalIdeas: 0,
    totalContributors: 0,
    totalComments: 0,
    departmentStats: [],
    ideasWithoutComments: [],
    anonymousIdeas: [],
    anonymousComments: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  //State để theo dõi trạng thái đang xuất file
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchReportsSummary = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getReportsSummary();
        setReportData({
          totalIdeas: data.totalIdeas || 0,
          totalContributors: data.totalContributors || 0,
          totalComments: data.totalComments || 0,
          departmentStats: data.departmentStats || [],
          ideasWithoutComments: data.ideasWithoutComments || [],
          anonymousIdeas: data.anonymousIdeas || [],
          anonymousComments: data.anonymousComments || [],
        });
      } catch (err) {
        setError("Failed to load reports data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsSummary();
  }, []);

  const handleExportPDF = async () => {
    const captureElement = document.getElementById("report-content");
    if (!captureElement) return;

    try {
      setIsExporting(true); // Bật hiệu ứng loading
      
      const canvas = await html2canvas(captureElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight(); 
      const imgHeight = (canvas.height * pdfWidth) / canvas.width; 

      let heightLeft = imgHeight; 
      let position = 0; 

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight; 

      // Vòng lặp
      while (heightLeft >= 0) {
        position = position - pageHeight; 
        pdf.addPage(); 
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight); 
        heightLeft -= pageHeight;
      }

      pdf.save("Analytics_Report.pdf");
      
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      alert("Có lỗi xảy ra khi xuất file!");
    } finally {
      setIsExporting(false); // Tắt hiệu ứng loading
    }
  };

  const activeDepartmentStats = useMemo(() => {
    return reportData.departmentStats.filter(
      (item) => item.ideaCount > 0 || item.contributorCount > 0
    );
  }, [reportData.departmentStats]);

  const ideaChartData = useMemo(() => {
    return activeDepartmentStats.map((item) => ({
      name: item.departmentName,
      value: item.ideaCount,
      percentage: item.ideaPercentage,
    }));
  }, [activeDepartmentStats]);

  const contributorChartData = useMemo(() => {
    return activeDepartmentStats.map((item) => ({
      name: item.departmentName,
      value: item.contributorCount,
      percentage: item.contributorPercentage,
    }));
  }, [activeDepartmentStats]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-GB");
  };

  const pieColors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4", "#6b7280", "#14b8a6"];

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Comprehensive analytics and insights on idea management activities</p>
        </div>

        <button 
          className="export-report-btn" 
          onClick={handleExportPDF}
          disabled={isExporting}
          style={{ opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'wait' : 'pointer' }}
        >
          {isExporting ? (
            <>
              <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              Exporting...
            </>
          ) : (
            <>
              <Download size={18} />
              Export Report
            </>
          )}
        </button>
      </div>

      {error && <div className="reports-error-box">{error}</div>}

      <div id="report-content" style={{ padding: '10px', backgroundColor: '#f8fafc' }}>
        
        {/* STATS */}
        <div className="reports-stats">
          <div className="report-stat-card">
            <div className="report-stat-top">
              <div className="report-stat-icon blue">
                <Lightbulb size={22} />
              </div>
              <span className="report-stat-change green">Live</span>
            </div>
            <h2>{loading ? "..." : reportData.totalIdeas}</h2>
            <h3>Total Ideas</h3>
            <p>Ideas submitted across all departments</p>
          </div>

          <div className="report-stat-card">
            <div className="report-stat-top">
              <div className="report-stat-icon green">
                <Users size={22} />
              </div>
              <span className="report-stat-change green">Live</span>
            </div>
            <h2>{loading ? "..." : reportData.totalContributors}</h2>
            <h3>Total Contributors</h3>
            <p>Unique users who submitted ideas</p>
          </div>

          <div className="report-stat-card">
            <div className="report-stat-top">
              <div className="report-stat-icon purple">
                <MessageSquare size={22} />
              </div>
              <span className="report-stat-change green">Live</span>
            </div>
            <h2>{loading ? "..." : reportData.totalComments}</h2>
            <h3>Total Comments</h3>
            <p>Comments and feedback on submitted ideas</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="chart-grid">
          <div className="chart-card">
            <div className="card-title-row">
              <FileBarChart size={18} />
              <h2>Ideas by Department</h2>
            </div>
            {loading ? (
              <div className="empty-chart">Loading data...</div>
            ) : ideaChartData.length === 0 ? (
              <div className="empty-chart">No data available</div>
            ) : (
              <div className="chart-canvas">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ideaChartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                      height={70}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#1e3a8a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="chart-card">
            <div className="card-title-row">
              <FileBarChart size={18} />
              <h2>Department Distribution</h2>
            </div>
            {loading ? (
              <div className="empty-chart">Loading data...</div>
            ) : contributorChartData.length === 0 ? (
              <div className="empty-chart">No data available</div>
            ) : (
              <div className="chart-canvas pie-layout">
                <div className="pie-wrap">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={contributorChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        innerRadius={0}
                      >
                        {contributorChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="pie-legend">
                  {contributorChartData.map((item, index) => (
                    <div className="pie-legend-item" key={item.name}>
                      <span
                        className="pie-dot"
                        style={{ backgroundColor: pieColors[index % pieColors.length] }}
                      />
                      <span className="pie-name">{item.name}</span>
                      <strong className="pie-value">{item.percentage}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABLES */}
        <div className="table-grid">
          <div className="report-table-card">
            <div className="report-table-header">
              <h2>Ideas per Department</h2>
              <p>Total ideas submitted by each department</p>
            </div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Ideas</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="empty-state-cell">Loading data...</td></tr>
                ) : reportData.departmentStats.length === 0 ? (
                  <tr><td colSpan="3" className="empty-state-cell">No data available</td></tr>
                ) : (
                  reportData.departmentStats.map((item, index) => (
                    <tr key={`${item.departmentName}-ideas-${index}`}>
                      <td>{item.departmentName}</td>
                      <td>{item.ideaCount}</td>
                      <td>{item.ideaPercentage}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="report-table-card">
            <div className="report-table-header">
              <h2>Contributors per Department</h2>
              <p>Unique contributors from each department</p>
            </div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Contributors</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="empty-state-cell">Loading data...</td></tr>
                ) : reportData.departmentStats.length === 0 ? (
                  <tr><td colSpan="3" className="empty-state-cell">No data available</td></tr>
                ) : (
                  reportData.departmentStats.map((item, index) => (
                    <tr key={`${item.departmentName}-contributors-${index}`}>
                      <td>{item.departmentName}</td>
                      <td>{item.contributorCount}</td>
                      <td>{item.contributorPercentage}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* EXCEPTIONS */}
        <div className="exception-section">
          <h2>Exception Reports</h2>
          <p>Items requiring attention or review</p>

          <div className="exception-card warning">
            <div className="exception-card-top">
              <div className="exception-title-wrap">
                <div className="exception-icon warning"><AlertCircle size={20} /></div>
                <div>
                  <h3>Ideas Without Comments</h3>
                  <span>Ideas that haven’t received feedback</span>
                </div>
              </div>
              <div className="exception-badge warning">
                {loading ? "..." : `${reportData.ideasWithoutComments.length} items`}
              </div>
            </div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Idea Title</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="empty-state-cell">Loading data...</td></tr>
                ) : reportData.ideasWithoutComments.length === 0 ? (
                  <tr><td colSpan="4" className="empty-state-cell">No data available</td></tr>
                ) : (
                  reportData.ideasWithoutComments.map((item, index) => (
                    <tr key={`${item.title}-without-comments-${index}`}>
                      <td>{item.title}</td>
                      <td>{item.departmentName}</td>
                      <td>{formatDate(item.date)}</td>
                      <td>No comments</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="exception-card info">
            <div className="exception-card-top">
              <div className="exception-title-wrap">
                <div className="exception-icon info"><UserRoundX size={20} /></div>
                <div>
                  <h3>Anonymous Ideas</h3>
                  <span>Ideas submitted anonymously</span>
                </div>
              </div>
              <div className="exception-badge info">
                {loading ? "..." : `${reportData.anonymousIdeas.length} items`}
              </div>
            </div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Idea Title</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="empty-state-cell">Loading data...</td></tr>
                ) : reportData.anonymousIdeas.length === 0 ? (
                  <tr><td colSpan="4" className="empty-state-cell">No data available</td></tr>
                ) : (
                  reportData.anonymousIdeas.map((item, index) => (
                    <tr key={`${item.title}-anonymous-idea-${index}`}>
                      <td>{item.title}</td>
                      <td>{item.departmentName}</td>
                      <td>{formatDate(item.date)}</td>
                      <td>Anonymous idea</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="exception-card purple">
            <div className="exception-card-top">
              <div className="exception-title-wrap">
                <div className="exception-icon purple"><MessageCircleMore size={20} /></div>
                <div>
                  <h3>Anonymous Comments</h3>
                  <span>Anonymous comments on ideas</span>
                </div>
              </div>
              <div className="exception-badge purple">
                {loading ? "..." : `${reportData.anonymousComments.length} items`}
              </div>
            </div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Idea Title</th>
                  <th>Department</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="empty-state-cell">Loading data...</td></tr>
                ) : reportData.anonymousComments.length === 0 ? (
                  <tr><td colSpan="3" className="empty-state-cell">No data available</td></tr>
                ) : (
                  reportData.anonymousComments.map((item, index) => (
                    <tr key={`${item.title}-anonymous-comment-${index}`}>
                      <td>{item.title}</td>
                      <td>{item.departmentName}</td>
                      <td>{formatDate(item.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      
      </div> 
    </div>
  );
};

export default Reports;