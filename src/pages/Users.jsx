import { useEffect, useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import getUserPageData from "../services/usersService";
import { User, Shield } from "lucide-react";
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

  useEffect(() => {
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

  return (
    <div className="users-page">
      {/* HEADER */}
      <div className="users-header">
        <div>
          <h1>User Management</h1>
          <p>Manage system users, roles, and permissions</p>
        </div>

        <button className="add-user-btn">
          <Plus size={18} /> Add User
        </button>
      </div>

      {/* SEARCH + FILTER */}
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
            <option>Staff</option>
            <option>No Role</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* STATS */}
      {/* STATS */}
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

      {/* TABLE */}
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
                      className={`status-badge ${user.status?.toLowerCase() === "active"
                          ? "active"
                          : "inactive"
                        }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button className="table-action-btn">View</button>
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

export default Users;