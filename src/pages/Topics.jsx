import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Hash, Pencil, Trash2, X, Download, Loader2 } from "lucide-react"; // THÊM Download, Loader2
import {
  getTopicsPageData,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../services/topicsService";
import "./Topics.css";
import { getCategories } from '../services/categoryService';

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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [exportLoadingId, setExportLoadingId] = useState(null); // MỚI: Trạng thái loading xoay xoay cho nút Export
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    categoryId: "",
    description: "",
    isActive: true, 
  });

  const [categoriesData, setCategoriesData] = useState([]);

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
      console.error("Fetch topics error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesList = async () => {
    try {
      const data = await getCategories();
      setCategoriesData(data.categories || data.items || data);
    } catch (error) {
      console.error("Lỗi lấy danh sách Category:", error);
    }
  };

  useEffect(() => {
    fetchTopicsPageData();
    fetchCategoriesList();
  }, []);

  const categoryFilterOptions = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        pageData.topics.map((topic) => topic.categoryName).filter(Boolean)
      ),
    ];
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

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      categoryId: "",
      description: "",
      isActive: true, 
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setSubmitError("");
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSubmitError("");
    resetForm();
  };

  const handleOpenEditModal = (topic) => {
    const matchedCategory = categoriesData.find(
      (category) => category.name === topic.categoryName
    );

    setFormData({
      id: Number(topic.id),
      name: topic.name || "",
      categoryId: matchedCategory ? String(matchedCategory.id) : "",
      description: topic.description || "",
      isActive: topic.status?.toLowerCase() === "active" || topic.isActive === true, 
    });

    setSubmitError("");
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSubmitError("");
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.value === "true",
    }));
  };

  // ==============================================================
  // CÁC HÀM PHỤ TRỢ: CHUYỂN JSON SANG CSV VÀ TẢI FILE 
  // (Mượn từ trang ExportData sang)
  // ==============================================================
  const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : (Array.isArray(objArray) ? objArray : [objArray]);
    if (!array || !array.length) return '';

    const headers = Object.keys(array[0]);
    let str = headers.join(',') + '\r\n';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line !== '') line += ',';
            let cellValue = array[i][index] === null || array[i][index] === undefined ? "" : array[i][index];
            if (typeof cellValue === 'object') cellValue = JSON.stringify(cellValue);
            line += `"${String(cellValue).replace(/"/g, '""')}"`; 
        }
        str += line + '\r\n';
    }
    return str;
  };

  const downloadFile = (content, fileName) => {
    const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // MỚI THÊM: Hàm xử lý sự kiện bấm nút Export trên từng hàng
  // HÀM ĐÃ ĐƯỢC NÂNG CẤP ĐỂ FIX LỖI TÌM DỮ LIỆU
  const handleExportTopicIdeas = async (topic) => {
    if (topic.ideaCount === 0) {
      alert(`Topic "${topic.name}" hiện không có ý tưởng nào để xuất file!`);
      return;
    }

    try {
      setExportLoadingId(topic.id);
      
      const response = await fetch("https://localhost:7047/api/Ideas");
      if (!response.ok) throw new Error("Không thể kết nối đến máy chủ.");
      const data = await response.json();
      
      // Bóc tách mảng dữ liệu (Thêm fallback an toàn)
      let allIdeas = data.items || data.ideas || data.data || data; 
      if (!Array.isArray(allIdeas)) {
          allIdeas = Object.values(data).find(val => Array.isArray(val)) || [];
      }

      // Lọc thông minh: So sánh bằng cả ID lẫn TÊN
      const topicIdeas = allIdeas.filter(idea => 
        String(idea.topicId) === String(topic.id) || 
        String(idea.TopicId) === String(topic.id) ||
        idea.topicName === topic.name ||
        idea.TopicName === topic.name
      );

      if (topicIdeas.length === 0) {
         console.log("Dữ liệu Idea mẫu tải về:", allIdeas[0]); // Log ra để kiểm tra
         alert(`Dữ liệu Idea thuộc về Topic "${topic.name}" đang bị ẩn hoặc API chưa trả về trường TopicId/TopicName.`);
         return;
      }

      const csvContent = convertToCSV(topicIdeas);
      downloadFile(csvContent, `Ideas_Topic_${topic.name.replace(/\s+/g, '_')}`);

    } catch (error) {
      console.error("Export error:", error);
      alert("Đã xảy ra lỗi khi trích xuất dữ liệu Idea!");
    } finally {
      setExportLoadingId(null);
    }
  };
  // ==============================================================

  const handleAddTopic = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setSubmitError("Topic name is required.");
      return;
    }

    const parsedCategoryId = Number(formData.categoryId);

    if (!parsedCategoryId || Number.isNaN(parsedCategoryId)) {
      setSubmitError("Please select a valid category.");
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError("");

      const payload = {
        id: 0,
        name: formData.name.trim(),
        categoryId: parsedCategoryId,
        description: formData.description.trim() || "",
        isActive: formData.isActive, 
      };

      await createTopic(payload);
      await fetchTopicsPageData();
      handleCloseAddModal();
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const firstError = Object.values(apiErrors).flat()?.[0];
        setSubmitError(firstError || "Failed to create topic.");
      } else {
        setSubmitError(err?.response?.data?.message || "Failed to create topic.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditTopic = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setSubmitError("Topic name is required.");
      return;
    }

    const parsedTopicId = Number(formData.id);
    const parsedCategoryId = Number(formData.categoryId);

    if (!parsedTopicId || Number.isNaN(parsedTopicId)) {
      setSubmitError("Invalid topic ID.");
      return;
    }

    if (!parsedCategoryId || Number.isNaN(parsedCategoryId)) {
      setSubmitError("Please select a valid category.");
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError("");

      const payload = {
        id: parsedTopicId,
        name: formData.name.trim(),
        categoryId: parsedCategoryId,
        description: formData.description.trim() || "",
        isActive: formData.isActive, 
      };

      await updateTopic(parsedTopicId, payload);
      await fetchTopicsPageData();
      handleCloseEditModal();
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const firstError = Object.values(apiErrors).flat()?.[0];
        setSubmitError(firstError || "Failed to update topic.");
      } else {
        setSubmitError(err?.response?.data?.message || "Failed to update topic.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteTopic = async (topic) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${topic.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeleteLoadingId(topic.id);
      await deleteTopic(topic.id);
      await fetchTopicsPageData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete topic.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="topics-page">
      <div className="topics-header">
        <div>
          <h1>Topics</h1>
          <p>Manage discussion topics and subtopics for ideas</p>
        </div>

        <button className="add-topic-btn" onClick={handleOpenAddModal}>
          <Plus size={18} />
          Add Topic
        </button>
      </div>

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
          {categoryFilterOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

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
                        topic.status?.toLowerCase() === "active" || topic.isActive
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {topic.status || (topic.isActive ? "Active" : "Inactive")}
                    </span>
                  </td>

                  <td>
                    <div className="topic-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* NHÓM 1: CÁC NÚT THAO TÁC CƠ BẢN */}
                      <button
                        className="topic-action-btn edit"
                        title="Edit Topic"
                        onClick={() => handleOpenEditModal(topic)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="topic-action-btn delete"
                        title="Delete Topic"
                        onClick={() => handleDeleteTopic(topic)}
                        disabled={deleteLoadingId === topic.id}
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* VÁCH NGĂN: Ngăn cách bằng một đường kẻ mờ */}
                      <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1', margin: '0 4px' }}></div>

                      {/* NHÓM 2: NÚT EXPORT RIÊNG BIỆT BÊN NGOÀI */}
                      <button
                        className="topic-action-btn"
                        title="Export Ideas for this Topic"
                        onClick={() => handleExportTopicIdeas(topic)}
                        disabled={exportLoadingId === topic.id}
                        style={{ 
                          color: '#2563eb', 
                          backgroundColor: '#eff6ff',
                          border: '1px solid #bfdbfe' // Thêm cái viền mờ cho đẹp
                        }}
                      >
                        {exportLoadingId === topic.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===================== MODAL ADD TOPIC ===================== */}
      {isAddModalOpen && (
        <div className="topic-modal-overlay" onClick={handleCloseAddModal}>
          <div className="topic-modal" onClick={(e) => e.stopPropagation()}>
            <div className="topic-modal-header">
              <div>
                <h2>Add Topic</h2>
                <p>Create a new topic for ideas and discussions</p>
              </div>

              <button
                type="button"
                className="topic-modal-close"
                onClick={handleCloseAddModal}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTopic} className="topic-form">
              <div className="topic-form-group">
                <label>Topic Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter topic name"
                />
              </div>

              <div className="topic-form-group">
                <label>Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {categoriesData.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="topic-form-group">
                <label>Status</label>
                <select
                  name="isActive"
                  value={formData.isActive ? "true" : "false"}
                  onChange={handleStatusChange}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="topic-form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows="4"
                />
              </div>

              {submitError && (
                <div className="topic-form-error">{submitError}</div>
              )}

              <div className="topic-form-actions">
                <button
                  type="button"
                  className="topic-cancel-btn"
                  onClick={handleCloseAddModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="topic-submit-btn"
                  disabled={submitLoading}
                >
                  {submitLoading ? "Creating..." : "Create Topic"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL EDIT TOPIC ===================== */}
      {isEditModalOpen && (
        <div className="topic-modal-overlay" onClick={handleCloseEditModal}>
          <div className="topic-modal" onClick={(e) => e.stopPropagation()}>
            <div className="topic-modal-header">
              <div>
                <h2>Edit Topic</h2>
                <p>Update topic information</p>
              </div>

              <button
                type="button"
                className="topic-modal-close"
                onClick={handleCloseEditModal}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditTopic} className="topic-form">
              <div className="topic-form-group">
                <label>Topic Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter topic name"
                />
              </div>

              <div className="topic-form-group">
                <label>Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {categoriesData.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="topic-form-group">
                <label>Status</label>
                <select
                  name="isActive"
                  value={formData.isActive ? "true" : "false"}
                  onChange={handleStatusChange}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="topic-form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows="4"
                />
              </div>

              {submitError && (
                <div className="topic-form-error">{submitError}</div>
              )}

              <div className="topic-form-actions">
                <button
                  type="button"
                  className="topic-cancel-btn"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="topic-submit-btn"
                  disabled={submitLoading}
                >
                  {submitLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topics;