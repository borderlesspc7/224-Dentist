import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ContractedServiceAlert.css";
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
import type { ContractService } from "../../../../types/contractService";

interface ContractedServicePaymentAlert {
  id: string;
  contractServiceId: string;
  contractService: ContractService;
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
  paymentTerms: "7" | "15" | "30" | "45" | "60";
}

const ContractedServicePaymentAlert: React.FC = () => {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<ContractedServicePaymentAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<
    ContractedServicePaymentAlert[]
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
    "all" | "7" | "15" | "30" | "45" | "60"
  >("all");
  const [selectedAlert, setSelectedAlert] =
    useState<ContractedServicePaymentAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const mockContractServices: ContractService[] = [
      {
        id: "cs1",
        serviceName: "Underground Pipeline Installation",
        clientId: "c1",
        clientName: "City Water Department",
        projectNumber: "PROJ-2024-001",
        contractNumber: "CNT-2024-001",
        startDate: "2024-01-15",
        endDate: "2024-06-15",
        estimatedDuration: "5 months",
        status: "in_progress",
        serviceType: "Infrastructure",
        description: "Main water pipeline installation project",
        location: {
          address: "123 Main Street",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
        },
        budget: {
          estimatedCost: 150000,
          actualCost: 120000,
          currency: "USD",
        },
        requirements: ["Excavation permit", "Safety certification"],
        deliverables: ["Pipeline installation", "Testing report"],
        notes: "High priority project",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "cs2",
        serviceName: "Sewer System Maintenance",
        clientId: "c2",
        clientName: "Metro Utilities",
        projectNumber: "PROJ-2024-002",
        contractNumber: "CNT-2024-002",
        startDate: "2024-02-01",
        endDate: "2024-03-01",
        estimatedDuration: "1 month",
        status: "completed",
        serviceType: "Maintenance",
        description: "Quarterly sewer system maintenance",
        location: {
          address: "456 Oak Avenue",
          city: "Houston",
          state: "TX",
          zipCode: "77001",
        },
        budget: {
          estimatedCost: 45000,
          actualCost: 42000,
          currency: "USD",
        },
        requirements: ["Maintenance permit", "Equipment access"],
        deliverables: ["Maintenance report", "System testing"],
        notes: "Routine maintenance",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-02-28"),
      },
      {
        id: "cs3",
        serviceName: "Drainage System Upgrade",
        clientId: "c3",
        clientName: "County Public Works",
        projectNumber: "PROJ-2024-003",
        contractNumber: "CNT-2024-003",
        startDate: "2024-01-10",
        endDate: "2024-04-10",
        estimatedDuration: "3 months",
        status: "in_progress",
        serviceType: "Upgrade",
        description: "Storm drainage system upgrade",
        location: {
          address: "789 Pine Street",
          city: "Miami",
          state: "FL",
          zipCode: "33101",
        },
        budget: {
          estimatedCost: 85000,
          actualCost: 78000,
          currency: "USD",
        },
        requirements: ["Environmental permit", "Traffic control"],
        deliverables: ["Upgraded system", "Performance report"],
        notes: "Weather dependent project",
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-20"),
      },
    ];

    const mockAlerts: ContractedServicePaymentAlert[] = [
      {
        id: "1",
        contractServiceId: "cs1",
        contractService: mockContractServices[0],
        lastServiceDate: "2024-01-20",
        nextPaymentDate: "2024-02-05",
        amountDue: 25000,
        currency: "USD",
        status: "due-today",
        priority: "high",
        description: "First milestone payment for pipeline installation",
        responsiblePerson: "Mike Johnson",
        lastUpdate: "2024-01-25",
        serviceDescription: "Underground pipeline installation - Phase 1",
        projectReference: "PROJ-2024-001",
        paymentTerms: "15",
      },
      {
        id: "2",
        contractServiceId: "cs2",
        contractService: mockContractServices[1],
        lastServiceDate: "2024-02-28",
        nextPaymentDate: "2024-03-15",
        amountDue: 42000,
        currency: "USD",
        status: "overdue",
        priority: "high",
        description: "Final payment for sewer maintenance project",
        responsiblePerson: "Sarah Wilson",
        lastUpdate: "2024-03-01",
        serviceDescription: "Sewer system maintenance - Complete",
        projectReference: "PROJ-2024-002",
        paymentTerms: "15",
      },
      {
        id: "3",
        contractServiceId: "cs3",
        contractService: mockContractServices[2],
        lastServiceDate: "2024-01-25",
        nextPaymentDate: "2024-02-10",
        amountDue: 19500,
        currency: "USD",
        status: "pending",
        priority: "medium",
        description: "Progress payment for drainage upgrade",
        responsiblePerson: "David Brown",
        lastUpdate: "2024-01-30",
        serviceDescription: "Drainage system upgrade - Phase 1",
        projectReference: "PROJ-2024-003",
        paymentTerms: "15",
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
          alert.contractService.serviceName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          alert.contractService.clientName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.projectReference
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          alert.contractService.contractNumber
            .toLowerCase()
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
        (alert) => alert.paymentTerms === filterPaymentTerms
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
      <div className="contracted-service-payment-alert">
        <div className="loading">
          Loading contracted service payment alerts...
        </div>
      </div>
    );
  }

  return (
    <div className="contracted-service-payment-alert">
      <div className="alert-header">
        <div className="header-content">
          <h1>Contracted Service Payment Alerts</h1>
          <p>Monitor and manage contracted service payment schedules</p>
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
            placeholder="Search by service name, client, contract number, or project reference"
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
              <option value="due-today">Due Today</option>
              <option value="overdue">Overdue</option>
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
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Payment Terms:</label>
            <select
              value={filterPaymentTerms}
              onChange={(e) =>
                setFilterPaymentTerms(
                  e.target.value as "all" | "7" | "15" | "30" | "45" | "60"
                )
              }
            >
              <option value="all">All terms</option>
              <option value="7">7 days</option>
              <option value="15">15 days</option>
              <option value="30">30 days</option>
              <option value="45">45 days</option>
              <option value="60">60 days</option>
            </select>
          </div>
        </div>
      </div>
      <div className="alerts-grid">
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            <CreditCardIcon />
            <h3>No alerts found</h3>
            <p>
              No contracted service payment alerts match your current filters.
            </p>
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
                  <div className="service-info">
                    <h3>{alert.contractService.serviceName}</h3>
                    <p className="client-name">
                      {alert.contractService.clientName}
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
                    <div className="contract-info">
                      <span className="contract-number">
                        Contract: {alert.contractService.contractNumber}
                      </span>
                      {alert.projectReference && (
                        <span className="project-ref">
                          Project: {alert.projectReference}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="service-details">
                    <div className="detail-row">
                      <span className="label">Service Type:</span>
                      <span className="value">
                        {alert.contractService.serviceType}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Payment Terms:</span>
                      <span className="value">{alert.paymentTerms} days</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Location:</span>
                      <span className="value">
                        {alert.contractService.location.city},{" "}
                        {alert.contractService.location.state}
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
      </div>
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
              <div className="service-info-section">
                <h3>{selectedAlert.contractService.serviceName}</h3>
                <p className="client-info">
                  Client: {selectedAlert.contractService.clientName}
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
                  <span>{selectedAlert.paymentTerms} days</span>
                </div>
                <div className="detail-item">
                  <label>Contract Number:</label>
                  <span>{selectedAlert.contractService.contractNumber}</span>
                </div>
                <div className="detail-item">
                  <label>Service Type:</label>
                  <span>{selectedAlert.contractService.serviceType}</span>
                </div>
                <div className="detail-item">
                  <label>Location:</label>
                  <span>
                    {selectedAlert.contractService.location.address},{" "}
                    {selectedAlert.contractService.location.city},{" "}
                    {selectedAlert.contractService.location.state}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Responsible Person:</label>
                  <span>{selectedAlert.responsiblePerson}</span>
                </div>
                {selectedAlert.projectReference && (
                  <div className="detail-item">
                    <label>Project Reference:</label>
                    <span>{selectedAlert.projectReference}</span>
                  </div>
                )}
              </div>

              <div className="budget-section">
                <label>Budget Information:</label>
                <div className="budget-details">
                  <div className="budget-item">
                    <span className="budget-label">Estimated Cost:</span>
                    <span className="budget-value">
                      {formatCurrency(
                        selectedAlert.contractService.budget.estimatedCost,
                        selectedAlert.currency
                      )}
                    </span>
                  </div>
                  <div className="budget-item">
                    <span className="budget-label">Actual Cost:</span>
                    <span className="budget-value">
                      {selectedAlert.contractService.budget.actualCost
                        ? formatCurrency(
                            selectedAlert.contractService.budget.actualCost,
                            selectedAlert.currency
                          )
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="description-section">
                <label>Service Description:</label>
                <p>
                  {selectedAlert.serviceDescription ||
                    selectedAlert.description}
                </p>
              </div>

              {selectedAlert.contractService.notes && (
                <div className="notes-section">
                  <label>Notes:</label>
                  <p>{selectedAlert.contractService.notes}</p>
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
                onClick={() => navigate("/admin/cadastro-servicos-contratados")}
              >
                View Contracted Services
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
  );
};

export default ContractedServicePaymentAlert;
