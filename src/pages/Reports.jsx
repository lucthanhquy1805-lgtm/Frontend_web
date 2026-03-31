import React from "react";
import {
  Download,
  Lightbulb,
  Users,
  MessageSquare,
  FileBarChart,
  AlertCircle,
  UserRoundX,
  MessageCircleMore,
} from "lucide-react";
import "./Reports.css";

const Reports = () => {
  return (
    <div className="reports-page">

      {/* HEADER */}
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Comprehensive analytics and insights on idea management activities</p>
        </div>

        <button className="export-report-btn">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* STATS */}
      <div className="reports-stats">
        <div className="report-stat-card">
          <div className="report-stat-top">
            <div className="report-stat-icon blue">
              <Lightbulb size={22} />
            </div>
            <span className="report-stat-change green">+0%</span>
          </div>
          <h2>0</h2>
          <h3>Total Ideas</h3>
          <p>No data</p>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-top">
            <div className="report-stat-icon green">
              <Users size={22} />
            </div>
            <span className="report-stat-change green">+0%</span>
          </div>
          <h2>0</h2>
          <h3>Total Contributors</h3>
          <p>No data</p>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-top">
            <div className="report-stat-icon purple">
              <MessageSquare size={22} />
            </div>
            <span className="report-stat-change green">+0%</span>
          </div>
          <h2>0</h2>
          <h3>Total Comments</h3>
          <p>No data</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="chart-grid">

        <div className="chart-card">
          <div className="card-title-row">
            <FileBarChart size={18} />
            <h2>Ideas by Department</h2>
          </div>

          <div className="empty-chart">
            No data available
          </div>
        </div>

        <div className="chart-card">
          <div className="card-title-row">
            <FileBarChart size={18} />
            <h2>Department Distribution</h2>
          </div>

          <div className="empty-chart">
            No data available
          </div>
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
              <tr>
                <td colSpan="3" className="empty-state-cell">
                  No data available
                </td>
              </tr>
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
                <th>Avg Ideas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="empty-state-cell">
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* EXCEPTIONS */}
      <div className="exception-section">
        <h2>Exception Reports</h2>
        <p>Items requiring attention or review</p>

        {/* Ideas Without Comments */}
        <div className="exception-card warning">
          <div className="exception-card-top">
            <div className="exception-title-wrap">
              <div className="exception-icon warning">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3>Ideas Without Comments</h3>
                <span>Ideas that haven’t received feedback</span>
              </div>
            </div>
            <div className="exception-badge warning">0 items</div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Idea Title</th>
                <th>Department</th>
                <th>Date</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4" className="empty-state-cell">
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Anonymous Ideas */}
        <div className="exception-card info">
          <div className="exception-card-top">
            <div className="exception-title-wrap">
              <div className="exception-icon info">
                <UserRoundX size={20} />
              </div>
              <div>
                <h3>Anonymous Ideas</h3>
                <span>Ideas submitted anonymously</span>
              </div>
            </div>
            <div className="exception-badge info">0 items</div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Idea Title</th>
                <th>Department</th>
                <th>Date</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4" className="empty-state-cell">
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Anonymous Comments */}
        <div className="exception-card purple">
          <div className="exception-card-top">
            <div className="exception-title-wrap">
              <div className="exception-icon purple">
                <MessageCircleMore size={20} />
              </div>
              <div>
                <h3>Anonymous Comments</h3>
                <span>Anonymous comments on ideas</span>
              </div>
            </div>
            <div className="exception-badge purple">0 items</div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Idea Title</th>
                <th>Comment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="empty-state-cell">
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default Reports;