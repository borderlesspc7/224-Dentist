import { useMemo } from "react";
import { useDashboardData } from "../../../hooks/useDashboardData";
import { useDashboardAlerts } from "../../../hooks/useDashboardAlerts";
import { useNavigation } from "../../../hooks/useNavigation";
import {
  UsersIcon,
  UserPlusIcon,
  ServerIcon,
  CreditCardIcon,
  CarIcon,
  HomeIcon,
  WalletIcon,
  FileTextIcon,
  DollarSignIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BellIcon,
  RefreshCwIcon,
} from "lucide-react";
import "./Dashboard.css";

interface StatCard {
  id: string;
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  route?: string;
}

export default function Dashboard() {
  const { data, loading, refreshData } = useDashboardData();
  const { alerts: recentAlerts, loading: alertsLoading } = useDashboardAlerts();
  const { goTo } = useNavigation();

  // Calculate statistics
  const stats: StatCard[] = useMemo(
    () => [
      {
        id: "users",
        title: "Total Users",
        count: data.users.length,
        icon: <UsersIcon />,
        color: "#0ea5e9",
        trend: { value: 12, isPositive: true },
        route: "/admin/cadastro-usuario",
      },
      {
        id: "clients",
        title: "Clients",
        count: data.clients.length,
        icon: <UserPlusIcon />,
        color: "#8b5cf6",
        trend: { value: 8, isPositive: true },
        route: "/admin/cadastro-clientes",
      },
      {
        id: "employees",
        title: "Employees",
        count: data.employees.length,
        icon: <UserPlusIcon />,
        color: "#10b981",
        trend: { value: 5, isPositive: false },
        route: "/admin/cadastro-funcionario",
      },
      {
        id: "services",
        title: "Services",
        count: data.services.length,
        icon: <ServerIcon />,
        color: "#f59e0b",
        route: "/admin/cadastro-servico",
      },
      {
        id: "subcontractors",
        title: "Subcontractors",
        count: data.subcontractors.length,
        icon: <UserPlusIcon />,
        color: "#06b6d4",
        route: "/admin/cadastro-subcontratados",
      },
      {
        id: "contract-services",
        title: "Contract Services",
        count: data.contractServices.length,
        icon: <FileTextIcon />,
        color: "#ec4899",
        route: "/admin/cadastro-servicos-contratados",
      },
      {
        id: "vehicles",
        title: "Vehicles",
        count: data.vehicles.length,
        icon: <CarIcon />,
        color: "#6366f1",
        route: "/admin/cadastro-veiculos",
      },
      {
        id: "financings",
        title: "Financings",
        count: data.financings.length,
        icon: <CreditCardIcon />,
        color: "#ef4444",
        route: "/admin/cadastro-financiamentos",
      },
      {
        id: "bank-accounts",
        title: "Bank Accounts",
        count: data.bankAccounts.length,
        icon: <HomeIcon />,
        color: "#14b8a6",
        route: "/admin/cadastro-conta-bancaria",
      },
      {
        id: "credit-cards",
        title: "Credit Cards",
        count: data.creditCards.length,
        icon: <WalletIcon />,
        color: "#f97316",
        route: "/admin/cadastro-cartao-credito",
      },
      {
        id: "expense-types",
        title: "Expense Types",
        count: data.expenseTypes.length,
        icon: <FileTextIcon />,
        color: "#84cc16",
        route: "/admin/cadastro-tipo-despesa",
      },
      {
        id: "service-pricing",
        title: "Service Pricing",
        count: data.servicePricing.length,
        icon: <DollarSignIcon />,
        color: "#a855f7",
        route: "/admin/cadastro-preco-servico",
      },
    ],
    [data]
  );

  // Calculate totals
  const totalRecords = useMemo(
    () => stats.reduce((acc, stat) => acc + stat.count, 0),
    [stats]
  );

  const handleStatClick = (route?: string) => {
    if (route) {
      window.location.href = route;
    }
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  const getAlertIcon = (type: "warning" | "info" | "error" | "success") => {
    switch (type) {
      case "warning":
        return <AlertCircleIcon />;
      case "error":
        return <AlertCircleIcon />;
      case "info":
        return <BellIcon />;
      case "success":
        return <CheckCircleIcon />;
      default:
        return <BellIcon />;
    }
  };

  if (loading || alertsLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-text">
            <h1>Dashboard Overview</h1>
            <p>Monitor and manage your business operations</p>
          </div>
          <button className="refresh-button" onClick={handleRefresh}>
            <RefreshCwIcon />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-summary">
        <div className="summary-card summary-card-primary">
          <div className="summary-card-icon">
            <TrendingUpIcon />
          </div>
          <div className="summary-card-content">
            <h3>Total Records</h3>
            <p className="summary-card-value">{totalRecords}</p>
            <span className="summary-card-label">Across all categories</span>
          </div>
        </div>

        <div className="summary-card summary-card-success">
          <div className="summary-card-icon">
            <CheckCircleIcon />
          </div>
          <div className="summary-card-content">
            <h3>Active Services</h3>
            <p className="summary-card-value">{data.contractServices.length}</p>
            <span className="summary-card-label">Currently running</span>
          </div>
        </div>

        <div className="summary-card summary-card-warning">
          <div className="summary-card-icon">
            <ClockIcon />
          </div>
          <div className="summary-card-content">
            <h3>Pending Alerts</h3>
            <p className="summary-card-value">
              {
                recentAlerts.filter(
                  (a) => a.type === "warning" || a.type === "error"
                ).length
              }
            </p>
            <span className="summary-card-label">Require attention</span>
          </div>
        </div>

        <div className="summary-card summary-card-info">
          <div className="summary-card-icon">
            <UsersIcon />
          </div>
          <div className="summary-card-content">
            <h3>Team Members</h3>
            <p className="summary-card-value">
              {data.employees.length + data.users.length}
            </p>
            <span className="summary-card-label">Users & Employees</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Statistics Grid */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>System Statistics</h2>
            <p>Real-time data from your database</p>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="stat-card"
                onClick={() => handleStatClick(stat.route)}
                style={{ cursor: stat.route ? "pointer" : "default" }}
              >
                <div className="stat-card-header">
                  <div
                    className="stat-card-icon"
                    style={{ background: `${stat.color}15`, color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  {stat.trend && (
                    <div
                      className={`stat-trend ${
                        stat.trend.isPositive ? "positive" : "negative"
                      }`}
                    >
                      {stat.trend.isPositive ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                      <span>{stat.trend.value}%</span>
                    </div>
                  )}
                </div>
                <div className="stat-card-content">
                  <h3>{stat.title}</h3>
                  <p className="stat-count" style={{ color: stat.color }}>
                    {stat.count}
                  </p>
                  <span className="stat-label">Registered</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Alerts</h2>
            <p>Latest notifications and system alerts</p>
          </div>

          <div className="alerts-container">
            {recentAlerts.length === 0 ? (
              <div className="no-alerts-message">
                <CheckCircleIcon />
                <p>No recent alerts. Everything is running smoothly!</p>
              </div>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`alert-card alert-${alert.type}`}
                >
                  <div className="alert-icon">{getAlertIcon(alert.type)}</div>
                  <div className="alert-content">
                    <div className="alert-header">
                      <h4>{alert.title}</h4>
                      <span className="alert-time">{alert.time}</span>
                    </div>
                    <p>{alert.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="alerts-footer">
            <button
              className="view-all-button"
              onClick={() => goTo("/admin/avisos")}
            >
              View All Alerts
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
            <p>Frequently used operations</p>
          </div>

          <div className="quick-actions">
            <button
              className="quick-action-btn"
              onClick={() =>
                (window.location.href = "/admin/cadastro-clientes")
              }
            >
              <UserPlusIcon />
              <span>Add New Client</span>
            </button>
            <button
              className="quick-action-btn"
              onClick={() =>
                (window.location.href = "/admin/cadastro-servicos-contratados")
              }
            >
              <FileTextIcon />
              <span>New Service Contract</span>
            </button>
            <button
              className="quick-action-btn"
              onClick={() =>
                (window.location.href = "/admin/cadastro-funcionario")
              }
            >
              <UserPlusIcon />
              <span>Add Employee</span>
            </button>
            <button
              className="quick-action-btn"
              onClick={() => (window.location.href = "/admin/relatorios")}
            >
              <FileTextIcon />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
