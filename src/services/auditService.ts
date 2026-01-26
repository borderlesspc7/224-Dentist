import { db } from "../lib/firebaseconfig";
import type { AuditLog, AuditFilters, AuditStats } from "../types/audit";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export const auditService = {
  /**
   * Busca todos os registros de auditoria com filtros opcionais
   */
  async getAuditLogs(
    filters?: AuditFilters,
    pageSize: number = 50,
    lastDoc?: QueryDocumentSnapshot
  ): Promise<{ logs: AuditLog[]; lastDoc?: QueryDocumentSnapshot }> {
    try {
      const auditRef = collection(db, "audit_logs");
      let q = query(auditRef, orderBy("timestamp", "desc"));

      // Aplicar filtros
      if (filters?.userId) {
        q = query(q, where("userId", "==", filters.userId));
      }
      if (filters?.action) {
        q = query(q, where("action", "==", filters.action));
      }
      if (filters?.entityType) {
        q = query(q, where("entityType", "==", filters.entityType));
      }
      if (filters?.severity) {
        q = query(q, where("severity", "==", filters.severity));
      }
      if (filters?.startDate) {
        q = query(q, where("timestamp", ">=", Timestamp.fromDate(filters.startDate)));
      }
      if (filters?.endDate) {
        q = query(q, where("timestamp", "<=", Timestamp.fromDate(filters.endDate)));
      }

      // Paginação
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      q = query(q, limit(pageSize));

      const snapshot = await getDocs(q);
      const logs: AuditLog[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId || "",
          userEmail: data.userEmail || "",
          userName: data.userName || "",
          action: data.action || "other",
          entityType: data.entityType || "other",
          entityId: data.entityId,
          entityName: data.entityName,
          description: data.description || "",
          severity: data.severity || "low",
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          metadata: data.metadata || {},
          timestamp: data.timestamp?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });

      const newLastDoc =
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : undefined;

      return { logs, lastDoc: newLastDoc };
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      throw error;
    }
  },

  /**
   * Busca estatísticas de auditoria
   */
  async getAuditStats(filters?: AuditFilters): Promise<AuditStats> {
    try {
      const { logs } = await this.getAuditLogs(filters, 1000);

      const stats: AuditStats = {
        totalLogs: logs.length,
        logsByAction: {} as Record<string, number>,
        logsByEntity: {} as Record<string, number>,
        logsBySeverity: {} as Record<string, number>,
        recentActivity: 0,
        criticalEvents: 0,
      };

      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      logs.forEach((log) => {
        // Contar por ação
        stats.logsByAction[log.action] =
          (stats.logsByAction[log.action] || 0) + 1;

        // Contar por entidade
        stats.logsByEntity[log.entityType] =
          (stats.logsByEntity[log.entityType] || 0) + 1;

        // Contar por severidade
        stats.logsBySeverity[log.severity] =
          (stats.logsBySeverity[log.severity] || 0) + 1;

        // Atividade recente (últimas 24h)
        if (log.timestamp >= last24Hours) {
          stats.recentActivity++;
        }

        // Eventos críticos
        if (log.severity === "critical") {
          stats.criticalEvents++;
        }
      });

      return stats;
    } catch (error) {
      console.error("Error fetching audit stats:", error);
      throw error;
    }
  },

  /**
   * Cria um novo registro de auditoria
   * Nota: Em produção, isso deve ser feito no backend para garantir segurança
   */
  async createAuditLog(log: Omit<AuditLog, "id" | "createdAt">): Promise<void> {
    try {
      const auditRef = collection(db, "audit_logs");
      await auditRef.add({
        ...log,
        timestamp: Timestamp.fromDate(log.timestamp),
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error creating audit log:", error);
      throw error;
    }
  },

  /**
   * Busca logs de um usuário específico
   */
  async getUserAuditLogs(
    userId: string,
    limitCount: number = 100
  ): Promise<AuditLog[]> {
    try {
      const { logs } = await this.getAuditLogs({ userId }, limitCount);
      return logs;
    } catch (error) {
      console.error("Error fetching user audit logs:", error);
      throw error;
    }
  },

  /**
   * Busca logs de uma entidade específica
   */
  async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    limitCount: number = 100
  ): Promise<AuditLog[]> {
    try {
      const auditRef = collection(db, "audit_logs");
      let q = query(
        auditRef,
        where("entityType", "==", entityType),
        where("entityId", "==", entityId),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId || "",
          userEmail: data.userEmail || "",
          userName: data.userName || "",
          action: data.action || "other",
          entityType: data.entityType || "other",
          entityId: data.entityId,
          entityName: data.entityName,
          description: data.description || "",
          severity: data.severity || "low",
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          metadata: data.metadata || {},
          timestamp: data.timestamp?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      console.error("Error fetching entity audit logs:", error);
      throw error;
    }
  },
};
