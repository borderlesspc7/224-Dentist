import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VehicleAlert.css";
import {
  CarIcon,
  CalendarIcon,
  GaugeIcon,
  ClockIcon,
  SearchIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";

interface VehicleAlert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  alertType: "date" | "mileage" | "hours";
  currentValue: number;
  limitValue: number;
  dueDate: string;
  status: "pending" | "overdue" | "completed";
  priority: "low" | "medium" | "high";
  description: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

const VehicleAlert: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<VehicleAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<VehicleAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "date" | "mileage" | "hours"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "overdue" | "completed"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  // Mock data - replace with real data from Firestore
  useEffect(() => {
    const mockAlerts: VehicleAlert[] = [
      {
        id: "1",
        vehicleId: "v1",
        vehicleName: "Ford Transit",
        licensePlate: "ABC-1234",
        alertType: "date",
        currentValue: 0,
        limitValue: 0,
        dueDate: "2024-01-15",
        status: "overdue",
        priority: "high",
        description: "Oil change due",
        lastMaintenance: "2023-10-15",
        nextMaintenance: "2024-01-15",
      },
      {
        id: "2",
        vehicleId: "v2",
        vehicleName: "Chevrolet Silverado",
        licensePlate: "XYZ-5678",
        alertType: "mileage",
        currentValue: 45000,
        limitValue: 50000,
        dueDate: "2024-02-01",
        status: "pending",
        priority: "medium",
        description: "Engine service due",
        lastMaintenance: "2023-08-01",
        nextMaintenance: "2024-02-01",
      },
      {
        id: "3",
        vehicleId: "v3",
        vehicleName: "Toyota Hilux",
        licensePlate: "DEF-9012",
        alertType: "hours",
        currentValue: 180,
        limitValue: 200,
        dueDate: "2024-01-20",
        status: "pending",
        priority: "low",
        description: "Hydraulic system check",
        lastMaintenance: "2023-11-20",
        nextMaintenance: "2024-01-20",
      },
    ];

    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
    setLoading(false);
  }, []);

  // Filter alerts based on search and filters
  useEffect(() => {
    let filtered = alerts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((alert) => alert.alertType === filterType);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((alert) => alert.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter((alert) => alert.priority === filterPriority);
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, filterType, filterStatus, filterPriority]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "date":
        return <CalendarIcon />;
      case "mileage":
        return <GaugeIcon />;
      case "hours":
        return <ClockIcon />;
      default:
        return <CarIcon />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="status-icon completed" />;
      case "overdue":
        return <XCircleIcon className="status-icon overdue" />;
      case "pending":
        return <AlertTriangleIcon className="status-icon pending" />;
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

  const formatAlertValue = (alert: VehicleAlert) => {
    switch (alert.alertType) {
      case "date":
        return `Due: ${new Date(alert.dueDate).toLocaleDateString()}`;
      case "mileage":
        return `${alert.currentValue.toLocaleString()} / ${alert.limitValue.toLocaleString()} km`;
      case "hours":
        return `${alert.currentValue} / ${alert.limitValue} hours`;
      default:
        return "";
    }
  };

  const handleMarkAsCompleted = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: "completed" as const }
          : alert
      )
    );
  };

  const handleViewDetails = (alertId: string) => {
    // Navigate to vehicle details or maintenance history
    console.log("View details for alert:", alertId);
  };

  if (loading) {
    return (
      <div className="vehicle-alert">
        <div className="loading">Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className="vehicle-alert">
      <div className="alert-header">
        <div className="header-content">
          <h1>Vehicle Maintenance Alerts</h1>
          <p>Monitor and manage vehicle maintenance schedules</p>
        </div>
        <button
          className="back-button"
          onClick={() => navigate("/admin/avisos")}
        >
          ← Back to Alerts
        </button>
      </div>

      <div className="alert-filters">
        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search vehicles, license plates, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <label>Type:</label>
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(
                  e.target.value as "all" | "date" | "mileage" | "hours"
                )
              }
            >
              <option value="all">All Types</option>
              <option value="date">By Date</option>
              <option value="mileage">By Mileage</option>
              <option value="hours">By Hours</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Status:</label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "pending" | "overdue" | "completed"
                )
              }
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Priority:</label>
            <select
              value={filterPriority}
              onChange={(e) =>
                setFilterPriority(
                  e.target.value as "all" | "high" | "medium" | "low"
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
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            <CarIcon />
            <h3>No alerts found</h3>
            <p>No vehicle maintenance alerts match your current filters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className="alert-card">
              <div className="alert-card-header">
                <div className="alert-type">
                  {getAlertIcon(alert.alertType)}
                  <span className="type-label">
                    {alert.alertType === "date" && "Date"}
                    {alert.alertType === "mileage" && "Mileage"}
                    {alert.alertType === "hours" && "Hours"}
                  </span>
                </div>
                <div className="alert-priority">
                  <div
                    className="priority-dot"
                    style={{
                      backgroundColor: getPriorityColor(alert.priority),
                    }}
                  />
                  <span className="priority-label">{alert.priority}</span>
                </div>
              </div>

              <div className="alert-card-content">
                <div className="vehicle-info">
                  <h3>{alert.vehicleName}</h3>
                  <p className="license-plate">{alert.licensePlate}</p>
                </div>

                <div className="alert-details">
                  <p className="description">{alert.description}</p>
                  <p className="alert-value">{formatAlertValue(alert)}</p>
                </div>

                <div className="alert-dates">
                  <div className="date-item">
                    <span className="date-label">Last Maintenance:</span>
                    <span className="date-value">
                      {new Date(alert.lastMaintenance).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Next Maintenance:</span>
                    <span className="date-value">
                      {new Date(alert.nextMaintenance).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="alert-card-footer">
                <div className="alert-status">
                  {getStatusIcon(alert.status)}
                  <span className="status-label">{alert.status}</span>
                </div>

                <div className="alert-actions">
                  <button
                    className="action-button secondary"
                    onClick={() => handleViewDetails(alert.id)}
                  >
                    View Details
                  </button>
                  {alert.status !== "completed" && (
                    <button
                      className="action-button primary"
                      onClick={() => handleMarkAsCompleted(alert.id)}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VehicleAlert;
