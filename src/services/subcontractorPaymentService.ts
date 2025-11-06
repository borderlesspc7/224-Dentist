import { db } from "../lib/firebaseconfig";
import { subcontractorService } from "./subcontractorService";
import { contractServiceService } from "./contractServiceService";
import type { Subcontractor } from "../types/subcontractor";
import type { ContractService } from "../types/contractService";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export interface SubcontractorPaymentAlertData {
  id: string;
  subcontractorId: string;
  subcontractor: Subcontractor;
  contractServiceId: string;
  lastServiceDate: string;
  nextPaymentDate: string;
  amountDue: number;
  currency: string;
  status: "pending" | "overdue" | "due-today" | "paid";
  priority: "low" | "medium" | "high";
  description: string;
  responsiblePerson: string;
  lastUpdate: string;
  serviceDescription?: string;
  projectReference?: string;
}

const SUBCONTRACTOR_PAYMENT_COLLECTION = "subcontractorPayments";

// Calcular data de pagamento baseado na data de término do serviço + termos de pagamento
const calculatePaymentDate = (
  endDate: string,
  paymentTerms: "7" | "15" | "30"
): string => {
  const end = new Date(endDate);
  const termsDays = parseInt(paymentTerms);
  end.setDate(end.getDate() + termsDays);
  return end.toISOString().split("T")[0];
};

// Calcular status baseado na data de pagamento
const calculateStatus = (
  paymentDate: string,
  isPaid: boolean = false
): "pending" | "overdue" | "due-today" | "paid" => {
  if (isPaid) {
    return "paid";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const payment = new Date(paymentDate);
  payment.setHours(0, 0, 0, 0);
  
  const diffTime = payment.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "overdue";
  } else if (diffDays === 0) {
    return "due-today";
  } else {
    return "pending";
  }
};

// Calcular prioridade baseado na proximidade da data de pagamento
const calculatePriority = (
  paymentDate: string,
  status: "pending" | "overdue" | "due-today" | "paid"
): "low" | "medium" | "high" => {
  if (status === "paid") {
    return "low";
  }

  if (status === "overdue" || status === "due-today") {
    return "high";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const payment = new Date(paymentDate);
  payment.setHours(0, 0, 0, 0);
  
  const diffTime = payment.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 3) {
    return "high";
  } else if (diffDays <= 7) {
    return "medium";
  } else {
    return "low";
  }
};

// Verificar se o pagamento foi marcado como pago
const checkPaymentStatus = async (
  alertId: string
): Promise<boolean> => {
  try {
    const paymentRef = doc(db, SUBCONTRACTOR_PAYMENT_COLLECTION, alertId);
    const paymentSnap = await getDoc(paymentRef);
    if (paymentSnap.exists()) {
      return paymentSnap.data().isPaid === true;
    }
    return false;
  } catch (error) {
    console.error("Error checking payment status:", error);
    return false;
  }
};

export const subcontractorPaymentService = {
  // Marcar pagamento como pago
  async markPaymentAsPaid(alertId: string): Promise<void> {
    try {
      const paymentRef = doc(db, SUBCONTRACTOR_PAYMENT_COLLECTION, alertId);
      await setDoc(
        paymentRef,
        {
          isPaid: true,
          paidDate: new Date().toISOString().split("T")[0],
          updatedAt: new Date(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error marking payment as paid:", error);
      throw error;
    }
  },

  // Buscar todos os alertas de pagamento de subcontratados
  async getAllSubcontractorPaymentAlerts(): Promise<SubcontractorPaymentAlertData[]> {
    try {
      // Buscar todos os serviços contratados
      const contractServices = await contractServiceService.getAllContractServices();
      
      // Buscar todos os subcontratados
      const subcontractors = await subcontractorService.getAllSubcontractors();
      
      // Criar mapa de subcontratados por ID
      const subcontractorMap = new Map<string, Subcontractor>();
      subcontractors.forEach((sub) => {
        if (sub.id) {
          subcontractorMap.set(sub.id, sub);
        }
      });

      const alerts: SubcontractorPaymentAlertData[] = [];

      // Filtrar apenas serviços contratados que têm subcontratado
      const servicesWithSubcontractors = contractServices.filter(
        (service) => service.subcontractorId && service.status !== "cancelled"
      );

      for (const service of servicesWithSubcontractors) {
        if (!service.subcontractorId) continue;

        const subcontractor = subcontractorMap.get(service.subcontractorId);
        if (!subcontractor) continue;

        // Criar ID único para o alerta (baseado no serviço contratado e subcontratado)
        const alertId = `${service.id}_${service.subcontractorId}`;

        // Verificar se o pagamento já foi marcado como pago
        const isPaid = await checkPaymentStatus(alertId);

        // Calcular data de pagamento
        const nextPaymentDate = calculatePaymentDate(
          service.endDate,
          subcontractor.paymentTerms
        );

        // Calcular valor devido (usar actualCost se disponível, senão estimatedCost)
        const amountDue = service.budget.actualCost || service.budget.estimatedCost || 0;

        // Calcular status e prioridade
        const status = calculateStatus(nextPaymentDate, isPaid);
        const priority = calculatePriority(nextPaymentDate, status);

        // Data da última atualização
        const lastUpdate = service.updatedAt
          ? service.updatedAt.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];

        // Data do último serviço (usar endDate ou updatedAt)
        const lastServiceDate = service.endDate || lastUpdate;

        // Determinar responsável (por enquanto "N/A", pode ser melhorado)
        const responsiblePerson = "N/A";

        alerts.push({
          id: alertId,
          subcontractorId: service.subcontractorId,
          subcontractor,
          contractServiceId: service.id || "",
          lastServiceDate,
          nextPaymentDate,
          amountDue,
          currency: service.budget.currency,
          status,
          priority,
          description: service.description,
          responsiblePerson,
          lastUpdate,
          serviceDescription: service.description,
          projectReference: service.projectNumber,
        });
      }

      return alerts;
    } catch (error) {
      console.error("Error fetching subcontractor payment alerts:", error);
      throw error;
    }
  },

  // Buscar alertas de pagamento de um subcontratado específico
  async getPaymentAlertsBySubcontractor(
    subcontractorId: string
  ): Promise<SubcontractorPaymentAlertData[]> {
    const allAlerts = await this.getAllSubcontractorPaymentAlerts();
    return allAlerts.filter((alert) => alert.subcontractorId === subcontractorId);
  },
};
