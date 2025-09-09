import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientAlert.css";
import {
  SearchIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";

interface ClientPaymentAlert {
  id: string;
  clientName: string;
  clientId: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: "pending" | "overdue" | "paid" | "cancelled";
  priority: "low" | "medium" | "high";
  paymentMethod: "cash" | "transfer" | "check" | "pix";
  description: string;
  lastReminder: string;
  reminderCount: number;
}

const ClientAlert: React.FC = () => {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<ClientPaymentAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<ClientPaymentAlert[]>(
    []
  );
  const [loading, setLoading] = useState(true);
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
    const mockAlerts: ClientPaymentAlert[] = [
      {
        id: "1",
        clientName: "João Silva",
        clientId: "CLI001",
        invoiceNumber: "INV-2024-001",
        amount: 2500.0,
        dueDate: "2024-01-15",
        status: "overdue",
        priority: "high",
        paymentMethod: "transfer",
        description: "Payment for dental treatment - Implant",
        lastReminder: "2024-01-10",
        reminderCount: 3,
      },
      {
        id: "2",
        clientName: "Maria Oliveira",
        clientId: "CLI002",
        invoiceNumber: "INV-2024-002",
        amount: 1500.0,
        dueDate: "2024-02-20",
        status: "pending",
        priority: "medium",
        paymentMethod: "cash",
        description: "Payment for dental treatment - Scaling",
        lastReminder: "2024-02-15",
        reminderCount: 1,
      },
      {
        id: "3",
        clientName: "Pedro Santos",
        clientId: "CLI003",
        invoiceNumber: "INV-2024-003",
        amount: 3000.0,
        dueDate: "2024-03-10",
        status: "paid",
        priority: "low",
        paymentMethod: "check",
        description: "Payment for dental treatment - Cleaning",
        lastReminder: "2024-03-05",
        reminderCount: 0,
      },
    ];

    setAlerts(mockAlerts);
    setLoading(false);
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

  const hanldeMarkAsPaid = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "paid" as const,
              lastReminder: new Date().toISOString().split("T")[0],
            }
          : alert
      )
    );
  };

  const handleSendReminder = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              reminderCount: alert.reminderCount + 1,
              lastReminder: new Date().toISOString().split("T")[0],
            }
          : alert
      )
    );
  };

  const handleViewDetails = (alertId: string) => {
    // Implementar modal de detalhes
    console.log("View details for alert:", alertId);
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
    </div>
  );
};

export default ClientAlert;
