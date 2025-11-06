import { db } from "../lib/firebaseconfig";
import { contractServiceService } from "./contractServiceService";
import { clientService } from "./clientService";
import type { ContractService } from "../types/contractService";
import type { Client } from "../types/client";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export interface ContractedServicePaymentAlertData {
  id: string;
  contractServiceId: string;
  contractService: ContractService;
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
  paymentTerms: "7" | "15" | "30" | "45" | "60";
}

const CONTRACTED_SERVICE_PAYMENT_COLLECTION = "contractedServicePayments";

// Calcular data de pagamento baseado na data de término do serviço + termos de pagamento
const calculatePaymentDate = (
  endDate: string,
  paymentTerms: "7" | "15" | "30" | "45" | "60"
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

// Calcular prioridade baseado na proximidade da data de pagamento e valor
const calculatePriority = (
  paymentDate: string,
  status: "pending" | "overdue" | "due-today" | "paid",
  amount: number
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

  // Se está próximo do vencimento (menos de 7 dias) ou valor alto (mais de 5000)
  if (diffDays <= 7 || amount >= 5000) {
    return "high";
  } else if (diffDays <= 30 || amount >= 2000) {
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
    const paymentRef = doc(db, CONTRACTED_SERVICE_PAYMENT_COLLECTION, alertId);
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

// Obter termos de pagamento padrão baseado no valor do serviço
const getDefaultPaymentTerms = (amount: number): "7" | "15" | "30" | "45" | "60" => {
  // Valores maiores geralmente têm termos mais longos
  if (amount >= 100000) {
    return "60";
  } else if (amount >= 50000) {
    return "45";
  } else if (amount >= 20000) {
    return "30";
  } else if (amount >= 5000) {
    return "15";
  } else {
    return "7";
  }
};

export const contractedServicePaymentService = {
  // Marcar pagamento como pago
  async markPaymentAsPaid(alertId: string): Promise<void> {
    try {
      const paymentRef = doc(db, CONTRACTED_SERVICE_PAYMENT_COLLECTION, alertId);
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

  // Buscar todos os alertas de pagamento de serviços contratados
  async getAllContractedServicePaymentAlerts(): Promise<ContractedServicePaymentAlertData[]> {
    try {
      // Buscar todos os serviços contratados
      const contractServices = await contractServiceService.getAllContractServices();
      
      // Buscar todos os clientes para obter informações adicionais
      const clients = await clientService.getAllClients();
      
      // Criar mapa de clientes por ID
      const clientMap = new Map<string, Client>();
      clients.forEach((client) => {
        if (client.id) {
          clientMap.set(client.id, client);
        }
      });

      const alerts: ContractedServicePaymentAlertData[] = [];

      // Filtrar apenas serviços contratados que não estão cancelados
      const activeServices = contractServices.filter(
        (service) => service.status !== "cancelled"
      );

      for (const service of activeServices) {
        if (!service.id) continue;

        // Criar ID único para o alerta (baseado no serviço contratado)
        const alertId = `contracted_service_${service.id}`;

        // Verificar se o pagamento já foi marcado como pago
        const isPaid = await checkPaymentStatus(alertId);

        // Calcular valor devido (usar actualCost se disponível, senão estimatedCost)
        const amountDue = service.budget.actualCost || service.budget.estimatedCost || 0;

        // Obter termos de pagamento (padrão baseado no valor)
        const paymentTerms = getDefaultPaymentTerms(amountDue);

        // Calcular data de pagamento baseado na data de término do serviço
        const nextPaymentDate = calculatePaymentDate(
          service.endDate,
          paymentTerms
        );

        // Calcular status e prioridade
        const status = calculateStatus(nextPaymentDate, isPaid);
        const priority = calculatePriority(nextPaymentDate, status, amountDue);

        // Data da última atualização
        const lastUpdate = service.updatedAt
          ? service.updatedAt.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];

        // Data do último serviço (usar endDate ou updatedAt)
        const lastServiceDate = service.endDate || lastUpdate;

        // Obter informações do cliente para responsável
        const client = service.clientId ? clientMap.get(service.clientId) : null;
        const responsiblePerson = client?.name || "N/A";

        alerts.push({
          id: alertId,
          contractServiceId: service.id,
          contractService: service,
          lastServiceDate,
          nextPaymentDate,
          amountDue,
          currency: service.budget.currency,
          status,
          priority,
          description: service.description || `Payment for ${service.serviceName}`,
          responsiblePerson,
          lastUpdate,
          serviceDescription: service.description,
          projectReference: service.projectNumber,
          paymentTerms,
        });
      }

      return alerts;
    } catch (error) {
      console.error("Error fetching contracted service payment alerts:", error);
      throw error;
    }
  },

  // Buscar alertas de pagamento de um serviço contratado específico
  async getPaymentAlertsByContractService(
    contractServiceId: string
  ): Promise<ContractedServicePaymentAlertData[]> {
    const allAlerts = await this.getAllContractedServicePaymentAlerts();
    return allAlerts.filter((alert) => alert.contractServiceId === contractServiceId);
  },
};




