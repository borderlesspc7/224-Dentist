import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientAlert.css";
import {
  SearchIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import {
  clientPaymentService,
  type ClientPaymentAlertData,
} from "../../../../services/clientPaymentService";

// Usando ClientPaymentAlertData do serviço
type ClientPaymentAlert = ClientPaymentAlertData;

const ClientAlert: React.FC = () => {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<ClientPaymentAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<ClientPaymentAlert[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<ClientPaymentAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "overdue" | "paid" | "cancelled"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [filtrePaymentMethod, setFiltrePaymentMethod] = useState<
    "all" | "cash" | "transfer" | "check" | "pix"
  >("all");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const paymentAlerts =
          await clientPaymentService.getAllClientPaymentAlerts();
        setAlerts(paymentAlerts);
        setFilteredAlerts(paymentAlerts);
      } catch (error) {
        console.error("Error fetching client payment alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  useEffect(() => {
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((alert) => alert.status === filterStatus);
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((alert) => alert.priority === filterPriority);
    }

    if (filtrePaymentMethod !== "all") {
      filtered = filtered.filter(
        (alert) => alert.paymentMethod === filtrePaymentMethod
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, filterStatus, filterPriority, filtrePaymentMethod]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircleIcon className="status-icon" />;
      case "overdue":
        return <XCircleIcon className="status-icon" />;
      case "pending":
        return <AlertTriangleIcon className="status-icon" />;
      case "cancelled":
        return <XCircleIcon className="status-icon" />;
      default:
        return <AlertTriangleIcon className="status-icon" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#dc2626";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#059669";
      default:
        return "#6b7280";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "#059669";
      case "overdue":
        return "#dc2626";
      case "pending":
        return "#f59e0b";
      case "cancelled":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const calculateDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const hanldeMarkAsPaid = async (alertId: string) => {
    try {
      await clientPaymentService.markPaymentAsPaid(alertId);
      
      // Recarregar os alertas para refletir o novo status
      const paymentAlerts =
        await clientPaymentService.getAllClientPaymentAlerts();
      setAlerts(paymentAlerts);
      setFilteredAlerts(paymentAlerts);
    } catch (error) {
      console.error("Error marking payment as paid:", error);
    }
  };

  const handleSendReminder = async (alertId: string) => {
    try {
      await clientPaymentService.sendReminder(alertId);
      
      // Recarregar os alertas para refletir o novo contador de lembretes
      const paymentAlerts =
        await clientPaymentService.getAllClientPaymentAlerts();
      setAlerts(paymentAlerts);
      setFilteredAlerts(paymentAlerts);
    } catch (error) {
      console.error("Error sending reminder:", error);
    }
  };

  const handleViewDetails = (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="client-payment-alert">
        <div className="loading">Loading payments alerts...</div>
      </div>
    );
  }

  return (
    <div className="client-payment-alert">
      <div className="alert-header">
        <div className="header-content">
          <h1>Client Payment Alerts</h1>
          <p>Monitor and manage client payment schedules</p>
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
            placeholder="Search by client name, invoice number or clientID"
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
                    | "pending"
                    | "overdue"
                    | "paid"
                    | "cancelled"
                )
              }
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
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
            <label>Payment Method:</label>
            <select
              value={filtrePaymentMethod}
              onChange={(e) =>
                setFiltrePaymentMethod(
                  e.target.value as
                    | "all"
                    | "cash"
                    | "transfer"
                    | "check"
                    | "pix"
                )
              }
            >
              <option value="all">All methods</option>
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
              <option value="check">Check</option>
              <option value="pix">Pix</option>
            </select>
          </div>
        </div>
      </div>
      <div className="alerts-container">
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            <AlertTriangleIcon />
            <h3>No alerts found</h3>
            <p>No payment alerts match your current filters.</p>
          </div>
        ) : (
          <div className="alerts-grid">
            {filteredAlerts.map((alert) => {
              const daysOverdue = calculateDaysOverdue(alert.dueDate);
              const isOverdue = daysOverdue > 0;

              return (
                <div key={alert.id} className="alert-card">
                  <div className="alert-header-card">
                    <div className="client-info">
                      <h3>{alert.clientName}</h3>
                      <p className="invoice-number">{alert.invoiceNumber}</p>
                    </div>
                    <div
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(alert.status) }}
                    >
                      {getStatusIcon(alert.status)}
                      <span>{alert.status.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="alert-details">
                    <div className="detail-row">
                      <span className="label">Amount:</span>
                      <span className="value amount">
                        {formatCurrency(alert.amount)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Due Date:</span>
                      <span className="value">{alert.dueDate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Payment Method:</span>
                      <span className="value">
                        {alert.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Client ID:</span>
                      <span className="value">{alert.clientId}</span>
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
                    <div className="overdue-info">
                      {isOverdue ? (
                        <span className="overdue">
                          {daysOverdue} days overdue
                        </span>
                      ) : (
                        <span className="normal">
                          Due in {Math.abs(daysOverdue)} days
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
                      <>
                        <button
                          className="action-btn warning"
                          onClick={() => handleSendReminder(alert.id)}
                        >
                          Send Reminder ({alert.reminderCount})
                        </button>
                        <button
                          className="action-btn primary"
                          onClick={() => hanldeMarkAsPaid(alert.id)}
                        >
                          Mark as Paid
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
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
              <div className="client-info-section">
                <h3>{selectedAlert.clientName}</h3>
                <p className="invoice-info">
                  Invoice: {selectedAlert.invoiceNumber}
                </p>
                <div className="status-priority-row">
                  <div
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(selectedAlert.status),
                    }}
                  >
                    {getStatusIcon(selectedAlert.status)}
                    <span>{selectedAlert.status.toUpperCase()}</span>
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
                  <label>Amount:</label>
                  <span className="amount-large">
                    {formatCurrency(selectedAlert.amount)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Due Date:</label>
                  <span>{selectedAlert.dueDate}</span>
                </div>
                <div className="detail-item">
                  <label>Payment Method:</label>
                  <span>{selectedAlert.paymentMethod.toUpperCase()}</span>
                </div>
                <div className="detail-item">
                  <label>Client ID:</label>
                  <span>{selectedAlert.clientId}</span>
                </div>
                <div className="detail-item">
                  <label>Days Overdue:</label>
                  <span className={calculateDaysOverdue(selectedAlert.dueDate) > 0 ? "overdue" : "normal"}>
                    {calculateDaysOverdue(selectedAlert.dueDate) > 0
                      ? `${calculateDaysOverdue(selectedAlert.dueDate)} days`
                      : `Due in ${Math.abs(calculateDaysOverdue(selectedAlert.dueDate))} days`}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Reminder Count:</label>
                  <span>{selectedAlert.reminderCount || 0}</span>
                </div>
                {selectedAlert.lastReminder && (
                  <div className="detail-item">
                    <label>Last Reminder:</label>
                    <span>{selectedAlert.lastReminder}</span>
                  </div>
                )}
                {selectedAlert.contractServiceId && (
                  <div className="detail-item">
                    <label>Contract Service ID:</label>
                    <span>{selectedAlert.contractServiceId}</span>
                  </div>
                )}
              </div>

              {selectedAlert.description && (
                <div className="description-section">
                  <label>Description:</label>
                  <p>{selectedAlert.description}</p>
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
                onClick={() => navigate("/admin/cadastro-clientes")}
              >
                View Client
              </button>
              {selectedAlert.status !== "paid" && (
                <>
                  <button
                    className="action-button warning"
                    onClick={() => {
                      handleSendReminder(selectedAlert.id);
                    }}
                  >
                    Send Reminder
                  </button>
                  <button
                    className="action-button primary"
                    onClick={() => {
                      hanldeMarkAsPaid(selectedAlert.id);
                      handleCloseModal();
                    }}
                  >
                    Mark as Paid
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAlert;
