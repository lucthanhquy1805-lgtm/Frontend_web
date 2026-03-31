import React from "react";
import { Search, Plus, Hash, Pencil, Trash2 } from "lucide-react";
import "./Topics.css";

const Topics = () => {
  return (
    <div className="topics-page">
      {/* Header */}
      <div className="topics-header">
        <div>
          <h1>Topics</h1>
          <p>Manage discussion topics and subtopics for ideas</p>
        </div>

        <button className="add-topic-btn">
          <Plus size={18} />
          Add Topic
        </button>
      </div>

      {/* Search + Filter */}
      <div className="topics-filters">
        <div className="topics-search-box">
          <Search size={18} />
          <input type="text" placeholder="Search topics..." />
        </div>

        <select className="topics-filter-select">
          <option>All Categories</option>
        </select>
      </div>

      {/* Stats */}
      <div className="topics-stats">
        <div className="topic-stat-card">
          <div className="topic-stat-icon blue">
            <Hash size={20} />
          </div>
          <div>
            <h2>0</h2>
            <p>Total Topics</p>
          </div>
        </div>

        <div className="topic-stat-card">
          <div className="topic-stat-icon green">
            <Hash size={20} />
          </div>
          <div>
            <h2>0</h2>
            <p>Active Topics</p>
          </div>
        </div>

        <div className="topic-stat-card">
          <div className="topic-stat-icon purple">
            <Hash size={20} />
          </div>
          <div>
            <h2>0</h2>
            <p>Total Ideas</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="topics-table-wrapper">
        <table className="topics-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Category</th>
              <th>Description</th>
              <th>Ideas</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="6" className="topics-empty-state">
                No topics available
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* UI preview row mẫu, nếu không cần thì xóa nguyên block này */}
      <div className="topics-preview-note">
        UI only. Connect API later.
      </div>
    </div>
  );
};

export default Topics;