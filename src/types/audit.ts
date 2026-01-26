/**
 * Tipos de ações que podem ser registradas no sistema de auditoria
 */
export type AuditActionType =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "permission_change"
  | "access_denied"
  | "export"
  | "view"
  | "other";

/**
 * Categorias de entidades que podem ser auditadas
 */
export type AuditEntityType =
  | "user"
  | "client"
  | "employee"
  | "service"
  | "vehicle"
  | "subcontractor"
  | "contract_service"
  | "financing"
  | "bank_account"
  | "credit_card"
  | "expense_type"
  | "service_pricing"
  | "system"
  | "permission"
  | "other";

/**
 * Níveis de severidade dos eventos de auditoria
 */
export type AuditSeverity = "low" | "medium" | "high" | "critical";

/**
 * Interface para um registro de auditoria
 */
export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: AuditActionType;
  entityType: AuditEntityType;
  entityId?: string;
  entityName?: string;
  description: string;
  severity: AuditSeverity;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
}

/**
 * Filtros para busca de registros de auditoria
 */
export interface AuditFilters {
  userId?: string;
  action?: AuditActionType;
  entityType?: AuditEntityType;
  severity?: AuditSeverity;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}

/**
 * Estatísticas de auditoria
 */
export interface AuditStats {
  totalLogs: number;
  logsByAction: Record<AuditActionType, number>;
  logsByEntity: Record<AuditEntityType, number>;
  logsBySeverity: Record<AuditSeverity, number>;
  recentActivity: number; // Últimas 24 horas
  criticalEvents: number;
}
