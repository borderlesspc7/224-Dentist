import { useState, useEffect } from "react";
import "./User.css";
import {
  FiUser,
  FiShield,
  FiEdit,
  FiTrash,
  FiEye,
  FiSearch,
} from "react-icons/fi";
import { userService } from "../../../services/userService";
import type { UserProfile } from "../../../types/user";

// Tipo estendido para incluir campos do serviço
type UserWithDates = UserProfile & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function User() {
  const [users, setUsers] = useState<UserWithDates[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "partial">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"name" | "email" | "createdAt">("name");

  // Estados para métricas
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    adminUsers: 0,
    partialUsers: 0,
    recentUsers: 0,
  });

  // Calcular métricas
  const calculateMetrics = (usersData: UserWithDates[]) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    setMetrics({
      totalUsers: usersData.length,
      adminUsers: usersData.filter((user) => user.role === "admin").length,
      partialUsers: usersData.filter((user) => user.role === "partial").length,
      recentUsers: usersData.filter((user) => user.createdAt > sevenDaysAgo)
        .length,
    });
  };

  // Filtrar e ordenar usuários
  const getFilteredUsers = () => {
    let filtered = [...users];

    // Filtro por busca
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.displayName || "").localeCompare(b.displayName || "");
        case "email":
          return a.email.localeCompare(b.email);
        case "createdAt":
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const usersData = (await userService.getAllUsers()) as UserWithDates[];
        setUsers(usersData);
        calculateMetrics(usersData);
      } catch (error) {
        console.error("Error loading users:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch users"
        );
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Users management</h1>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Try again</button>
        </div>
      )}

      {/* Métricas */}
      {!loading && !error && (
        <div className="metrics-section">
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon total">
                <FiUser />
              </div>
              <div className="metric-content">
                <h3>{metrics.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon admin">
                <FiShield />
              </div>
              <div className="metric-content">
                <h3>{metrics.adminUsers}</h3>
                <p>Administrators</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon partial">
                <FiUser />
              </div>
              <div className="metric-content">
                <h3>{metrics.partialUsers}</h3>
                <p>Partial Users</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon recent">
                <FiUser />
              </div>
              <div className="metric-content">
                <h3>{metrics.recentUsers}</h3>
                <p>Recent (7 days)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros - sempre visível quando não está carregando e não há erro */}
      {!loading && !error && (
        <div className="filters-section">
          <div className="filters-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-controls">
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as "all" | "admin" | "partial")
                }
                className="filter-select"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="partial">Partial Users</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "name" | "email" | "createdAt")
                }
                className="filter-select"
              >
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="createdAt">Sort by Date</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setSortBy("name");
                }}
                className="clear-filters-btn"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de usuários filtrados */}
      {!loading && !error && getFilteredUsers().length > 0 && (
        <div className="users-grid">
          {getFilteredUsers().map((user) => (
            <div key={user.uid} className="user-card">
              <div className="card-header">
                <div className="user-info">
                  <FiUser className="user-icon" />
                  <h3 className="user-name">{user.displayName || "No name"}</h3>
                </div>
                <div className={`role-badge ${user.role}`}>
                  <FiShield className="role-icon" />
                  {user.role === "admin" ? "Admin" : "Partial"}
                </div>
              </div>
              <div className="card-content">
                <p className="user-email">{user.email}</p>
                <p className="user-paths">
                  Permissions:{" "}
                  {user.allowedPaths?.length && user.allowedPaths?.length > 0
                    ? user.allowedPaths?.join(", ")
                    : user.role === "admin"
                    ? "Full access"
                    : "No permissions"}
                </p>
              </div>
              <div className="card-actions">
                <button className="action-btn view">
                  <FiEye />
                </button>
                <button className="action-btn edit">
                  <FiEdit />
                </button>
                <button className="action-btn delete">
                  <FiTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estado vazio - nenhum usuário */}
      {!loading && !error && users.length === 0 && (
        <div className="empty-container">
          <FiUser className="empty-icon" />
          <p>No users found</p>
          <p className="empty-subtitle">
            Users will be shown here when they are created
          </p>
        </div>
      )}

      {/* Estado vazio - filtros sem resultado */}
      {!loading &&
        !error &&
        getFilteredUsers().length === 0 &&
        users.length > 0 && (
          <div className="empty-container">
            <FiSearch className="empty-icon" />
            <p>No users found matching your filters</p>
            <p className="empty-subtitle">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
    </div>
  );
}
