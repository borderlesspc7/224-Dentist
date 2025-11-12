import React, { useState, useEffect } from "react";
import "./Reports.css";
import {
  BarChart3Icon,
  DollarSignIcon,
  UsersIcon,
  TruckIcon,
  ClipboardListIcon,
  CreditCardIcon,
  TrendingUpIcon,
  CalendarIcon,
  EyeIcon,
  FileTextIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XIcon,
  DownloadIcon,
} from "lucide-react";
import { useReportsData } from "../../../hooks/useReportsData";

interface ReportCard {
  id: string;
  title: string;
  description: string;
  category: "financial" | "operational" | "management";
  icon: React.ReactNode;
  color: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}

interface ReportData {
  columns: string[];
  rows: (string | number)[][];
}

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "7" | "30" | "90" | "custom"
  >("30");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "financial" | "operational" | "management"
  >("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [loadingReportData, setLoadingReportData] = useState(false);

  const { generateReportData, getReportMetrics } = useReportsData();

  // Definir estrutura base dos cards de relatório
  const baseReportCards: Omit<ReportCard, "metrics">[] = [
    {
      id: "client-payments",
      title: "Client Payments Report",
      description:
        "Detailed report of payments received from clients, including overdue and pending amounts",
      category: "financial",
      icon: <DollarSignIcon />,
      color: "#10b981",
    },
    {
      id: "subcontractor-payments",
      title: "Subcontractor Payments",
      description:
        "Payment history and outstanding amounts for all subcontractors",
      category: "financial",
      icon: <CreditCardIcon />,
      color: "#f59e0b",
    },
    {
      id: "project-costs",
      title: "Project Costs Analysis",
      description:
        "Comprehensive breakdown of costs per project including labor, materials, and overhead",
      category: "financial",
      icon: <TrendingUpIcon />,
      color: "#3b82f6",
    },
    {
      id: "vehicle-maintenance",
      title: "Vehicle Maintenance Log",
      description:
        "Complete maintenance history and upcoming service schedules for all vehicles",
      category: "operational",
      icon: <TruckIcon />,
      color: "#8b5cf6",
    },
    {
      id: "contracted-services",
      title: "Contracted Services Status",
      description:
        "Overview of all contracted services with status, deadlines, and payment schedules",
      category: "operational",
      icon: <ClipboardListIcon />,
      color: "#06b6d4",
    },
    {
      id: "client-overview",
      title: "Client Portfolio Overview",
      description:
        "Summary of all clients, active projects, payment history, and satisfaction metrics",
      category: "management",
      icon: <UsersIcon />,
      color: "#ec4899",
    },
    {
      id: "expense-breakdown",
      title: "Expense Breakdown by Type",
      description:
        "Categorized expenses showing distribution across different expense types and categories",
      category: "financial",
      icon: <BarChart3Icon />,
      color: "#ef4444",
    },
    {
      id: "service-pricing",
      title: "Service Pricing Analysis",
      description:
        "Service pricing comparison across clients with profitability and margin analysis",
      category: "financial",
      icon: <FileTextIcon />,
      color: "#14b8a6",
    },
    {
      id: "alerts-summary",
      title: "Alerts & Notifications Summary",
      description:
        "Consolidated view of all active alerts including payments, maintenance, and deadlines",
      category: "management",
      icon: <AlertCircleIcon />,
      color: "#f97316",
    },
    {
      id: "project-completion",
      title: "Project Completion Report",
      description:
        "Track project progress, completion rates, timeline adherence, and resource utilization",
      category: "operational",
      icon: <CheckCircleIcon />,
      color: "#84cc16",
    },
    {
      id: "cash-flow",
      title: "Cash Flow Statement",
      description:
        "Detailed cash flow analysis showing income, expenses, and net cash position over time",
      category: "financial",
      icon: <TrendingUpIcon />,
      color: "#6366f1",
    },
    {
      id: "employee-hours",
      title: "Employee Hours & Payroll",
      description:
        "Employee work hours, overtime, payroll costs, and productivity metrics",
      category: "management",
      icon: <CalendarIcon />,
      color: "#a855f7",
    },
  ];

  // Calcular datas do período selecionado
  const getPeriodDates = (): { startDate?: Date; endDate?: Date } => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    let startDate = new Date();

    if (selectedPeriod === "7") {
      startDate.setDate(endDate.getDate() - 7);
    } else if (selectedPeriod === "30") {
      startDate.setDate(endDate.getDate() - 30);
    } else if (selectedPeriod === "90") {
      startDate.setDate(endDate.getDate() - 90);
    } else if (selectedPeriod === "custom") {
      if (customStartDate && customEndDate) {
        startDate = new Date(customStartDate);
        endDate.setTime(new Date(customEndDate).getTime());
        endDate.setHours(23, 59, 59, 999);
      } else {
        return {};
      }
    }

    startDate.setHours(0, 0, 0, 0);
    return { startDate, endDate };
  };

  // Carregar métricas dos relatórios
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const { startDate, endDate } = getPeriodDates();
        const cardsWithMetrics = await Promise.all(
          baseReportCards.map(async (card) => {
            const metrics = await getReportMetrics(card.id, startDate, endDate);
            return {
              ...card,
              metrics: metrics.length > 0 ? metrics : undefined,
            };
          })
        );
        setReportCards(cardsWithMetrics);
      } catch (err) {
        console.error("Error loading report metrics:", err);
      }
    };

    loadMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, customStartDate, customEndDate]);

  const filteredReports = reportCards.filter((report) => {
    if (selectedCategory === "all") return true;
    return report.category === selectedCategory;
  });

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "7":
        return "Last 7 days";
      case "30":
        return "Last 30 days";
      case "90":
        return "Last 90 days";
      case "custom":
        return customStartDate && customEndDate
          ? `${customStartDate} to ${customEndDate}`
          : "Custom period";
      default:
        return "Last 30 days";
    }
  };

  const handleViewDetails = async (report: ReportCard) => {
    setSelectedReport(report);
    setIsModalOpen(true);
    setReportData(null);
    setLoadingReportData(true);

    try {
      const { startDate, endDate } = getPeriodDates();
      const data = await generateReportData(report.id, startDate, endDate);
      setReportData(data);
    } catch (err) {
      console.error("Error loading report data:", err);
      setReportData({
        columns: ["Error"],
        rows: [["Failed to load report data"]],
      });
    } finally {
      setLoadingReportData(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    setReportData(null);
  };

  const handleExportCSV = () => {
    if (!selectedReport || !reportData) return;

    let csvContent = `${selectedReport.title} - ${getPeriodLabel()}\n\n`;
    csvContent += reportData.columns.join(",") + "\n";
    reportData.rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${selectedReport.id}-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reports">
      <div className="reports-header">
        <h1>Reports & Analytics</h1>
        <p>Generate comprehensive reports and export data for analysis</p>
      </div>

      <div className="reports-filters">
        <div className="filter-section">
          <div className="filter-group">
            <label>Report Period:</label>
            <div className="period-buttons">
              <button
                className={`period-btn ${
                  selectedPeriod === "7" ? "active" : ""
                }`}
                onClick={() => setSelectedPeriod("7")}
              >
                Last 7 days
              </button>
              <button
                className={`period-btn ${
                  selectedPeriod === "30" ? "active" : ""
                }`}
                onClick={() => setSelectedPeriod("30")}
              >
                Last 30 days
              </button>
              <button
                className={`period-btn ${
                  selectedPeriod === "90" ? "active" : ""
                }`}
                onClick={() => setSelectedPeriod("90")}
              >
                Last 90 days
              </button>
              <button
                className={`period-btn ${
                  selectedPeriod === "custom" ? "active" : ""
                }`}
                onClick={() => setSelectedPeriod("custom")}
              >
                Custom
              </button>
            </div>
          </div>

          {selectedPeriod === "custom" && (
            <div className="custom-date-range">
              <div className="date-input-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div className="date-input-group">
                <label>End Date:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="filter-group">
            <label>Category:</label>
            <div className="category-buttons">
              <button
                className={`category-btn ${
                  selectedCategory === "all" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                All Reports
              </button>
              <button
                className={`category-btn ${
                  selectedCategory === "financial" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("financial")}
              >
                Financial
              </button>
              <button
                className={`category-btn ${
                  selectedCategory === "operational" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("operational")}
              >
                Operational
              </button>
              <button
                className={`category-btn ${
                  selectedCategory === "management" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("management")}
              >
                Management
              </button>
            </div>
          </div>
        </div>

        <div className="period-info">
          <CalendarIcon />
          <span>Generating reports for: {getPeriodLabel()}</span>
        </div>
      </div>

      <div className="reports-grid">
        {filteredReports.map((report) => (
          <div key={report.id} className="report-card">
            <div className="report-card-header">
              <div
                className="report-icon"
                style={{ backgroundColor: report.color }}
              >
                {report.icon}
              </div>
              <div className="report-category">
                <span className={`category-badge ${report.category}`}>
                  {report.category}
                </span>
              </div>
            </div>

            <div className="report-card-content">
              <h3>{report.title}</h3>
              <p>{report.description}</p>

              {report.metrics && (
                <div className="report-metrics">
                  {report.metrics.map((metric, index) => (
                    <div key={index} className="metric-item">
                      <span className="metric-label">{metric.label}</span>
                      <span className="metric-value">{metric.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="report-card-footer">
              <button
                className="view-details-btn"
                onClick={() => handleViewDetails(report)}
              >
                <EyeIcon />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="no-reports">
          <FileTextIcon />
          <h3>No reports found</h3>
          <p>Try adjusting your filters to see more reports.</p>
        </div>
      )}

      {/* Report Details Modal */}
      {isModalOpen && selectedReport && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <div
                  className="modal-icon"
                  style={{ backgroundColor: selectedReport.color }}
                >
                  {selectedReport.icon}
                </div>
                <div>
                  <h2>{selectedReport.title}</h2>
                  <p className="modal-subtitle">{getPeriodLabel()}</p>
                </div>
              </div>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <XIcon />
              </button>
            </div>

            <div className="modal-body">
              {loadingReportData ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <p>Carregando dados do relatório...</p>
                </div>
              ) : reportData ? (
                <div className="table-container">
                  <table className="report-table">
                    <thead>
                      <tr>
                        {reportData.columns.map((column, index) => (
                          <th key={index}>{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.rows.length > 0 ? (
                        reportData.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={reportData.columns.length}
                            style={{ textAlign: "center", padding: "2rem" }}
                          >
                            Nenhum dado disponível para o período selecionado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <p>Erro ao carregar dados do relatório</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              {reportData && (
                <button className="modal-btn primary" onClick={handleExportCSV}>
                  <DownloadIcon />
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
