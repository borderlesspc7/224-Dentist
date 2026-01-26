import React, { useState, useEffect, useMemo } from "react";
import "./Audit.css";
import {
  HistoryIcon,
  FilterIcon,
  SearchIcon,
  DownloadIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  UserIcon,
  CalendarIcon,
  ActivityIcon,
  ShieldIcon,
  FileTextIcon,
  TrashIcon,
  EditIcon,
  PlusIcon,
  LogInIcon,
  LogOutIcon,
  EyeIcon,
} from "lucide-react";
import { auditService } from "../../../services/auditService";
import type {
  AuditLog,
  AuditFilters,
  AuditActionType,
  AuditEntityType,
  AuditSeverity,
} from "../../../types/audit";
const Audit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "7" | "30" | "90" | "all" | "custom"
  >("30");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<AuditActionType | "all">(
    "all"
  );
  const [selectedEntity, setSelectedEntity] = useState<
    AuditEntityType | "all"
  >("all");
  const [selectedSeverity, setSelectedSeverity] = useState<
    AuditSeverity | "all"
  >("all");
  const [stats, setStats] = useState<{
    totalLogs: number;
    logsByAction: Record<string, number>;
    logsByEntity: Record<string, number>;
    logsBySeverity: Record<string, number>;
    recentActivity: number;
    criticalEvents: number;
  } | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Carregar logs de auditoria
  useEffect(() => {
    loadAuditLogs();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, customStartDate, customEndDate, selectedAction, selectedEntity, selectedSeverity]);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const dateFilters = getPeriodDates();
      const finalFilters: AuditFilters = {
        ...dateFilters,
        action: selectedAction !== "all" ? selectedAction : undefined,
        entityType: selectedEntity !== "all" ? selectedEntity : undefined,
        severity: selectedSeverity !== "all" ? selectedSeverity : undefined,
        searchTerm: searchTerm || undefined,
      };

      const { logs: fetchedLogs } = await auditService.getAuditLogs(
        finalFilters,
        100
      );
      setLogs(fetchedLogs || []);
    } catch (error) {
      console.error("Error loading audit logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const dateFilters = getPeriodDates();
      const statsData = await auditService.getAuditStats({
        ...dateFilters,
      });
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
      setStats({
        totalLogs: 0,
        logsByAction: {},
        logsByEntity: {},
        logsBySeverity: {},
        recentActivity: 0,
        criticalEvents: 0,
      });
    }
  };

  const getPeriodDates = (): { startDate?: Date; endDate?: Date } => {
    if (selectedPeriod === "all") return {};
    if (selectedPeriod === "custom") {
      if (customStartDate && customEndDate) {
        return {
          startDate: new Date(customStartDate),
          endDate: new Date(customEndDate),
        };
      }
      return {};
    }

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (selectedPeriod === "7") {
      startDate.setDate(endDate.getDate() - 7);
    } else if (selectedPeriod === "30") {
      startDate.setDate(endDate.getDate() - 30);
    } else if (selectedPeriod === "90") {
      startDate.setDate(endDate.getDate() - 90);
    }

    return { startDate, endDate };
  };

  // Filtrar logs localmente por termo de busca
  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;

    const term = searchTerm.toLowerCase();
    return logs.filter(
      (log) =>
        log.description.toLowerCase().includes(term) ||
        log.userName.toLowerCase().includes(term) ||
        log.userEmail.toLowerCase().includes(term) ||
        log.entityName?.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term)
    );
  }, [logs, searchTerm]);

  const getActionIcon = (action: AuditActionType) => {
    switch (action) {
      case "create":
        return <PlusIcon />;
      case "update":
        return <EditIcon />;
      case "delete":
        return <TrashIcon />;
      case "login":
        return <LogInIcon />;
      case "logout":
        return <LogOutIcon />;
      case "view":
        return <EyeIcon />;
      case "permission_change":
        return <ShieldIcon />;
      default:
        return <FileTextIcon />;
    }
  };

  const getSeverityColor = (severity: AuditSeverity) => {
    switch (severity) {
      case "critical":
        return "#ef4444";
      case "high":
        return "#f59e0b";
      case "medium":
        return "#3b82f6";
      case "low":
        return "#10b981";
      default:
        return "#64748b";
    }
  };

  const getSeverityIcon = (severity: AuditSeverity) => {
    switch (severity) {
      case "critical":
        return <XCircleIcon />;
      case "high":
        return <AlertTriangleIcon />;
      case "medium":
        return <InfoIcon />;
      case "low":
        return <CheckCircleIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleExportCSV = () => {
    let csvContent = "Histórico de Auditoria\n\n";
    csvContent +=
      "Data/Hora,Usuário,Email,Ação,Entidade,Descrição,Severidade,IP\n";

    filteredLogs.forEach((log) => {
      csvContent += `${formatDate(log.timestamp)},${log.userName},${
        log.userEmail
      },${log.action},${log.entityType},"${log.description}",${
        log.severity
      },${log.ipAddress || "N/A"}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `auditoria-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleRowExpansion = (logId: string) => {
    setExpandedRow(expandedRow === logId ? null : logId);
  };

  return (
    <div className="audit-page">
      <div className="audit-header">
        <div className="audit-header-content">
          <div className="audit-header-text">
            <h1>
              <HistoryIcon />
              Histórico de Auditoria
            </h1>
            <p>Registro completo de todas as ações realizadas no sistema</p>
          </div>
          <div className="audit-header-actions">
            <button className="refresh-btn" onClick={loadAuditLogs}>
              <RefreshCwIcon />
              Atualizar
            </button>
            <button className="export-btn" onClick={handleExportCSV}>
              <DownloadIcon />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="audit-stats">
          <div className="stat-card stat-primary">
            <div className="stat-icon">
              <ActivityIcon />
            </div>
            <div className="stat-content">
              <h3>Total de Registros</h3>
              <p className="stat-value">{stats.totalLogs}</p>
            </div>
          </div>
          <div className="stat-card stat-success">
            <div className="stat-icon">
              <CheckCircleIcon />
            </div>
            <div className="stat-content">
              <h3>Atividade Recente</h3>
              <p className="stat-value">{stats.recentActivity}</p>
              <span className="stat-label">Últimas 24 horas</span>
            </div>
          </div>
          <div className="stat-card stat-warning">
            <div className="stat-icon">
              <AlertTriangleIcon />
            </div>
            <div className="stat-content">
              <h3>Eventos Críticos</h3>
              <p className="stat-value">{stats.criticalEvents}</p>
              <span className="stat-label">Requerem atenção</span>
            </div>
          </div>
          <div className="stat-card stat-info">
            <div className="stat-icon">
              <UserIcon />
            </div>
            <div className="stat-content">
              <h3>Usuários Ativos</h3>
              <p className="stat-value">
                {new Set(logs.map((l) => l.userId)).size}
              </p>
              <span className="stat-label">No período</span>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="audit-filters">
        <div className="filters-header">
          <FilterIcon />
          <h2>Filtros de Busca</h2>
        </div>

        <div className="filters-content">
          {/* Busca por texto */}
          <div className="filter-group">
            <label>Buscar</label>
            <div className="search-input-wrapper">
              <SearchIcon />
              <input
                type="text"
                placeholder="Buscar por usuário, descrição, entidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Período */}
          <div className="filter-group">
            <label>Período</label>
            <div className="period-buttons">
              <button
                className={selectedPeriod === "7" ? "active" : ""}
                onClick={() => setSelectedPeriod("7")}
              >
                Últimos 7 dias
              </button>
              <button
                className={selectedPeriod === "30" ? "active" : ""}
                onClick={() => setSelectedPeriod("30")}
              >
                Últimos 30 dias
              </button>
              <button
                className={selectedPeriod === "90" ? "active" : ""}
                onClick={() => setSelectedPeriod("90")}
              >
                Últimos 90 dias
              </button>
              <button
                className={selectedPeriod === "all" ? "active" : ""}
                onClick={() => setSelectedPeriod("all")}
              >
                Todos
              </button>
              <button
                className={selectedPeriod === "custom" ? "active" : ""}
                onClick={() => setSelectedPeriod("custom")}
              >
                Personalizado
              </button>
            </div>
          </div>

          {selectedPeriod === "custom" && (
            <div className="custom-date-range">
              <div className="date-input-group">
                <label>Data Inicial</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div className="date-input-group">
                <label>Data Final</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Ação */}
          <div className="filter-group">
            <label>Tipo de Ação</label>
            <select
              value={selectedAction}
              onChange={(e) =>
                setSelectedAction(e.target.value as AuditActionType | "all")
              }
            >
              <option value="all">Todas as ações</option>
              <option value="create">Criar</option>
              <option value="update">Atualizar</option>
              <option value="delete">Excluir</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="view">Visualizar</option>
              <option value="permission_change">Mudança de Permissão</option>
              <option value="export">Exportar</option>
            </select>
          </div>

          {/* Entidade */}
          <div className="filter-group">
            <label>Tipo de Entidade</label>
            <select
              value={selectedEntity}
              onChange={(e) =>
                setSelectedEntity(e.target.value as AuditEntityType | "all")
              }
            >
              <option value="all">Todas as entidades</option>
              <option value="user">Usuário</option>
              <option value="client">Cliente</option>
              <option value="employee">Funcionário</option>
              <option value="service">Serviço</option>
              <option value="vehicle">Veículo</option>
              <option value="subcontractor">Subcontratado</option>
              <option value="contract_service">Serviço Contratado</option>
              <option value="system">Sistema</option>
              <option value="permission">Permissão</option>
            </select>
          </div>

          {/* Severidade */}
          <div className="filter-group">
            <label>Severidade</label>
            <select
              value={selectedSeverity}
              onChange={(e) =>
                setSelectedSeverity(e.target.value as AuditSeverity | "all")
              }
            >
              <option value="all">Todas</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="audit-table-container">
        <div className="table-header">
          <h2>
            <FileTextIcon />
            Registros de Auditoria
          </h2>
          <span className="table-count">
            {filteredLogs.length} registro(s) encontrado(s)
          </span>
        </div>

        {loading ? (
          <div className="table-loading">
            <div className="loading-spinner"></div>
            <p>Carregando registros de auditoria...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="table-empty">
            <HistoryIcon />
            <h3>Nenhum registro encontrado</h3>
            <p>
              Não há registros de auditoria para os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="audit-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Usuário</th>
                  <th>Ação</th>
                  <th>Entidade</th>
                  <th>Descrição</th>
                  <th>Severidade</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr
                      className={`audit-row severity-${log.severity} ${
                        expandedRow === log.id ? "expanded" : ""
                      }`}
                      onClick={() => toggleRowExpansion(log.id)}
                    >
                      <td>
                        <div className="date-cell">
                          <CalendarIcon />
                          {formatDate(log.timestamp)}
                        </div>
                      </td>
                      <td>
                        <div className="user-cell">
                          <UserIcon />
                          <div>
                            <strong>{log.userName}</strong>
                            <span>{log.userEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          className="action-cell"
                          style={{ color: getSeverityColor(log.severity) }}
                        >
                          {getActionIcon(log.action)}
                          <span>{log.action}</span>
                        </div>
                      </td>
                      <td>
                        <span className="entity-badge">{log.entityType}</span>
                      </td>
                      <td>
                        <div className="description-cell">{log.description}</div>
                      </td>
                      <td>
                        <div
                          className="severity-badge"
                          style={{
                            backgroundColor: `${getSeverityColor(log.severity)}20`,
                            color: getSeverityColor(log.severity),
                            borderColor: getSeverityColor(log.severity),
                          }}
                        >
                          {getSeverityIcon(log.severity)}
                          <span>{log.severity}</span>
                        </div>
                      </td>
                      <td>
                        <button className="expand-btn">
                          {expandedRow === log.id ? "Ocultar" : "Ver"}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === log.id && (
                      <tr className="audit-row-details">
                        <td colSpan={7}>
                          <div className="details-content">
                            <div className="details-section">
                              <h4>Informações Adicionais</h4>
                              <div className="details-grid">
                                {log.entityId && (
                                  <div className="detail-item">
                                    <strong>ID da Entidade:</strong>
                                    <span>{log.entityId}</span>
                                  </div>
                                )}
                                {log.entityName && (
                                  <div className="detail-item">
                                    <strong>Nome da Entidade:</strong>
                                    <span>{log.entityName}</span>
                                  </div>
                                )}
                                {log.ipAddress && (
                                  <div className="detail-item">
                                    <strong>Endereço IP:</strong>
                                    <span>{log.ipAddress}</span>
                                  </div>
                                )}
                                {log.userAgent && (
                                  <div className="detail-item">
                                    <strong>User Agent:</strong>
                                    <span>{log.userAgent}</span>
                                  </div>
                                )}
                                {log.metadata &&
                                  Object.keys(log.metadata).length > 0 && (
                                    <div className="detail-item full-width">
                                      <strong>Metadados:</strong>
                                      <pre>
                                        {JSON.stringify(log.metadata, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Audit;
