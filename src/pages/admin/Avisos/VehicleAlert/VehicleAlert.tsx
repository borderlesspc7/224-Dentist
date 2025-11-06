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
import { vehicleService } from "../../../../services/vehicleService";
import type { Vehicle } from "../../../../types/vehicle";

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

  // Função para calcular prioridade baseada na proximidade da data
  const calculatePriority = (daysUntilDue: number): "low" | "medium" | "high" => {
    if (daysUntilDue < 0) return "high"; // Overdue
    if (daysUntilDue <= 7) return "high"; // Urgente
    if (daysUntilDue <= 30) return "medium"; // Próximo
    return "low"; // Distante
  };

  // Função para calcular status baseado na data
  const calculateStatus = (dueDate: Date): "pending" | "overdue" | "completed" => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    if (due < today) return "overdue";
    return "pending";
  };

  // Função para calcular dias até a data de vencimento
  const daysUntilDue = (dueDate: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Função para gerar alertas a partir dos veículos
  const generateAlertsFromVehicles = (vehicles: Vehicle[]): VehicleAlert[] => {
    const alerts: VehicleAlert[] = [];
    let alertIdCounter = 1;

    vehicles.forEach((vehicle) => {
      if (!vehicle.id) return;

      const vehicleName = `${vehicle.make} ${vehicle.model}`;
      const lastMaintenance = vehicle.lastMaintenanceDate || "";

      // Alert de manutenção
      if (vehicle.nextMaintenanceDate) {
        const maintenanceDate = new Date(vehicle.nextMaintenanceDate);
        const daysUntil = daysUntilDue(maintenanceDate);
        const status = calculateStatus(maintenanceDate);
        const priority = calculatePriority(daysUntil);

        alerts.push({
          id: `maintenance-${vehicle.id}-${alertIdCounter++}`,
          vehicleId: vehicle.id,
          vehicleName,
          licensePlate: vehicle.licensePlate,
          alertType: "date",
          currentValue: 0,
          limitValue: 0,
          dueDate: vehicle.nextMaintenanceDate,
          status,
          priority,
          description: "Manutenção programada",
          lastMaintenance,
          nextMaintenance: vehicle.nextMaintenanceDate,
        });
      }

      // Alert de renovação de placa
      if (vehicle.licensePlateRenewalDate) {
        const renewalDate = new Date(vehicle.licensePlateRenewalDate);
        const daysUntil = daysUntilDue(renewalDate);
        const status = calculateStatus(renewalDate);
        const priority = calculatePriority(daysUntil);

        alerts.push({
          id: `plate-${vehicle.id}-${alertIdCounter++}`,
          vehicleId: vehicle.id,
          vehicleName,
          licensePlate: vehicle.licensePlate,
          alertType: "date",
          currentValue: 0,
          limitValue: 0,
          dueDate: vehicle.licensePlateRenewalDate,
          status,
          priority,
          description: "Renovação de placa",
          lastMaintenance,
          nextMaintenance: vehicle.nextMaintenanceDate || "",
        });
      }

      // Alert de renovação DOT
      if (vehicle.dotRenewalDate) {
        const renewalDate = new Date(vehicle.dotRenewalDate);
        const daysUntil = daysUntilDue(renewalDate);
        const status = calculateStatus(renewalDate);
        const priority = calculatePriority(daysUntil);

        alerts.push({
          id: `dot-${vehicle.id}-${alertIdCounter++}`,
          vehicleId: vehicle.id,
          vehicleName,
          licensePlate: vehicle.licensePlate,
          alertType: "date",
          currentValue: 0,
          limitValue: 0,
          dueDate: vehicle.dotRenewalDate,
          status,
          priority,
          description: "Renovação DOT",
          lastMaintenance,
          nextMaintenance: vehicle.nextMaintenanceDate || "",
        });
      }

      // Alert de expiração do seguro
      if (vehicle.insuranceExpiry) {
        const expiryDate = new Date(vehicle.insuranceExpiry);
        const daysUntil = daysUntilDue(expiryDate);
        const status = calculateStatus(expiryDate);
        const priority = calculatePriority(daysUntil);

        alerts.push({
          id: `insurance-${vehicle.id}-${alertIdCounter++}`,
          vehicleId: vehicle.id,
          vehicleName,
          licensePlate: vehicle.licensePlate,
          alertType: "date",
          currentValue: 0,
          limitValue: 0,
          dueDate: vehicle.insuranceExpiry,
          status,
          priority,
          description: "Expiração do seguro",
          lastMaintenance,
          nextMaintenance: vehicle.nextMaintenanceDate || "",
        });
      }

      // Alert de expiração do registro
      if (vehicle.registrationExpiry) {
        const expiryDate = new Date(vehicle.registrationExpiry);
        const daysUntil = daysUntilDue(expiryDate);
        const status = calculateStatus(expiryDate);
        const priority = calculatePriority(daysUntil);

        alerts.push({
          id: `registration-${vehicle.id}-${alertIdCounter++}`,
          vehicleId: vehicle.id,
          vehicleName,
          licensePlate: vehicle.licensePlate,
          alertType: "date",
          currentValue: 0,
          limitValue: 0,
          dueDate: vehicle.registrationExpiry,
          status,
          priority,
          description: "Expiração do registro",
          lastMaintenance,
          nextMaintenance: vehicle.nextMaintenanceDate || "",
        });
      }
    });

    return alerts;
  };

  // Buscar dados reais dos veículos
  useEffect(() => {
    const fetchVehicleAlerts = async () => {
      try {
        setLoading(true);
        const vehicles = await vehicleService.getAllVehicles();
        const vehicleAlerts = generateAlertsFromVehicles(vehicles);
        setAlerts(vehicleAlerts);
        setFilteredAlerts(vehicleAlerts);
      } catch (error) {
        console.error("Erro ao buscar alertas de veículos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleAlerts();
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

  const handleMarkAsCompleted = async (alertId: string) => {
    try {
      const alert = alerts.find((a) => a.id === alertId);
      if (!alert || !alert.vehicleId) return;

      // Dependendo do tipo de alerta, atualizamos o veículo correspondente
      if (alert.id.startsWith("maintenance-")) {
        // Atualiza a data da última manutenção para hoje
        const today = new Date().toISOString().split("T")[0];
        await vehicleService.updateVehicle(alert.vehicleId, {
          lastMaintenanceDate: today,
        });
      } else if (alert.id.startsWith("plate-")) {
        // Poderia adicionar uma lógica para atualizar a data de renovação
        // Por enquanto, apenas removemos o alerta da lista
      } else if (alert.id.startsWith("dot-")) {
        // Poderia adicionar uma lógica para atualizar a data de renovação DOT
      } else if (alert.id.startsWith("insurance-")) {
        // Poderia adicionar uma lógica para atualizar o seguro
      } else if (alert.id.startsWith("registration-")) {
        // Poderia adicionar uma lógica para atualizar o registro
      }

      // Remove o alerta da lista
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      setFilteredAlerts((prev) => prev.filter((a) => a.id !== alertId));

      // Recarrega os alertas para atualizar a lista
      const vehicles = await vehicleService.getAllVehicles();
      const vehicleAlerts = generateAlertsFromVehicles(vehicles);
      setAlerts(vehicleAlerts);
    } catch (error) {
      console.error("Erro ao marcar alerta como concluído:", error);
    }
  };

  const handleViewDetails = (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (alert && alert.vehicleId) {
      // Navegar para detalhes do veículo quando a rota estiver disponível
      // Por enquanto, apenas log
      console.log("View details for vehicle:", alert.vehicleId);
      // navigate(`/admin/vehicles/${alert.vehicleId}`);
    }
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
