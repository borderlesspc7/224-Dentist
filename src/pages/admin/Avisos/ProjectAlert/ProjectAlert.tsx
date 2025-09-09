import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectAlert.css";
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  SearchIcon,
} from "lucide-react";

interface ProjectAlert {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  projectType: string;
  startDate: string;
  plannedEndDate: string;
  actualProgress: number;
  status: "on-track" | "at-risk" | "delayed" | "completed";
  priority: "low" | "medium" | "high";
  description: string;
  responsiblePerson: string;
  lastUpdate: string;
}

const ProjectAlert: React.FC = () => {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<ProjectAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<ProjectAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "on-track" | "at-risk" | "delayed" | "completed"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [selectedAlert, setSelectedAlert] = useState<ProjectAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgress, setEditingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(0);

  useEffect(() => {
    const mockAlerts: ProjectAlert[] = [
      {
        id: "1",
        projectId: "p1",
        projectName: "Underground Pipeline Installation",
        clientName: "City Water Department",
        projectType: "Infrastructure",
        startDate: "2023-11-01",
        plannedEndDate: "2024-02-15",
        actualProgress: 75,
        status: "on-track",
        priority: "high",
        description: "Main water pipeline installation project",
        responsiblePerson: "John Smith",
        lastUpdate: "2024-01-10",
      },
      {
        id: "2",
        projectId: "p2",
        projectName: "Sewer System Maintenance",
        clientName: "Metro Utilities",
        projectType: "Maintenance",
        startDate: "2023-12-01",
        plannedEndDate: "2024-01-20",
        actualProgress: 45,
        status: "at-risk",
        priority: "medium",
        description: "Quarterly sewer system maintenance",
        responsiblePerson: "Maria Garcia",
        lastUpdate: "2024-01-08",
      },
      {
        id: "3",
        projectId: "p3",
        projectName: "Drainage System Upgrade",
        clientName: "County Public Works",
        projectType: "Upgrade",
        startDate: "2023-10-15",
        plannedEndDate: "2024-01-10",
        actualProgress: 90,
        status: "delayed",
        priority: "high",
        description: "Storm drainage system upgrade",
        responsiblePerson: "David Johnson",
        lastUpdate: "2024-01-05",
      },
    ];

    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((alert) => alert.status === filterStatus);
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((alert) => alert.priority === filterPriority);
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, filterStatus, filterPriority]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="status-icon completed" />;
      case "delayed":
        return <AlertTriangleIcon className="status-icon delayed" />;
      case "at-risk":
        return <ClockIcon className="status-icon at-risk" />;
      case "on-track":
        return <CheckCircleIcon className="status-icon on-track" />;
      default:
        return <AlertTriangleIcon className="status-icon pending" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "on-track":
        return "#3b82f6";
      case "at-risk":
        return "#f59e0b";
      case "delayed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const calculateDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Funções de ação
  const handleViewDetails = (alertId: string) => {
    const alert = alerts.find((alert) => alert.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setIsModalOpen(true);
    }
  };

  const handleUpdateProgress = (alertId: string) => {
    const alert = alerts.find((alert) => alert.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setEditingProgress(true);
      setNewProgress(alert.actualProgress);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
    setEditingProgress(false);
    setIsModalOpen(false);
  };

  const handleSaveProgress = () => {
    if (selectedAlert) {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === selectedAlert.id
            ? {
                ...alert,
                actualProgress: newProgress,
                lastUpdate: new Date().toISOString().split("T")[0],
              }
            : alert
        )
      );
      setEditingProgress(false);
    }
  };

  const handleMarkAsCompleted = () => {
    if (selectedAlert) {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === selectedAlert.id
            ? {
                ...alert,
                status: "completed" as const,
                actualProgress: 100,
                lastUpdate: new Date().toISOString().split("T")[0],
              }
            : alert
        )
      );
      handleCloseModal();
    }
  };

  return (
    <div className="project-alert">
      <div className="alert-header">
        <div className="header-content">
          <h1>Project Completion Alerts</h1>
          <p>Monitor and manage project completion schedules</p>
        </div>
        <button
          className="back-button"
          onClick={() => navigate("/admin/avisos")}
        >
          ← Back to Alerts
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search by project name, client, or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <label>Status:</label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "all"
                    | "on-track"
                    | "at-risk"
                    | "delayed"
                    | "completed"
                )
              }
            >
              <option value="all">All Status</option>
              <option value="on-track">On Track</option>
              <option value="at-risk">At Risk</option>
              <option value="delayed">Delayed</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Priority:</label>
            <select
              value={filterPriority}
              onChange={(e) =>
                setFilterPriority(
                  e.target.value as "all" | "low" | "medium" | "high"
                )
              }
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="alerts-grid">
        {loading ? (
          <div className="loading">Loading project alerts...</div>
        ) : filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            <AlertTriangleIcon />
            <h3>No alerts found</h3>
            <p>No project alerts match your current filters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const daysRemaining = calculateDaysRemaining(alert.plannedEndDate);
            const isOverdue = daysRemaining < 0;
            const isUrgent = daysRemaining <= 7 && daysRemaining >= 0;

            return (
              <div key={alert.id} className="alert-card">
                <div className="alert-header-card">
                  <div className="project-info">
                    <h3>{alert.projectName}</h3>
                    <p className="client-name">{alert.clientName}</p>
                  </div>
                  <div
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(alert.status) }}
                  >
                    {getStatusIcon(alert.status)}
                    <span>{alert.status.replace("-", " ").toUpperCase()}</span>
                  </div>
                </div>

                <div className="alert-details">
                  <div className="detail-row">
                    <span className="label">Type:</span>
                    <span className="value">{alert.projectType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Progress:</span>
                    <span className="value">{alert.actualProgress}%</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">End Date:</span>
                    <span className="value">{alert.plannedEndDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Responsible:</span>
                    <span className="value">{alert.responsiblePerson}</span>
                  </div>
                </div>

                <div className="alert-footer">
                  <div className="priority-indicator">
                    <div
                      className="priority-dot"
                      style={{
                        backgroundColor: getPriorityColor(alert.priority),
                      }}
                    ></div>
                    <span>{alert.priority.toUpperCase()}</span>
                  </div>

                  <div className="days-remaining">
                    {isOverdue ? (
                      <span className="overdue">
                        Overdue by {Math.abs(daysRemaining)} days
                      </span>
                    ) : isUrgent ? (
                      <span className="urgent">
                        {daysRemaining} days remaining
                      </span>
                    ) : (
                      <span className="normal">
                        {daysRemaining} days remaining
                      </span>
                    )}
                  </div>
                </div>

                <div className="alert-actions">
                  <button
                    className="action-btn secondary"
                    onClick={() => handleViewDetails(alert.id)}
                  >
                    View Details
                  </button>
                  <button
                    className="action-btn primary"
                    onClick={() => handleUpdateProgress(alert.id)}
                  >
                    Update Progress
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && selectedAlert && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Project Details</h2>
              <button className="close-button" onClick={handleCloseModal}>
                X
              </button>
            </div>

            <div className="modal-body">
              <div className="project-info-section">
                <h3>{selectedAlert.projectName}</h3>
                <p className="client-info">
                  Client: {selectedAlert.clientName}
                </p>
                <div className="status-priority-row">
                  <div
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(selectedAlert.status),
                    }}
                  >
                    {getStatusIcon(selectedAlert.status)}
                    <span>
                      {selectedAlert.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                  <div
                    className="priority-badge"
                    style={{
                      backgroundColor: getPriorityColor(selectedAlert.priority),
                    }}
                  >
                    {selectedAlert.priority.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="project-details-grid">
                <div className="detail-item">
                  <label>Project Type:</label>
                  <span>{selectedAlert.projectType}</span>
                </div>
                <div className="detail-item">
                  <label>Responsible Person:</label>
                  <span>{selectedAlert.responsiblePerson}</span>
                </div>
                <div className="detail-item">
                  <label>Start Date:</label>
                  <span>{selectedAlert.startDate}</span>
                </div>
                <div className="detail-item">
                  <label>Planned End Date:</label>
                  <span>{selectedAlert.plannedEndDate}</span>
                </div>
                <div className="detail-item">
                  <label>Last Update:</label>
                  <span>{selectedAlert.lastUpdate}</span>
                </div>
                <div className="detail-item">
                  <label>Days Remaining:</label>
                  <span
                    className={
                      calculateDaysRemaining(selectedAlert.plannedEndDate) < 0
                        ? "overdue"
                        : calculateDaysRemaining(
                            selectedAlert.plannedEndDate
                          ) <= 7
                        ? "urgent"
                        : "normal"
                    }
                  >
                    {calculateDaysRemaining(selectedAlert.plannedEndDate) < 0
                      ? `Overdue by ${Math.abs(
                          calculateDaysRemaining(selectedAlert.plannedEndDate)
                        )} days`
                      : `${calculateDaysRemaining(
                          selectedAlert.plannedEndDate
                        )} days remaining`}
                  </span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <label>Progress:</label>
                  {!editingProgress ? (
                    <button
                      className="edit-button"
                      onClick={() => setEditingProgress(true)}
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="progress-edit">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newProgress}
                        onChange={(e) => setNewProgress(Number(e.target.value))}
                        className="progress-input"
                      />
                      <button
                        className="save-button"
                        onClick={handleSaveProgress}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => setEditingProgress(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${selectedAlert.actualProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {selectedAlert.actualProgress}%
                </span>
              </div>
              <div className="description-section">
                <label>Description:</label>
                <p>{selectedAlert.description}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="action-button secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              {selectedAlert.status !== "completed" && (
                <button
                  className="action-button primary"
                  onClick={handleMarkAsCompleted}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAlert;
