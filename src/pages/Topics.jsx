import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Hash, Pencil, Trash2 } from "lucide-react";
import getTopicsPageData from "../services/topicsService";
import "./Topics.css";

const Topics = () => {
  const [pageData, setPageData] = useState({
    totalTopics: 0,
    activeTopics: 0,
    totalIdeas: 0,
    topics: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopicsPageData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTopicsPageData();

        setPageData({
          totalTopics: data.totalTopics || 0,
          activeTopics: data.activeTopics || 0,
          totalIdeas: data.totalIdeas || 0,
          topics: data.topics || [],
        });
      } catch (err) {
        setError("Failed to load topics data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicsPageData();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(pageData.topics.map((topic) => topic.categoryName).filter(Boolean))];
    return ["All Categories", ...uniqueCategories];
  }, [pageData.topics]);

  const filteredTopics = useMemo(() => {
    return pageData.topics.filter((topic) => {
      const matchSearch = topic.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "All Categories" ||
        topic.categoryName === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [pageData.topics, searchTerm, selectedCategory]);

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
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="topics-filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="topics-stats">
        <div className="topic-stat-card">
          <div className="topic-stat-icon blue">
            <Hash size={20} />
          </div>
          <div>
            <h2>{pageData.totalTopics}</h2>
            <p>Total Topics</p>
          </div>
        </div>

        <div className="topic-stat-card">
          <div className="topic-stat-icon green">
            <Hash size={20} />
          </div>
          <div>
            <h2>{pageData.activeTopics}</h2>
            <p>Active Topics</p>
          </div>
        </div>

        <div className="topic-stat-card">
          <div className="topic-stat-icon purple">
            <Hash size={20} />
          </div>
          <div>
            <h2>{pageData.totalIdeas}</h2>
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
            {loading ? (
              <tr>
                <td colSpan="6" className="topics-empty-state">
                  Loading topics...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="topics-empty-state">
                  {error}
                </td>
              </tr>
            ) : filteredTopics.length === 0 ? (
              <tr>
                <td colSpan="6" className="topics-empty-state">
                  No topics found
                </td>
              </tr>
            ) : (
              filteredTopics.map((topic) => (
                <tr key={topic.id}>
                  <td>
                    <div className="topic-row-main">
                      <div className="topic-badge-icon">
                        <Hash size={16} />
                      </div>
                      <div>
                        <div className="topic-name">{topic.name}</div>
                        <div className="topic-id">ID: {topic.id}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="category-pill">
                      {topic.categoryName || "N/A"}
                    </span>
                  </td>

                  <td>{topic.description || "No description"}</td>

                  <td>
                    <span className="ideas-count">{topic.ideaCount}</span>
                  </td>

                  <td>
                    <span
                      className={`status-pill ${
                        topic.status?.toLowerCase() === "active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {topic.status}
                    </span>
                  </td>

                  <td>
                    <div className="topic-actions">
                      <button className="topic-action-btn edit" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button className="topic-action-btn delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Topics;