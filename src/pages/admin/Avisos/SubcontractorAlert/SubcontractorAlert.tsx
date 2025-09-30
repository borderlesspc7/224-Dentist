import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SubcontractorAlert.css";
import {
  CreditCardIcon,
  CalendarIcon,
  ClockIcon,
  SearchIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  DollarSignIcon,
} from "lucide-react";
import type { Subcontractor } from "../../../../types/subcontractor";

interface SubcontractorPaymentAlert {
  id: string;
  subcontractorId: string;
  subcontractor: Subcontractor;
  lastServiceDate: string;
  nextPaymentDate: string;
  amountDue: number;
  currency: string;
  status: "pending" | "overdue" | "due-today" | "paid";
  priority: "low" | "medium" | "high";
  description: string;
  responsiblePerson: string;
  lastUpdate: string;
  serviceDescription?: string;
  projectReference?: string;
}

const SubcontractorAlert: React.FC = () => {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<SubcontractorPaymentAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<
    SubcontractorPaymentAlert[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "overdue" | "due-today" | "paid"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [filterPaymentTerms, setFilterPaymentTerms] = useState<
    "all" | "7" | "15" | "30"
  >("all");
  const [selectedAlert, setSelectedAlert] =
    useState<SubcontractorPaymentAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - replace with real data from Firestore
  useEffect(() => {
    const mockSubcontractors: Subcontractor[] = [
      {
        id: "sc1",
        companyName: "John Doe Services LLC",
        contactPerson: "John Doe",
        email: "john@jds.com",
        phone: "(555) 010-0456",
        state: "CA",
        city: "Los Angeles",
        address: "123 Main St",
        itinNumber: "12-3456789",
        services: ["Excavation", "Drainage"],
        hourlyRate: 85,
        paymentTerms: "15",
        availability: "available",
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "sc2",
        companyName: "Build&Co Inc",
        contactPerson: "Mary Smith",
        email: "mary@buildco.com",
        phone: "(555) 019-1111",
        state: "TX",
        city: "Houston",
        address: "456 Oak Ave",
        itinNumber: "98-7654321",
        services: ["Concrete", "Foundation"],
        hourlyRate: 95,
        paymentTerms: "30",
        availability: "busy",
        createdAt: new Date("2023-03-20"),
        updatedAt: new Date("2024-01-10"),
      },
      {
        id: "sc3",
        companyName: "RoadWorks LLC",
        contactPerson: "Carlos Lima",
        email: "carlos@roadworks.com",
        phone: "(555) 017-2222",
        state: "FL",
        city: "Miami",
        address: "789 Pine St",
        itinNumber: "45-6789012",
        services: ["Road Construction", "Asphalt"],
        hourlyRate: 75,
        paymentTerms: "7",
        availability: "available",
        createdAt: new Date("2023-06-10"),
        updatedAt: new Date("2024-01-05"),
      },
    ];
    const mockAlerts: SubcontractorPaymentAlert[] = [
      {
        id: "1",
        subcontractorId: "sc1",
        subcontractor: mockSubcontractors[0],
        lastServiceDate: "2024-01-10",
        nextPaymentDate: "2024-01-25",
        amountDue: 3200,
        currency: "USD",
        status: "due-today",
        priority: "high",
        description: "Excavation work for drainage project",
        responsiblePerson: "Mike Johnson",
        lastUpdate: "2024-01-20",
        serviceDescription: "Site excavation and drainage installation",
        projectReference: "PROJ-2024-001",
      },
      {
        id: "2",
        subcontractorId: "sc2",
        subcontractor: mockSubcontractors[1],
        lastServiceDate: "2023-12-15",
        nextPaymentDate: "2024-01-14",
        amountDue: 5800,
        currency: "USD",
        status: "overdue",
        priority: "high",
        description: "Concrete foundation work",
        responsiblePerson: "Sarah Wilson",
        lastUpdate: "2024-01-15",
        serviceDescription: "Foundation concrete pour and finishing",
        projectReference: "PROJ-2023-045",
      },
      {
        id: "3",
        subcontractorId: "sc3",
        subcontractor: mockSubcontractors[2],
        lastServiceDate: "2024-01-20",
        nextPaymentDate: "2024-01-27",
        amountDue: 900,
        currency: "USD",
        status: "pending",
        priority: "low",
        description: "Road repair and asphalt work",
        responsiblePerson: "David Brown",
        lastUpdate: "2024-01-22",
        serviceDescription: "Pothole repair and asphalt patching",
        projectReference: "PROJ-2024-003",
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
          alert.subcontractor.companyName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          alert.subcontractor.contactPerson
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.projectReference
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((alert) => alert.status === filterStatus);
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((alert) => alert.priority === filterPriority);
    }

    if (filterPaymentTerms !== "all") {
      filtered = filtered.filter(
        (alert) => alert.subcontractor.paymentTerms === filterPaymentTerms
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, filterStatus, filterPriority, filterPaymentTerms]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircleIcon className="status-icon paid" />;
      case "overdue":
        return <XCircleIcon className="status-icon overdue" />;
      case "due-today":
        return <AlertTriangleIcon className="status-icon due-today" />;
      case "pending":
        return <ClockIcon className="status-icon pending" />;
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
      case "paid":
        return "#10b981";
      case "due-today":
        return "#f59e0b";
      case "overdue":
        return "#ef4444";
      case "pending":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const calculateDaysRemaining = (paymentDate: string) => {
    const today = new Date();
    const payment = new Date(paymentDate);
    const diffTime = payment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleViewDetails = (alertId: string) => {
    const alert = alerts.find((alert) => alert.id === alertId);

    if (alert) {
      setSelectedAlert(alert);
      setIsModalOpen(true);
    }
  };

  const handleMarkAsPaid = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "paid" as const,
              lastUpdate: new Date().toISOString().split("T")[0],
            }
          : alert
      )
    );
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="subcontractor-payment-alert">
        <div className="loading">Loading subcontractor alerts...</div>
      </div>
    );
  }

  return (
    <div className="subcontractor-payment-alert">
      <div className="alert-header">
        <div className="header-content">
          <h1>Subcontractor Payment Alerts</h1>
          <p>Monitor and manage subcontractor payment schedules</p>
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
            placeholder="Search by company, contact, description, or project reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <label>Status:</label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "all"
                    | "pending"
                    | "overdue"
                    | "due-today"
                    | "paid"
                )
              }
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="overdue">Due Today</option>
              <option value="due-today">Overdue</option>
              <option value="paid">Paid</option>
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
              <option value="all">All priorities</option>
              <option value="low">High</option>
              <option value="medium">Medium</option>
              <option value="high">Low</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Payment Terms:</label>
            <select
              value={filterPaymentTerms}
              onChange={(e) =>
                setFilterPaymentTerms(
                  e.target.value as "all" | "7" | "15" | "30"
                )
              }
            >
              <option value="all">All terms</option>
              <option value="7">7 days</option>
              <option value="15">15 days</option>
              <option value="30">30 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="alerts-grid">
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            <CreditCardIcon />
            <h3>No alerts found</h3>
            <p>No subcontractor payment alerts match your current filters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const daysRemaining = calculateDaysRemaining(alert.nextPaymentDate);
            const isOverdue = daysRemaining < 0;
            const isDueToday = daysRemaining === 0;
            const isUrgent = daysRemaining <= 7 && daysRemaining >= 0;

            return (
              <div key={alert.id} className="alert-card">
                <div className="alert-card-header">
                  <div className="subcontractor-info">
                    <h3>{alert.subcontractor.companyName}</h3>
                    <p className="contact-person">
                      {alert.subcontractor.contactPerson}
                    </p>
                  </div>
                  <div
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(alert.status) }}
                  >
                    {getStatusIcon(alert.status)}
                    <span>{alert.status.replace("-", " ").toUpperCase()}</span>
                  </div>
                </div>

                <div className="alert-card-content">
                  <div className="payment-info">
                    <div className="amount-due">
                      <DollarSignIcon className="amount-icon" />
                      <span className="amount">
                        {formatCurrency(alert.amountDue, alert.currency)}
                      </span>
                    </div>
                    <div className="payment-date">
                      <CalendarIcon className="date-icon" />
                      <span className="date-label">Due:</span>
                      <span className="date-value">
                        {alert.nextPaymentDate}
                      </span>
                    </div>
                  </div>

                  <div className="alert-details">
                    <p className="description">{alert.description}</p>
                    {alert.projectReference && (
                      <p className="project-ref">
                        Project: {alert.projectReference}
                      </p>
                    )}
                  </div>

                  <div className="subcontractor-details">
                    <div className="detail-row">
                      <span className="label">Payment Terms:</span>
                      <span className="value">
                        {alert.subcontractor.paymentTerms} days
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Hourly Rate:</span>
                      <span className="value">
                        {formatCurrency(
                          alert.subcontractor.hourlyRate || 0,
                          alert.currency
                        )}
                        /hr
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Services:</span>
                      <span className="value">
                        {alert.subcontractor.services.join(", ")}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Responsible:</span>
                      <span className="value">{alert.responsiblePerson}</span>
                    </div>
                  </div>
                </div>

                <div className="alert-card-footer">
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
                    ) : isDueToday ? (
                      <span className="due-today">Due today</span>
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
                  {alert.status !== "paid" && (
                    <button
                      className="action-btn primary"
                      onClick={() => handleMarkAsPaid(alert.id)}
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isModalOpen && selectedAlert && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Payment Details</h2>
                <button className="close-button" onClick={handleCloseModal}>
                  X
                </button>
              </div>

              <div className="modal-body">
                <div className="subcontractor-info-section">
                  <h3>{selectedAlert.subcontractor.companyName}</h3>
                  <p className="contact-info">
                    Contact: {selectedAlert.subcontractor.contactPerson}
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
                        backgroundColor: getPriorityColor(
                          selectedAlert.priority
                        ),
                      }}
                    >
                      {selectedAlert.priority.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="payment-details-grid">
                  <div className="detail-item">
                    <label>Amount Due:</label>
                    <span className="amount-large">
                      {formatCurrency(
                        selectedAlert.amountDue,
                        selectedAlert.currency
                      )}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Due Date:</label>
                    <span>{selectedAlert.nextPaymentDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Service Date:</label>
                    <span>{selectedAlert.lastServiceDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Terms:</label>
                    <span>{selectedAlert.subcontractor.paymentTerms} days</span>
                  </div>
                  <div className="detail-item">
                    <label>Hourly Rate:</label>
                    <span>
                      {formatCurrency(
                        selectedAlert.subcontractor.hourlyRate || 0,
                        selectedAlert.currency
                      )}
                      /hr
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Responsible Person:</label>
                    <span>{selectedAlert.responsiblePerson}</span>
                  </div>
                  <div className="detail-item">
                    <label>Services:</label>
                    <span>
                      {selectedAlert.subcontractor.services.join(", ")}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Contact Info:</label>
                    <span>
                      {selectedAlert.subcontractor.phone} •{" "}
                      {selectedAlert.subcontractor.email}
                    </span>
                  </div>
                  {selectedAlert.projectReference && (
                    <div className="detail-item">
                      <label>Project Reference:</label>
                      <span>{selectedAlert.projectReference}</span>
                    </div>
                  )}
                </div>

                <div className="description-section">
                  <label>Service Description:</label>
                  <p>
                    {selectedAlert.serviceDescription ||
                      selectedAlert.description}
                  </p>
                </div>

                {selectedAlert.subcontractor.notes && (
                  <div className="notes-section">
                    <label>Notes:</label>
                    <p>{selectedAlert.subcontractor.notes}</p>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="action-button secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  className="action-button secondary"
                  onClick={() => navigate("/admin/cadastro-subcontratados")}
                >
                  View Subcontractor
                </button>
                {selectedAlert.status !== "paid" && (
                  <button
                    className="action-button primary"
                    onClick={() => {
                      handleMarkAsPaid(selectedAlert.id);
                      handleCloseModal();
                    }}
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcontractorAlert;
