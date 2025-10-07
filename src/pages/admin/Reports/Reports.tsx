import React, { useState } from "react";
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

  const reportCards: ReportCard[] = [
    {
      id: "client-payments",
      title: "Client Payments Report",
      description:
        "Detailed report of payments received from clients, including overdue and pending amounts",
      category: "financial",
      icon: <DollarSignIcon />,
      color: "#10b981",
      metrics: [
        { label: "Total Received", value: "$45,230" },
        { label: "Pending", value: "$12,500" },
      ],
    },
    {
      id: "subcontractor-payments",
      title: "Subcontractor Payments",
      description:
        "Payment history and outstanding amounts for all subcontractors",
      category: "financial",
      icon: <CreditCardIcon />,
      color: "#f59e0b",
      metrics: [
        { label: "Total Paid", value: "$23,400" },
        { label: "Due", value: "$8,900" },
      ],
    },
    {
      id: "project-costs",
      title: "Project Costs Analysis",
      description:
        "Comprehensive breakdown of costs per project including labor, materials, and overhead",
      category: "financial",
      icon: <TrendingUpIcon />,
      color: "#3b82f6",
      metrics: [
        { label: "Total Budget", value: "$120,000" },
        { label: "Spent", value: "$87,450" },
      ],
    },
    {
      id: "vehicle-maintenance",
      title: "Vehicle Maintenance Log",
      description:
        "Complete maintenance history and upcoming service schedules for all vehicles",
      category: "operational",
      icon: <TruckIcon />,
      color: "#8b5cf6",
      metrics: [
        { label: "Active Vehicles", value: "12" },
        { label: "Maintenance Due", value: "3" },
      ],
    },
    {
      id: "contracted-services",
      title: "Contracted Services Status",
      description:
        "Overview of all contracted services with status, deadlines, and payment schedules",
      category: "operational",
      icon: <ClipboardListIcon />,
      color: "#06b6d4",
      metrics: [
        { label: "Active Services", value: "8" },
        { label: "Completed", value: "15" },
      ],
    },
    {
      id: "client-overview",
      title: "Client Portfolio Overview",
      description:
        "Summary of all clients, active projects, payment history, and satisfaction metrics",
      category: "management",
      icon: <UsersIcon />,
      color: "#ec4899",
      metrics: [
        { label: "Total Clients", value: "34" },
        { label: "Active Projects", value: "12" },
      ],
    },
    {
      id: "expense-breakdown",
      title: "Expense Breakdown by Type",
      description:
        "Categorized expenses showing distribution across different expense types and categories",
      category: "financial",
      icon: <BarChart3Icon />,
      color: "#ef4444",
      metrics: [
        { label: "Total Expenses", value: "$67,890" },
        { label: "Categories", value: "8" },
      ],
    },
    {
      id: "service-pricing",
      title: "Service Pricing Analysis",
      description:
        "Service pricing comparison across clients with profitability and margin analysis",
      category: "financial",
      icon: <FileTextIcon />,
      color: "#14b8a6",
      metrics: [
        { label: "Services", value: "24" },
        { label: "Avg. Margin", value: "32%" },
      ],
    },
    {
      id: "alerts-summary",
      title: "Alerts & Notifications Summary",
      description:
        "Consolidated view of all active alerts including payments, maintenance, and deadlines",
      category: "management",
      icon: <AlertCircleIcon />,
      color: "#f97316",
      metrics: [
        { label: "Active Alerts", value: "18" },
        { label: "Critical", value: "5" },
      ],
    },
    {
      id: "project-completion",
      title: "Project Completion Report",
      description:
        "Track project progress, completion rates, timeline adherence, and resource utilization",
      category: "operational",
      icon: <CheckCircleIcon />,
      color: "#84cc16",
      metrics: [
        { label: "On Schedule", value: "9" },
        { label: "Delayed", value: "3" },
      ],
    },
    {
      id: "cash-flow",
      title: "Cash Flow Statement",
      description:
        "Detailed cash flow analysis showing income, expenses, and net cash position over time",
      category: "financial",
      icon: <TrendingUpIcon />,
      color: "#6366f1",
      metrics: [
        { label: "Net Income", value: "$18,340" },
        { label: "Change", value: "+12%" },
      ],
    },
    {
      id: "employee-hours",
      title: "Employee Hours & Payroll",
      description:
        "Employee work hours, overtime, payroll costs, and productivity metrics",
      category: "management",
      icon: <CalendarIcon />,
      color: "#a855f7",
      metrics: [
        { label: "Total Hours", value: "1,240" },
        { label: "Employees", value: "15" },
      ],
    },
  ];

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

  const generateReportData = (reportId: string): ReportData => {
    switch (reportId) {
      case "client-payments":
        return {
          columns: [
            "Client Name",
            "Invoice Number",
            "Amount",
            "Due Date",
            "Status",
            "Payment Date",
          ],
          rows: [
            [
              "João Silva",
              "INV-2024-001",
              "$2,500",
              "2024-01-15",
              "Overdue",
              "-",
            ],
            [
              "Maria Oliveira",
              "INV-2024-002",
              "$1,500",
              "2024-02-20",
              "Pending",
              "-",
            ],
            [
              "Pedro Santos",
              "INV-2024-003",
              "$3,000",
              "2024-03-10",
              "Paid",
              "2024-03-08",
            ],
            [
              "Ana Costa",
              "INV-2024-004",
              "$4,200",
              "2024-03-15",
              "Paid",
              "2024-03-12",
            ],
            [
              "Carlos Lima",
              "INV-2024-005",
              "$1,800",
              "2024-03-20",
              "Pending",
              "-",
            ],
          ],
        };

      case "subcontractor-payments":
        return {
          columns: [
            "Company Name",
            "Contact Person",
            "Service",
            "Amount Due",
            "Payment Date",
            "Status",
          ],
          rows: [
            [
              "John Doe Services LLC",
              "John Doe",
              "Excavation",
              "$3,200",
              "2024-01-25",
              "Due Today",
            ],
            [
              "Build&Co Inc",
              "Mary Smith",
              "Concrete",
              "$5,800",
              "2024-01-14",
              "Overdue",
            ],
            [
              "RoadWorks LLC",
              "Carlos Lima",
              "Road Repair",
              "$900",
              "2024-01-27",
              "Pending",
            ],
            [
              "Pipeline Masters",
              "Robert Johnson",
              "Pipeline Installation",
              "$12,500",
              "2024-02-01",
              "Pending",
            ],
            [
              "Drainage Experts",
              "Sarah Williams",
              "Drainage Work",
              "$4,300",
              "2024-01-30",
              "Due Today",
            ],
          ],
        };

      case "project-costs":
        return {
          columns: [
            "Project Name",
            "Client",
            "Budget",
            "Spent",
            "Remaining",
            "Status",
          ],
          rows: [
            [
              "Underground Pipeline",
              "City Water Dept",
              "$150,000",
              "$120,000",
              "$30,000",
              "In Progress",
            ],
            [
              "Sewer Maintenance",
              "Metro Utilities",
              "$45,000",
              "$42,000",
              "$3,000",
              "Completed",
            ],
            [
              "Drainage Upgrade",
              "County Public Works",
              "$85,000",
              "$78,000",
              "$7,000",
              "In Progress",
            ],
            [
              "Road Construction",
              "State Highway",
              "$200,000",
              "$145,000",
              "$55,000",
              "In Progress",
            ],
            [
              "Water Treatment",
              "City Infrastructure",
              "$95,000",
              "$95,000",
              "$0",
              "Completed",
            ],
          ],
        };

      case "vehicle-maintenance":
        return {
          columns: [
            "Vehicle",
            "License Plate",
            "Last Maintenance",
            "Next Maintenance",
            "Type",
            "Cost",
          ],
          rows: [
            [
              "Ford F-150",
              "ABC-1234",
              "2024-01-05",
              "2024-04-05",
              "Oil Change",
              "$85",
            ],
            [
              "Chevrolet Silverado",
              "XYZ-5678",
              "2024-01-15",
              "2024-02-15",
              "Tire Rotation",
              "$120",
            ],
            [
              "Toyota Tacoma",
              "DEF-9012",
              "2024-01-20",
              "2024-03-20",
              "Brake Service",
              "$250",
            ],
            [
              "Ram 2500",
              "GHI-3456",
              "2024-01-10",
              "2024-04-10",
              "Oil Change",
              "$95",
            ],
            [
              "GMC Sierra",
              "JKL-7890",
              "2024-01-25",
              "2024-03-25",
              "Inspection",
              "$75",
            ],
          ],
        };

      case "contracted-services":
        return {
          columns: [
            "Service Name",
            "Client",
            "Start Date",
            "End Date",
            "Status",
            "Budget",
            "Spent",
          ],
          rows: [
            [
              "Pipeline Installation",
              "City Water Dept",
              "2024-01-15",
              "2024-06-15",
              "In Progress",
              "$150,000",
              "$120,000",
            ],
            [
              "Sewer Maintenance",
              "Metro Utilities",
              "2024-02-01",
              "2024-03-01",
              "Completed",
              "$45,000",
              "$42,000",
            ],
            [
              "Drainage Upgrade",
              "County Public Works",
              "2024-01-10",
              "2024-04-10",
              "In Progress",
              "$85,000",
              "$78,000",
            ],
            [
              "Water Line Repair",
              "City Services",
              "2024-02-15",
              "2024-05-15",
              "In Progress",
              "$68,000",
              "$45,000",
            ],
            [
              "Road Paving",
              "State Highway",
              "2024-01-20",
              "2024-03-20",
              "Completed",
              "$125,000",
              "$122,000",
            ],
          ],
        };

      case "client-overview":
        return {
          columns: [
            "Client Name",
            "Total Projects",
            "Active Projects",
            "Total Revenue",
            "Payment Status",
          ],
          rows: [
            ["City Water Department", "12", "3", "$450,000", "Good"],
            ["Metro Utilities", "8", "2", "$280,000", "Excellent"],
            ["County Public Works", "15", "5", "$620,000", "Good"],
            ["State Highway Authority", "6", "1", "$195,000", "Fair"],
            ["City Infrastructure", "9", "4", "$340,000", "Good"],
          ],
        };

      case "expense-breakdown":
        return {
          columns: ["Category", "Amount", "Percentage", "Count", "Average"],
          rows: [
            ["Labor", "$34,500", "38%", "156", "$221"],
            ["Materials", "$28,900", "32%", "89", "$325"],
            ["Equipment", "$15,600", "17%", "45", "$347"],
            ["Transportation", "$7,800", "9%", "67", "$116"],
            ["Other", "$3,090", "4%", "28", "$110"],
          ],
        };

      case "service-pricing":
        return {
          columns: ["Service", "Client", "Price", "Cost", "Margin", "Status"],
          rows: [
            [
              "Pipeline Installation",
              "City Water",
              "$12,500",
              "$8,900",
              "29%",
              "Active",
            ],
            [
              "Drainage Work",
              "County Public",
              "$8,200",
              "$5,400",
              "34%",
              "Active",
            ],
            [
              "Road Repair",
              "State Highway",
              "$15,000",
              "$11,200",
              "25%",
              "Active",
            ],
            [
              "Excavation",
              "Metro Utilities",
              "$6,800",
              "$4,500",
              "34%",
              "Active",
            ],
            [
              "Concrete Work",
              "City Services",
              "$9,500",
              "$6,800",
              "28%",
              "Completed",
            ],
          ],
        };

      case "alerts-summary":
        return {
          columns: ["Alert Type", "Count", "Critical", "High", "Medium", "Low"],
          rows: [
            ["Payment Due", "12", "3", "5", "3", "1"],
            ["Vehicle Maintenance", "8", "2", "4", "2", "0"],
            ["Project Deadline", "15", "5", "6", "3", "1"],
            ["Contract Expiry", "6", "1", "2", "2", "1"],
            ["Insurance Renewal", "4", "2", "1", "1", "0"],
          ],
        };

      case "project-completion":
        return {
          columns: [
            "Project",
            "Progress",
            "Start Date",
            "End Date",
            "Days Remaining",
            "Status",
          ],
          rows: [
            [
              "Underground Pipeline",
              "80%",
              "2024-01-15",
              "2024-06-15",
              "45",
              "On Track",
            ],
            [
              "Drainage Upgrade",
              "92%",
              "2024-01-10",
              "2024-04-10",
              "15",
              "On Track",
            ],
            [
              "Road Construction",
              "73%",
              "2024-02-01",
              "2024-07-01",
              "78",
              "At Risk",
            ],
            [
              "Water Treatment",
              "100%",
              "2023-12-01",
              "2024-03-01",
              "0",
              "Completed",
            ],
            ["Sewer Line", "65%", "2024-01-20", "2024-05-20", "52", "Delayed"],
          ],
        };

      case "cash-flow":
        return {
          columns: ["Month", "Income", "Expenses", "Net", "Change", "Balance"],
          rows: [
            [
              "January 2024",
              "$145,000",
              "$98,500",
              "$46,500",
              "+12%",
              "$246,500",
            ],
            [
              "February 2024",
              "$168,000",
              "$112,000",
              "$56,000",
              "+20%",
              "$302,500",
            ],
            [
              "March 2024",
              "$192,000",
              "$125,000",
              "$67,000",
              "+20%",
              "$369,500",
            ],
            [
              "December 2023",
              "$132,000",
              "$95,000",
              "$37,000",
              "+8%",
              "$200,000",
            ],
            [
              "November 2023",
              "$128,000",
              "$94,000",
              "$34,000",
              "+5%",
              "$163,000",
            ],
          ],
        };

      case "employee-hours":
        return {
          columns: [
            "Employee",
            "Regular Hours",
            "Overtime",
            "Total Hours",
            "Hourly Rate",
            "Total Pay",
          ],
          rows: [
            ["John Smith", "160", "12", "172", "$25", "$4,300"],
            ["Maria Garcia", "160", "8", "168", "$28", "$4,704"],
            ["David Johnson", "160", "15", "175", "$30", "$5,475"],
            ["Sarah Williams", "160", "5", "165", "$26", "$4,355"],
            ["Robert Brown", "160", "10", "170", "$27", "$4,725"],
          ],
        };

      default:
        return {
          columns: ["Item", "Value", "Status"],
          rows: [
            ["Sample Data 1", "Value 1", "Active"],
            ["Sample Data 2", "Value 2", "Completed"],
            ["Sample Data 3", "Value 3", "Pending"],
          ],
        };
    }
  };

  const handleViewDetails = (report: ReportCard) => {
    setSelectedReport(report);
    setReportData(generateReportData(report.id));
    setIsModalOpen(true);
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
      {isModalOpen && selectedReport && reportData && (
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
                    {reportData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button className="modal-btn primary" onClick={handleExportCSV}>
                <DownloadIcon />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
