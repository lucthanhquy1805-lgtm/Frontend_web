import { useEffect, useMemo, useState } from "react";
import { Search, Plus, User, Shield, Pencil, Trash2, X } from "lucide-react";
import {
  getUserPageData,
  createUser,
  updateUser,
  deleteUser,
} from "../services/usersService";
import "./Users.css";

const Users = () => {
  const [pageData, setPageData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    administrators: 0,
    staffUsers: 0,
    users: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
  id: null,
  fullName: "",
  email: "",
  passwordHash: "",
  departmentId: "",
  roleId: "",
  isActive: true,
});
  /* Hardcode tạm, sau này thay bằng API Departments / Roles */
  const departmentsData = [
    { id: 1, name: "Faculty of IT" },
    { id: 2, name: "QA Department" },
    { id: 3, name: "HR Department" },
  ];

  const rolesData = [
    { id: 1, name: "Administrator" },
    { id: 2, name: "QA Manager" },
    { id: 3, name: "QA Coordinator" },
    { id: 4, name: "Staff" },
  ];

  const fetchUsersPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUserPageData();

      setPageData({
        totalUsers: data.totalUsers || 0,
        activeUsers: data.activeUsers || 0,
        administrators: data.administrators || 0,
        staffUsers: data.staffUsers || 0,
        users: data.users || [],
      });
    } catch (err) {
      setError("Failed to load user data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersPageData();
  }, []);

  const filteredUsers = useMemo(() => {
    return pageData.users.filter((user) => {
      const matchesSearch =
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.departmentName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        selectedRole === "All Roles" || user.roleName === selectedRole;

      const matchesStatus =
        selectedStatus === "All Status" || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [pageData.users, searchTerm, selectedRole, selectedStatus]);

  const resetForm = () => {
  setFormData({
    id: null,
    fullName: "",
    email: "",
    passwordHash: "",
    departmentId: "",
    roleId: "",
    isActive: true,
  });
};

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setSubmitError("");
    resetForm();
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSubmitError("");
    resetForm();
  };

  const handleOpenEditModal = (user) => {
    const matchedDepartment = departmentsData.find(
      (item) => item.name === user.departmentName
    );

    const matchedRole = rolesData.find((item) => item.name === user.roleName);

    setFormData({
  id: user.id,
  fullName: user.fullName || "",
  email: user.email || "",
  passwordHash: "",
  departmentId: matchedDepartment ? String(matchedDepartment.id) : "",
  roleId: matchedRole ? String(matchedRole.id) : "",
  isActive: user.status?.toLowerCase() === "active",
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

 const handleAddUser = async (e) => {
  e.preventDefault();

  if (!formData.fullName.trim()) {
    setSubmitError("Full name is required.");
    return;
  }

  if (!formData.email.trim()) {
    setSubmitError("Email is required.");
    return;
  }

  if (!formData.passwordHash.trim()) {
    setSubmitError("Password is required.");
    return;
  }

  if (!formData.departmentId) {
    setSubmitError("Please select a department.");
    return;
  }

  if (!formData.roleId) {
    setSubmitError("Please select a role.");
    return;
  }

  const selectedDepartment = departmentsData.find(
    (item) => Number(item.id) === Number(formData.departmentId)
  );

  const selectedRole = rolesData.find(
    (item) => Number(item.id) === Number(formData.roleId)
  );

  try {
    setSubmitLoading(true);
    setSubmitError("");

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      passwordHash: formData.passwordHash.trim(),
      departmentId: Number(formData.departmentId),
      roleId: Number(formData.roleId),
      isActive: formData.isActive,
      department: {
        id: Number(formData.departmentId),
        name: selectedDepartment?.name || "",
      },
      role: {
        id: Number(formData.roleId),
        name: selectedRole?.name || "",
      },
    };

    console.log("Create payload:", payload);

    await createUser(payload);
    await fetchUsersPageData();
    handleCloseAddModal();
  } catch (err) {
    console.error("Create user error:", err);
    console.log("Create user response:", err?.response?.data);

    const errors = err?.response?.data?.errors;

    setSubmitError(
      errors?.["Department.Name"]?.[0] ||
      errors?.["Role.Name"]?.[0] ||
      errors?.Department?.[0] ||
      errors?.Role?.[0] ||
      errors?.PasswordHash?.[0] ||
      errors?.Email?.[0] ||
      errors?.FullName?.[0] ||
      err?.response?.data?.message ||
      err?.response?.data?.title ||
      "Failed to create user."
    );
  } finally {
    setSubmitLoading(false);
  }
};

  const handleEditUser = async (e) => {
  e.preventDefault();

  if (!formData.fullName.trim()) {
    setSubmitError("Full name is required.");
    return;
  }

  if (!formData.email.trim()) {
    setSubmitError("Email is required.");
    return;
  }

  if (!formData.departmentId) {
    setSubmitError("Please select a department.");
    return;
  }

  if (!formData.roleId) {
    setSubmitError("Please select a role.");
    return;
  }

  try {
    setSubmitLoading(true);
    setSubmitError("");

    const payload = {
      id: formData.id,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      passwordHash: formData.passwordHash.trim() || "",
      departmentId: Number(formData.departmentId),
      isActive: formData.isActive,
      roleId: Number(formData.roleId),
    };

    await updateUser(formData.id, payload);
    await fetchUsersPageData();
    handleCloseEditModal();
  } catch (err) {
    console.error("Update user error:", err);
    console.log("Update user response:", err?.response?.data);

    setSubmitError(
      err?.response?.data?.message ||
      err?.response?.data?.title ||
      "Failed to update user."
    );
  } finally {
    setSubmitLoading(false);
  }
};

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.fullName}"?`
    );

    if (!confirmed) return;

    try {
      setDeleteLoadingId(user.id);
      await deleteUser(user.id);
      await fetchUsersPageData();
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          "Failed to delete user."
      );
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>User Management</h1>
          <p>Manage system users, roles, and permissions</p>
        </div>

        <button className="add-user-btn" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="users-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search users by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option>All Roles</option>
            <option>Administrator</option>
            <option>QA Manager</option>
            <option>QA Coordinator</option>
            <option>Staff</option>
          </select>


        </div>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <User size={20} />
          </div>
          <div>
            <h2>{pageData.totalUsers}</h2>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <User size={20} />
          </div>
          <div>
            <h2>{pageData.activeUsers}</h2>
            <p>Active Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Shield size={20} />
          </div>
          <div>
            <h2>{pageData.administrators}</h2>
            <p>Administrators</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <User size={20} />
          </div>
          <div>
            <h2>{pageData.staffUsers}</h2>
            <p>Staff Users</p>
          </div>
        </div>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Department</th>
              <th>Role</th>
              <th>Ideas</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  Loading users...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  {error}
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="user-name">{user.fullName}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td>{user.departmentName}</td>
                  <td>{user.roleName}</td>
                  <td>{user.ideaCount}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.status?.toLowerCase() === "active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <div className="user-actions">
                      <button
                        className="table-icon-btn edit"
                        onClick={() => handleOpenEditModal(user)}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="table-icon-btn delete"
                        onClick={() => handleDeleteUser(user)}
                        title="Delete"
                        disabled={deleteLoadingId === user.id}
                      >
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

      {isAddModalOpen && (
        <div className="user-modal-overlay" onClick={handleCloseAddModal}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <div>
                <h2>Add User</h2>
                <p>Create a new user account</p>
              </div>

              <button
                type="button"
                className="user-modal-close"
                onClick={handleCloseAddModal}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="user-form">
              <div className="user-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="user-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              <div className="user-form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="passwordHash"
                  value={formData.passwordHash}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="user-form-group">
                <label>Department</label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                >
                  <option value="">Select department</option>
                  {departmentsData.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="user-form-group">
                <label>Role</label>
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                >
                  <option value="">Select role</option>
                  {rolesData.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>


              {submitError && <div className="user-form-error">{submitError}</div>}

              <div className="user-form-actions">
                <button
                  type="button"
                  className="user-cancel-btn"
                  onClick={handleCloseAddModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="user-submit-btn"
                  disabled={submitLoading}
                >
                  {submitLoading ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="user-modal-overlay" onClick={handleCloseEditModal}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <div>
                <h2>Edit User</h2>
                <p>Update user information</p>
              </div>

              <button
                type="button"
                className="user-modal-close"
                onClick={handleCloseEditModal}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="user-form">
              <div className="user-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="user-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              <div className="user-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="user-form-group">
                <label>Department</label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                >
                  <option value="">Select department</option>
                  {departmentsData.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="user-form-group">
                <label>Role</label>
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                >
                  <option value="">Select role</option>
                  {rolesData.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {submitError && <div className="user-form-error">{submitError}</div>}

              <div className="user-form-actions">
                <button
                  type="button"
                  className="user-cancel-btn"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="user-submit-btn"
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

export default Users;