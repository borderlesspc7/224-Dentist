import { useState, useEffect } from "react";
import { clientPaymentService } from "../services/clientPaymentService";
import { subcontractorPaymentService } from "../services/subcontractorPaymentService";
import { contractedServicePaymentService } from "../services/contractedServicePaymentService";
import { projectService } from "../services/projectService";
import { vehicleService } from "../services/vehicleService";

export interface DashboardAlert {
  id: string;
  type: "warning" | "info" | "error" | "success";
  title: string;
  message: string;
  time: string;
  timestamp: Date;
}

export const useDashboardAlerts = () => {
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const dashboardAlerts: DashboardAlert[] = [];

        // Buscar alertas de pagamento de clientes
        const clientAlerts = await clientPaymentService.getAllClientPaymentAlerts();
        const overdueClientAlerts = clientAlerts.filter(
          (alert) => alert.status === "overdue"
        );
        overdueClientAlerts.slice(0, 3).forEach((alert) => {
          const daysOverdue = Math.abs(
            Math.ceil(
              (new Date().getTime() - new Date(alert.dueDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          );
          dashboardAlerts.push({
            id: `client-${alert.id}`,
            type: "warning",
            title: "Payment Overdue",
            message: `Invoice ${alert.invoiceNumber} from ${alert.clientName} is ${daysOverdue} days overdue`,
            time: getRelativeTime(alert.dueDate),
            timestamp: new Date(alert.dueDate),
          });
        });

        // Buscar alertas de pagamento de subcontratados
        const subcontractorAlerts =
          await subcontractorPaymentService.getAllSubcontractorPaymentAlerts();
        const overdueSubAlerts = subcontractorAlerts.filter(
          (alert) => alert.status === "overdue"
        );
        overdueSubAlerts.slice(0, 2).forEach((alert) => {
          dashboardAlerts.push({
            id: `sub-${alert.id}`,
            type: "error",
            title: "Subcontractor Payment Due",
            message: `Payment to ${alert.subcontractor.companyName} is overdue`,
            time: getRelativeTime(alert.nextPaymentDate),
            timestamp: new Date(alert.nextPaymentDate),
          });
        });

        // Buscar alertas de veículos
        const vehicles = await vehicleService.getAllVehicles();
        const vehiclesNeedingMaintenance = vehicles.filter((vehicle) => {
          if (!vehicle.nextMaintenanceDate) return false;
          const nextDate = new Date(vehicle.nextMaintenanceDate);
          const today = new Date();
          const daysUntil = Math.ceil(
            (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysUntil <= 7 && daysUntil >= -7; // Próximos 7 dias ou atrasados até 7 dias
        });

        vehiclesNeedingMaintenance.slice(0, 2).forEach((vehicle) => {
          const nextDate = new Date(vehicle.nextMaintenanceDate!);
          const today = new Date();
          const daysUntil = Math.ceil(
            (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          dashboardAlerts.push({
            id: `vehicle-${vehicle.id}`,
            type: daysUntil < 0 ? "error" : "warning",
            title: "Vehicle Maintenance",
            message: `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate}) ${
              daysUntil < 0
                ? "requires urgent maintenance"
                : `maintenance due in ${daysUntil} days`
            }`,
            time: getRelativeTime(vehicle.nextMaintenanceDate!),
            timestamp: new Date(vehicle.nextMaintenanceDate!),
          });
        });

        // Buscar alertas de projetos
        const projectAlerts = await projectService.getAllProjectAlerts();
        const atRiskProjects = projectAlerts.filter(
          (project) =>
            project.status === "at-risk" || project.status === "delayed"
        );
        atRiskProjects.slice(0, 2).forEach((project) => {
          dashboardAlerts.push({
            id: `project-${project.id}`,
            type: project.status === "delayed" ? "error" : "warning",
            title: "Project Alert",
            message: `${project.projectName} for ${project.clientName} is ${project.status}`,
            time: getRelativeTime(project.lastUpdate),
            timestamp: new Date(project.lastUpdate),
          });
        });

        // Buscar projetos completados recentemente
        const completedProjects = projectAlerts.filter(
          (project) => project.status === "completed"
        );
        completedProjects.slice(0, 2).forEach((project) => {
          dashboardAlerts.push({
            id: `completed-${project.id}`,
            type: "success",
            title: "Project Completed",
            message: `${project.projectName} completed successfully`,
            time: getRelativeTime(project.lastUpdate),
            timestamp: new Date(project.lastUpdate),
          });
        });

        // Buscar alertas de serviços contratados
        const contractedServiceAlerts =
          await contractedServicePaymentService.getAllContractedServicePaymentAlerts();
        const dueTodayServices = contractedServiceAlerts.filter(
          (alert) => alert.status === "due-today"
        );
        dueTodayServices.slice(0, 2).forEach((alert) => {
          dashboardAlerts.push({
            id: `service-${alert.id}`,
            type: "warning",
            title: "Service Payment Due Today",
            message: `Payment for ${alert.contractService.serviceName} is due today`,
            time: "Today",
            timestamp: new Date(alert.nextPaymentDate),
          });
        });

        // Ordenar por timestamp (mais recente primeiro) e limitar a 5 alertas
        const sortedAlerts = dashboardAlerts
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 5);

        setAlerts(sortedAlerts);
      } catch (error) {
        console.error("Error fetching dashboard alerts:", error);
        // Em caso de erro, manter array vazio
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return { alerts, loading, refreshAlerts: () => {} };
};

// Função auxiliar para calcular tempo relativo
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  } else if (diffHours > 0) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffMinutes > 0) {
    return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  } else {
    return "Just now";
  }
}

