import React, { useState } from "react";
import {
  FileText,
  Database,
  Download,
  Calendar,
  FileSpreadsheet,
  FileJson,
  File,
  CheckCircle2,
} from "lucide-react";
import "./ExportData.css";

const ExportData = () => {
  const [fileFormat, setFileFormat] = useState("CSV");
  const [dateRange, setDateRange] = useState("All Time");

  const exportOptions = [
    {
      title: "CSV",
      description: "Comma-separated values (Excel compatible)",
      icon: <FileText size={20} />,
    },
    {
      title: "XLSX",
      description: "Microsoft Excel spreadsheet",
      icon: <FileSpreadsheet size={20} />,
    },
    {
      title: "JSON",
      description: "JavaScript Object Notation",
      icon: <FileJson size={20} />,
    },
    {
      title: "PDF",
      description: "Portable Document Format (Report)",
      icon: <File size={20} />,
    },
  ];

  const dateOptions = [
    "All Time",
    "Last 12 Months",
    "Last Quarter",
    "Last Month",
  ];

  const exportCards = [
    {
      title: "Ideas Data",
      description: "Export all ideas with details, status, votes, and comments",
      records: "247 records",
      icon: <FileText size={24} />,
      iconClass: "blue",
    },
    {
      title: "Users Data",
      description: "Export user information, departments, and activity",
      records: "86 records",
      icon: <Database size={24} />,
      iconClass: "green",
    },
    {
      title: "Comments Data",
      description: "Export all comments and feedback on ideas",
      records: "1,842 records",
      icon: <FileText size={24} />,
      iconClass: "purple",
    },
    {
      title: "Analytics Report",
      description: "Export comprehensive analytics and statistics",
      records: "1 records",
      icon: <Database size={24} />,
      iconClass: "orange",
    },
  ];

  const recentExports = [
    
  ];

  return (
    <div className="export-page">
      <div className="export-header">
        <h1>Export Data</h1>
        <p>Download system data in various formats for reporting and analysis</p>
      </div>

      <div className="export-settings-card">
        <h2>Export Settings</h2>

        <div className="export-settings-grid">
          <div className="settings-column">
            <h3>File Format</h3>

            <div className="settings-options">
              {exportOptions.map((item) => (
                <label
                  key={item.title}
                  className={`option-card ${fileFormat === item.title ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="fileFormat"
                    value={item.title}
                    checked={fileFormat === item.title}
                    onChange={() => setFileFormat(item.title)}
                  />
                  <div className="option-content">
                    <div className="option-title-row">
                      <span className="option-icon">{item.icon}</span>
                      <span className="option-title">{item.title}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="settings-column">
            <h3>Date Range</h3>

            <div className="settings-options">
              {dateOptions.map((item) => (
                <label
                  key={item}
                  className={`option-card ${dateRange === item ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="dateRange"
                    value={item}
                    checked={dateRange === item}
                    onChange={() => setDateRange(item)}
                  />
                  <div className="option-content">
                    <div className="option-title-row">
                      <span className="option-icon">
                        <Calendar size={18} />
                      </span>
                      <span className="option-title">{item}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section-title">Select Data to Export</div>

      <div className="export-cards-grid">
        {exportCards.map((card) => (
          <div className="export-data-card" key={card.title}>
            <div className="export-data-top">
              <div className={`export-data-icon ${card.iconClass}`}>{card.icon}</div>
              <span className="record-count">{card.records}</span>
            </div>

            <h3>{card.title}</h3>
            <p>{card.description}</p>

            <button className="export-btn">
              <Download size={18} />
              Export {fileFormat}
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

        <button className="complete-export-btn">
          <Download size={18} />
          Export Complete Database ({fileFormat})
        </button>
      </div>

      <div className="recent-exports-card">
        <h2>Recent Exports</h2>

        <div className="recent-exports-list">
          {recentExports.map((item) => (
            <div className="recent-export-item" key={`${item.name}-${item.time}`}>
              <div className="recent-export-left">
                <div className="recent-export-status">
                  <CheckCircle2 size={22} />
                </div>

                <div>
                  <h4>{item.name}</h4>
                  <p>{item.time}</p>
                </div>
              </div>

              <div className="recent-export-right">
                <strong>{item.format}</strong>
                <span>{item.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExportData;