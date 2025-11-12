import { useState } from "react";
import { clientService } from "../services/clientService";
import { contractServiceService } from "../services/contractServiceService";
import { vehicleService } from "../services/vehicleService";
import { employeeService } from "../services/employeeService";
import { clientPaymentService } from "../services/clientPaymentService";
import { subcontractorPaymentService } from "../services/subcontractorPaymentService";
import { contractedServicePaymentService } from "../services/contractedServicePaymentService";
import { projectService } from "../services/projectService";
import { expenseTypeService } from "../services/expenseTypeService";
import type { ContractService } from "../types/contractService";

export interface ReportData {
  columns: string[];
  rows: (string | number)[][];
}

interface UseReportsDataReturn {
  loading: boolean;
  error: string | null;
  generateReportData: (
    reportId: string,
    startDate?: Date,
    endDate?: Date
  ) => Promise<ReportData>;
  getReportMetrics: (
    reportId: string,
    startDate?: Date,
    endDate?: Date
  ) => Promise<{ label: string; value: string }[]>;
}

// Formatar valor monetário
const formatCurrency = (value: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Filtrar por período
const filterByPeriod = (
  date: Date | string,
  startDate?: Date,
  endDate?: Date
): boolean => {
  if (!startDate || !endDate) return true;

  const itemDate = typeof date === "string" ? new Date(date) : date;
  itemDate.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return itemDate >= startDate && itemDate <= endDate;
};

export const useReportsData = (): UseReportsDataReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReportData = async (
    reportId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ReportData> => {
    try {
      setLoading(true);
      setError(null);

      switch (reportId) {
        case "client-payments": {
          const alerts = await clientPaymentService.getAllClientPaymentAlerts();
          const filteredAlerts = alerts.filter((alert) =>
            filterByPeriod(alert.dueDate, startDate, endDate)
          );

          return {
            columns: [
              "Client Name",
              "Invoice Number",
              "Amount",
              "Due Date",
              "Status",
              "Payment Date",
            ],
            rows: filteredAlerts.map((alert) => [
              alert.clientName,
              alert.invoiceNumber,
              formatCurrency(alert.amount, "USD"),
              alert.dueDate,
              alert.status.charAt(0).toUpperCase() + alert.status.slice(1),
              alert.status === "paid" ? alert.dueDate : "-",
            ]),
          };
        }

        case "subcontractor-payments": {
          const subcontractorAlerts =
            await subcontractorPaymentService.getAllSubcontractorPaymentAlerts();
          const filteredAlerts = subcontractorAlerts.filter((alert) =>
            filterByPeriod(alert.nextPaymentDate, startDate, endDate)
          );

          return {
            columns: [
              "Company Name",
              "Contact Person",
              "Service",
              "Amount Due",
              "Payment Date",
              "Status",
            ],
            rows: filteredAlerts.map((alert) => [
              alert.subcontractor.companyName || "N/A",
              alert.subcontractor.contactPerson || "N/A",
              alert.serviceDescription || "N/A",
              formatCurrency(alert.amountDue, alert.currency),
              alert.nextPaymentDate,
              alert.status === "paid"
                ? "Paid"
                : alert.status === "overdue"
                ? "Overdue"
                : alert.status === "due-today"
                ? "Due Today"
                : "Pending",
            ]),
          };
        }

        case "project-costs": {
          const contractServices =
            await contractServiceService.getAllContractServices();
          const clients = await clientService.getAllClients();

          const clientMap = new Map(clients.map((c) => [c.id || "", c]));

          const filteredServices = contractServices.filter((service) => {
            if (!service.startDate) return false;
            return filterByPeriod(service.startDate, startDate, endDate);
          });

          return {
            columns: [
              "Project Name",
              "Client",
              "Budget",
              "Spent",
              "Remaining",
              "Status",
            ],
            rows: filteredServices.map((service) => {
              const client = service.clientId
                ? clientMap.get(service.clientId)
                : null;
              const budget = service.budget.estimatedCost || 0;
              const spent = service.budget.actualCost || 0;
              const remaining = budget - spent;

              return [
                service.serviceName,
                client?.name || service.clientName || "N/A",
                formatCurrency(budget, service.budget.currency),
                formatCurrency(spent, service.budget.currency),
                formatCurrency(remaining, service.budget.currency),
                service.status === "completed"
                  ? "Completed"
                  : service.status === "in_progress"
                  ? "In Progress"
                  : service.status === "cancelled"
                  ? "Cancelled"
                  : "Pending",
              ];
            }),
          };
        }

        case "vehicle-maintenance": {
          const vehicles = await vehicleService.getAllVehicles();
          const filteredVehicles = vehicles.filter((vehicle) => {
            if (!vehicle.nextMaintenanceDate) return false;
            return filterByPeriod(
              vehicle.nextMaintenanceDate,
              startDate,
              endDate
            );
          });

          return {
            columns: [
              "Vehicle",
              "License Plate",
              "Last Maintenance",
              "Next Maintenance",
              "Type",
              "Status",
            ],
            rows: filteredVehicles.map((vehicle) => [
              `${vehicle.make} ${vehicle.model}`,
              vehicle.licensePlate,
              vehicle.lastMaintenanceDate || "N/A",
              vehicle.nextMaintenanceDate || "N/A",
              vehicle.maintenanceSchedule
                ? vehicle.maintenanceSchedule.charAt(0).toUpperCase() +
                  vehicle.maintenanceSchedule.slice(1)
                : "N/A",
              vehicle.status === "active"
                ? "Active"
                : vehicle.status === "maintenance"
                ? "Maintenance"
                : vehicle.status === "retired"
                ? "Retired"
                : "Sold",
            ]),
          };
        }

        case "contracted-services": {
          const contractServices =
            await contractServiceService.getAllContractServices();
          const clients = await clientService.getAllClients();

          const clientMap = new Map(clients.map((c) => [c.id || "", c]));

          const filteredServices = contractServices.filter((service) => {
            if (!service.startDate) return false;
            return filterByPeriod(service.startDate, startDate, endDate);
          });

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
            rows: filteredServices.map((service) => {
              const client = service.clientId
                ? clientMap.get(service.clientId)
                : null;

              return [
                service.serviceName,
                client?.name || service.clientName || "N/A",
                service.startDate,
                service.endDate,
                service.status === "completed"
                  ? "Completed"
                  : service.status === "in_progress"
                  ? "In Progress"
                  : service.status === "cancelled"
                  ? "Cancelled"
                  : "Pending",
                formatCurrency(
                  service.budget.estimatedCost || 0,
                  service.budget.currency
                ),
                formatCurrency(
                  service.budget.actualCost || 0,
                  service.budget.currency
                ),
              ];
            }),
          };
        }

        case "client-overview": {
          const clients = await clientService.getAllClients();
          const contractServices =
            await contractServiceService.getAllContractServices();

          const servicesByClient = new Map<string, ContractService[]>();
          contractServices.forEach((service) => {
            if (service.clientId) {
              const existing = servicesByClient.get(service.clientId) || [];
              existing.push(service);
              servicesByClient.set(service.clientId, existing);
            }
          });

          return {
            columns: [
              "Client Name",
              "Total Projects",
              "Active Projects",
              "Total Revenue",
              "Payment Status",
            ],
            rows: clients.map((client) => {
              const services = servicesByClient.get(client.id || "") || [];
              const activeServices = services.filter(
                (s) => s.status === "in_progress"
              );
              const totalRevenue = services.reduce(
                (sum, s) =>
                  sum + (s.budget.actualCost || s.budget.estimatedCost || 0),
                0
              );

              // Calcular status de pagamento baseado nos alertas
              const paymentStatus = "Good"; // Pode ser melhorado

              return [
                client.name,
                services.length.toString(),
                activeServices.length.toString(),
                formatCurrency(totalRevenue, "USD"),
                paymentStatus,
              ];
            }),
          };
        }

        case "expense-breakdown": {
          const contractServices =
            await contractServiceService.getAllContractServices();

          // Agrupar despesas por tipo (simplificado - pode ser melhorado)
          const expenseMap = new Map<
            string,
            { total: number; count: number }
          >();

          contractServices.forEach((service) => {
            const actualCost = service.budget.actualCost || 0;
            const estimatedCost = service.budget.estimatedCost || 0;
            const cost = actualCost > 0 ? actualCost : estimatedCost;

            // Usar tipo de serviço como categoria (pode ser melhorado)
            const category = service.serviceType || "Other";
            const existing = expenseMap.get(category) || { total: 0, count: 0 };
            expenseMap.set(category, {
              total: existing.total + cost,
              count: existing.count + 1,
            });
          });

          const totalExpenses = Array.from(expenseMap.values()).reduce(
            (sum, item) => sum + item.total,
            0
          );

          return {
            columns: ["Category", "Amount", "Percentage", "Count", "Average"],
            rows: Array.from(expenseMap.entries()).map(([category, data]) => {
              const percentage =
                totalExpenses > 0
                  ? ((data.total / totalExpenses) * 100).toFixed(0)
                  : "0";
              const average =
                data.count > 0
                  ? formatCurrency(data.total / data.count, "USD")
                  : "$0";

              return [
                category,
                formatCurrency(data.total, "USD"),
                `${percentage}%`,
                data.count.toString(),
                average,
              ];
            }),
          };
        }

        case "service-pricing": {
          const contractServices =
            await contractServiceService.getAllContractServices();
          const clients = await clientService.getAllClients();

          const clientMap = new Map(clients.map((c) => [c.id || "", c]));

          return {
            columns: ["Service", "Client", "Price", "Cost", "Margin", "Status"],
            rows: contractServices.map((service) => {
              const client = service.clientId
                ? clientMap.get(service.clientId)
                : null;
              const price = service.budget.estimatedCost || 0;
              const cost = service.budget.actualCost || 0;
              const margin =
                price > 0 ? (((price - cost) / price) * 100).toFixed(0) : "0";

              return [
                service.serviceName,
                client?.name || service.clientName || "N/A",
                formatCurrency(price, service.budget.currency),
                formatCurrency(cost, service.budget.currency),
                `${margin}%`,
                service.status === "completed"
                  ? "Completed"
                  : service.status === "in_progress"
                  ? "Active"
                  : "Pending",
              ];
            }),
          };
        }

        case "alerts-summary": {
          const clientAlerts =
            await clientPaymentService.getAllClientPaymentAlerts();
          const subcontractorAlerts =
            await subcontractorPaymentService.getAllSubcontractorPaymentAlerts();
          const contractedServiceAlerts =
            await contractedServicePaymentService.getAllContractedServicePaymentAlerts();
          const projectAlerts = await projectService.getAllProjectAlerts();

          // Agrupar alertas por tipo e prioridade
          const alertsByType: Record<
            string,
            {
              total: number;
              critical: number;
              high: number;
              medium: number;
              low: number;
            }
          > = {
            "Payment Due": {
              total: 0,
              critical: 0,
              high: 0,
              medium: 0,
              low: 0,
            },
            "Vehicle Maintenance": {
              total: 0,
              critical: 0,
              high: 0,
              medium: 0,
              low: 0,
            },
            "Project Deadline": {
              total: 0,
              critical: 0,
              high: 0,
              medium: 0,
              low: 0,
            },
            "Contract Expiry": {
              total: 0,
              critical: 0,
              high: 0,
              medium: 0,
              low: 0,
            },
          };

          // Contar alertas de pagamento
          [
            ...clientAlerts,
            ...subcontractorAlerts,
            ...contractedServiceAlerts,
          ].forEach((alert) => {
            const type = "Payment Due";
            alertsByType[type].total++;
            if (alert.priority === "high") alertsByType[type].high++;
            else if (alert.priority === "medium") alertsByType[type].medium++;
            else alertsByType[type].low++;
            if (alert.status === "overdue" || alert.status === "due-today") {
              alertsByType[type].critical++;
            }
          });

          // Contar alertas de projetos
          projectAlerts.forEach((alert) => {
            const type = "Project Deadline";
            alertsByType[type].total++;
            if (alert.priority === "high") alertsByType[type].high++;
            else if (alert.priority === "medium") alertsByType[type].medium++;
            else alertsByType[type].low++;
            if (alert.status === "delayed") {
              alertsByType[type].critical++;
            }
          });

          return {
            columns: [
              "Alert Type",
              "Count",
              "Critical",
              "High",
              "Medium",
              "Low",
            ],
            rows: Object.entries(alertsByType).map(([type, data]) => [
              type,
              data.total.toString(),
              data.critical.toString(),
              data.high.toString(),
              data.medium.toString(),
              data.low.toString(),
            ]),
          };
        }

        case "project-completion": {
          const projectAlerts = await projectService.getAllProjectAlerts();
          const filteredProjects = projectAlerts.filter((project) => {
            if (!project.startDate) return false;
            return filterByPeriod(project.startDate, startDate, endDate);
          });

          return {
            columns: [
              "Project",
              "Progress",
              "Start Date",
              "End Date",
              "Days Remaining",
              "Status",
            ],
            rows: filteredProjects.map((project) => {
              const today = new Date();
              const endDate = new Date(project.plannedEndDate);
              const diffTime = endDate.getTime() - today.getTime();
              const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              return [
                project.projectName,
                `${project.actualProgress}%`,
                project.startDate,
                project.plannedEndDate,
                daysRemaining > 0 ? daysRemaining.toString() : "0",
                project.status === "completed"
                  ? "Completed"
                  : project.status === "delayed"
                  ? "Delayed"
                  : project.status === "at-risk"
                  ? "At Risk"
                  : "On Track",
              ];
            }),
          };
        }

        case "cash-flow": {
          // Este relatório requer dados históricos que podem não estar disponíveis
          // Vou criar uma versão simplificada baseada nos serviços contratados
          const contractServices =
            await contractServiceService.getAllContractServices();

          // Agrupar por mês (simplificado)
          const monthlyData = new Map<
            string,
            { income: number; expenses: number }
          >();

          contractServices.forEach((service) => {
            if (!service.startDate) return;

            const date = new Date(service.startDate);
            const monthKey = `${date.toLocaleString("en-US", {
              month: "long",
            })} ${date.getFullYear()}`;

            const existing = monthlyData.get(monthKey) || {
              income: 0,
              expenses: 0,
            };

            const income = service.budget.estimatedCost || 0;
            const expenses = service.budget.actualCost || 0;

            monthlyData.set(monthKey, {
              income: existing.income + income,
              expenses: existing.expenses + expenses,
            });
          });

          const sortedMonths = Array.from(monthlyData.entries()).sort(
            (a, b) => {
              const dateA = new Date(a[0]);
              const dateB = new Date(b[0]);
              return dateB.getTime() - dateA.getTime();
            }
          );

          let balance = 0;
          const rows = sortedMonths.slice(0, 5).map(([month, data]) => {
            const net = data.income - data.expenses;
            balance += net;
            const change = "N/A"; // Pode ser calculado comparando com mês anterior

            return [
              month,
              formatCurrency(data.income, "USD"),
              formatCurrency(data.expenses, "USD"),
              formatCurrency(net, "USD"),
              change,
              formatCurrency(balance, "USD"),
            ];
          });

          return {
            columns: [
              "Month",
              "Income",
              "Expenses",
              "Net",
              "Change",
              "Balance",
            ],
            rows,
          };
        }

        case "employee-hours": {
          const employees = await employeeService.getAllEmployees();

          // Como não temos dados de horas reais, vou criar uma versão simplificada
          return {
            columns: [
              "Employee",
              "Regular Hours",
              "Overtime",
              "Total Hours",
              "Status",
            ],
            rows: employees.map((employee) => [
              employee.name,
              "160", // Placeholder - pode ser melhorado quando houver dados reais
              "0", // Placeholder
              "160", // Placeholder
              "Active", // Placeholder
            ]),
          };
        }

        default:
          return {
            columns: ["Item", "Value", "Status"],
            rows: [["No data available", "N/A", "N/A"]],
          };
      }
    } catch (err) {
      console.error("Error generating report data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate report"
      );
      return {
        columns: ["Error"],
        rows: [["Failed to load data"]],
      };
    } finally {
      setLoading(false);
    }
  };

  const getReportMetrics = async (
    reportId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ label: string; value: string }[]> => {
    try {
      switch (reportId) {
        case "client-payments": {
          const alerts = await clientPaymentService.getAllClientPaymentAlerts();
          const filteredAlerts = alerts.filter((alert) =>
            filterByPeriod(alert.dueDate, startDate, endDate)
          );

          const totalReceived = filteredAlerts
            .filter((a) => a.status === "paid")
            .reduce((sum, a) => sum + a.amount, 0);
          const pending = filteredAlerts
            .filter((a) => a.status === "pending" || a.status === "overdue")
            .reduce((sum, a) => sum + a.amount, 0);

          return [
            { label: "Total Received", value: formatCurrency(totalReceived) },
            { label: "Pending", value: formatCurrency(pending) },
          ];
        }

        case "subcontractor-payments": {
          const alerts =
            await subcontractorPaymentService.getAllSubcontractorPaymentAlerts();
          const filteredAlerts = alerts.filter((alert) =>
            filterByPeriod(alert.nextPaymentDate, startDate, endDate)
          );

          const totalPaid = filteredAlerts
            .filter((a) => a.status === "paid")
            .reduce((sum, a) => sum + a.amountDue, 0);
          const due = filteredAlerts
            .filter((a) => a.status !== "paid")
            .reduce((sum, a) => sum + a.amountDue, 0);

          return [
            { label: "Total Paid", value: formatCurrency(totalPaid) },
            { label: "Due", value: formatCurrency(due) },
          ];
        }

        case "project-costs": {
          const contractServices =
            await contractServiceService.getAllContractServices();
          const filteredServices = contractServices.filter((service) => {
            if (!service.startDate) return false;
            return filterByPeriod(service.startDate, startDate, endDate);
          });

          const totalBudget = filteredServices.reduce(
            (sum, s) => sum + (s.budget.estimatedCost || 0),
            0
          );
          const totalSpent = filteredServices.reduce(
            (sum, s) => sum + (s.budget.actualCost || 0),
            0
          );

          return [
            { label: "Total Budget", value: formatCurrency(totalBudget) },
            { label: "Spent", value: formatCurrency(totalSpent) },
          ];
        }

        case "vehicle-maintenance": {
          const vehicles = await vehicleService.getAllVehicles();
          const activeVehicles = vehicles.filter((v) => v.status === "active");
          const maintenanceDue = vehicles.filter((v) => {
            if (!v.nextMaintenanceDate) return false;
            const nextDate = new Date(v.nextMaintenanceDate);
            const today = new Date();
            return nextDate <= today && v.status === "active";
          });

          return [
            {
              label: "Active Vehicles",
              value: activeVehicles.length.toString(),
            },
            {
              label: "Maintenance Due",
              value: maintenanceDue.length.toString(),
            },
          ];
        }

        case "contracted-services": {
          const contractServices =
            await contractServiceService.getAllContractServices();
          const activeServices = contractServices.filter(
            (s) => s.status === "in_progress"
          );
          const completedServices = contractServices.filter(
            (s) => s.status === "completed"
          );

          return [
            {
              label: "Active Services",
              value: activeServices.length.toString(),
            },
            {
              label: "Completed",
              value: completedServices.length.toString(),
            },
          ];
        }

        case "client-overview": {
          const clients = await clientService.getAllClients();
          const contractServices =
            await contractServiceService.getAllContractServices();
          const activeProjects = contractServices.filter(
            (s) => s.status === "in_progress"
          );

          return [
            { label: "Total Clients", value: clients.length.toString() },
            {
              label: "Active Projects",
              value: activeProjects.length.toString(),
            },
          ];
        }

        case "expense-breakdown": {
          const contractServices =
            await contractServiceService.getAllContractServices();
          const totalExpenses = contractServices.reduce(
            (sum, s) =>
              sum + (s.budget.actualCost || s.budget.estimatedCost || 0),
            0
          );
          const expenseTypes = await expenseTypeService.getAllExpenseTypes();

          return [
            { label: "Total Expenses", value: formatCurrency(totalExpenses) },
            { label: "Categories", value: expenseTypes.length.toString() },
          ];
        }

        case "service-pricing": {
          const contractServices =
            await contractServiceService.getAllContractServices();
          const totalMargin = contractServices.reduce((sum, s) => {
            const price = s.budget.estimatedCost || 0;
            const cost = s.budget.actualCost || 0;
            return sum + (price > 0 ? ((price - cost) / price) * 100 : 0);
          }, 0);
          const avgMargin =
            contractServices.length > 0
              ? (totalMargin / contractServices.length).toFixed(0)
              : "0";

          return [
            { label: "Services", value: contractServices.length.toString() },
            { label: "Avg. Margin", value: `${avgMargin}%` },
          ];
        }

        case "alerts-summary": {
          const clientAlerts =
            await clientPaymentService.getAllClientPaymentAlerts();
          const subcontractorAlerts =
            await subcontractorPaymentService.getAllSubcontractorPaymentAlerts();
          const contractedServiceAlerts =
            await contractedServicePaymentService.getAllContractedServicePaymentAlerts();
          const projectAlerts = await projectService.getAllProjectAlerts();

          const allAlerts = [
            ...clientAlerts,
            ...subcontractorAlerts,
            ...contractedServiceAlerts,
          ];
          const criticalAlerts = [
            ...allAlerts.filter(
              (a) => a.status === "overdue" || a.status === "due-today"
            ),
            ...projectAlerts.filter((a) => a.status === "delayed"),
          ];

          return [
            {
              label: "Active Alerts",
              value: allAlerts.length.toString(),
            },
            { label: "Critical", value: criticalAlerts.length.toString() },
          ];
        }

        case "project-completion": {
          const projectAlerts = await projectService.getAllProjectAlerts();
          const onSchedule = projectAlerts.filter(
            (p) => p.status === "on-track"
          );
          const delayed = projectAlerts.filter((p) => p.status === "delayed");

          return [
            { label: "On Schedule", value: onSchedule.length.toString() },
            { label: "Delayed", value: delayed.length.toString() },
          ];
        }

        case "cash-flow": {
          const contractServices =
            await contractServiceService.getAllContractServices();
          const totalIncome = contractServices.reduce(
            (sum, s) => sum + (s.budget.estimatedCost || 0),
            0
          );
          const totalExpenses = contractServices.reduce(
            (sum, s) => sum + (s.budget.actualCost || 0),
            0
          );
          const netIncome = totalIncome - totalExpenses;

          return [
            { label: "Net Income", value: formatCurrency(netIncome) },
            { label: "Change", value: "N/A" },
          ];
        }

        case "employee-hours": {
          const employees = await employeeService.getAllEmployees();
          // Placeholder - pode ser melhorado quando houver dados reais de horas
          return [
            { label: "Total Hours", value: "N/A" },
            { label: "Employees", value: employees.length.toString() },
          ];
        }

        default:
          return [];
      }
    } catch (err) {
      console.error("Error getting report metrics:", err);
      return [];
    }
  };

  return {
    loading,
    error,
    generateReportData,
    getReportMetrics,
  };
};
