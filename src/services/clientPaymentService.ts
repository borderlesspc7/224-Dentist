import { db } from "../lib/firebaseconfig";
import { clientService } from "./clientService";
import { contractServiceService } from "./contractServiceService";
import type { Client } from "../types/client";
import type { ContractService } from "../types/contractService";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export interface ClientPaymentAlertData {
  id: string;
  clientName: string;
  clientId: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: "pending" | "overdue" | "paid" | "cancelled";
  priority: "low" | "medium" | "high";
  paymentMethod: "cash" | "transfer" | "check" | "pix";
  description: string;
  lastReminder: string;
  reminderCount: number;
  contractServiceId?: string;
}

const CLIENT_PAYMENT_COLLECTION = "clientPayments";

// Calcular data de vencimento baseado no projeto ou serviço
const calculateDueDate = (
  client: Client,
  contractService?: ContractService
): string => {
  // Prioridade: deadline do projeto > data final do projeto > data final do serviço
  if (client.projectDeadline) {
    return client.projectDeadline;
  } else if (client.projectFinalDate) {
    return client.projectFinalDate;
  } else if (contractService?.endDate) {
    return contractService.endDate;
  } else {
    // Fallback: 30 dias a partir de hoje
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  }
};

// Gerar número de invoice baseado no projeto e serviço
const generateInvoiceNumber = (
  client: Client,
  contractService?: ContractService,
  index?: number
): string => {
  const year = new Date().getFullYear();
  const projectNum = client.projectNumber || client.id?.substring(0, 6) || "0000";
  const serviceNum = contractService?.contractNumber?.substring(0, 4) || index?.toString().padStart(3, "0") || "001";
  return `INV-${year}-${projectNum}-${serviceNum}`;
};

// Calcular status baseado na data de vencimento
const calculateStatus = (
  dueDate: string,
  isPaid: boolean = false,
  isCancelled: boolean = false
): "pending" | "overdue" | "paid" | "cancelled" => {
  if (isCancelled) {
    return "cancelled";
  }

  if (isPaid) {
    return "paid";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return "overdue";
  } else {
    return "pending";
  }
};

// Calcular prioridade baseado na proximidade da data de vencimento e valor
const calculatePriority = (
  dueDate: string,
  status: "pending" | "overdue" | "paid" | "cancelled",
  amount: number
): "low" | "medium" | "high" => {
  if (status === "paid" || status === "cancelled") {
    return "low";
  }

  if (status === "overdue") {
    return "high";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
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
): Promise<{ isPaid: boolean; isCancelled: boolean; lastReminder?: string; reminderCount?: number }> => {
  try {
    const paymentRef = doc(db, CLIENT_PAYMENT_COLLECTION, alertId);
    const paymentSnap = await getDoc(paymentRef);
    if (paymentSnap.exists()) {
      const data = paymentSnap.data();
      return {
        isPaid: data.isPaid === true,
        isCancelled: data.isCancelled === true,
        lastReminder: data.lastReminder,
        reminderCount: data.reminderCount || 0,
      };
    }
    return { isPaid: false, isCancelled: false, reminderCount: 0 };
  } catch (error) {
    console.error("Error checking payment status:", error);
    return { isPaid: false, isCancelled: false, reminderCount: 0 };
  }
};

export const clientPaymentService = {
  // Marcar pagamento como pago
  async markPaymentAsPaid(alertId: string): Promise<void> {
    try {
      const paymentRef = doc(db, CLIENT_PAYMENT_COLLECTION, alertId);
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

  // Enviar lembrete (incrementa contador)
  async sendReminder(alertId: string): Promise<void> {
    try {
      const paymentRef = doc(db, CLIENT_PAYMENT_COLLECTION, alertId);
      const paymentSnap = await getDoc(paymentRef);
      
      const currentData = paymentSnap.exists() ? paymentSnap.data() : {};
      const currentCount = currentData.reminderCount || 0;

      await setDoc(
        paymentRef,
        {
          reminderCount: currentCount + 1,
          lastReminder: new Date().toISOString().split("T")[0],
          updatedAt: new Date(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error sending reminder:", error);
      throw error;
    }
  },

  // Buscar todos os alertas de pagamento de clientes
  async getAllClientPaymentAlerts(): Promise<ClientPaymentAlertData[]> {
    try {
      // Buscar todos os clientes
      const clients = await clientService.getAllClients();
      
      // Buscar todos os serviços contratados
      const contractServices = await contractServiceService.getAllContractServices();

      // Criar mapa de serviços por cliente
      const servicesByClient = new Map<string, ContractService[]>();
      contractServices.forEach((service) => {
        if (service.clientId) {
          const existing = servicesByClient.get(service.clientId) || [];
          existing.push(service);
          servicesByClient.set(service.clientId, existing);
        }
      });

      const finalAlerts: ClientPaymentAlertData[] = [];
      
      for (const client of clients) {
        if (!client.id) continue;

        const clientServices = servicesByClient.get(client.id) || [];
        
        if (clientServices.length === 0 && client.projectNumber) {
          const dueDate = calculateDueDate(client);
          const invoiceNumber = generateInvoiceNumber(client);
          const alertId = `client_${client.id}_project`;
          
          const paymentStatus = await checkPaymentStatus(alertId);
          const amount = 0;
          const status = calculateStatus(dueDate, paymentStatus.isPaid, paymentStatus.isCancelled);
          
          if (dueDate && (client.projectNumber || client.projectDeadline)) {
            const priority = calculatePriority(dueDate, status, amount);
            
            finalAlerts.push({
              id: alertId,
              clientName: client.name,
              clientId: client.id,
              invoiceNumber,
              amount,
              dueDate,
              status,
              priority,
              paymentMethod: "transfer",
              description: `Payment for project ${client.projectNumber || client.id}`,
              lastReminder: paymentStatus.lastReminder || client.updatedAt.toISOString().split("T")[0],
              reminderCount: paymentStatus.reminderCount || 0,
            });
          }
        } else {
          for (let index = 0; index < clientServices.length; index++) {
            const service = clientServices[index];
            if (service.status === "cancelled") continue;

            const dueDate = calculateDueDate(client, service);
            const invoiceNumber = generateInvoiceNumber(client, service, index);
            const alertId = `client_${client.id}_service_${service.id || index}`;
            
            const amount = service.budget.actualCost || service.budget.estimatedCost || 0;
            const paymentStatus = await checkPaymentStatus(alertId);
            const status = calculateStatus(dueDate, paymentStatus.isPaid, paymentStatus.isCancelled);
            const priority = calculatePriority(dueDate, status, amount);
            
            finalAlerts.push({
              id: alertId,
              clientName: client.name,
              clientId: client.id,
              invoiceNumber,
              amount,
              dueDate,
              status,
              priority,
              paymentMethod: "transfer",
              description: service.description || `Payment for ${service.serviceName}`,
              lastReminder: paymentStatus.lastReminder || service.updatedAt.toISOString().split("T")[0],
              reminderCount: paymentStatus.reminderCount || 0,
              contractServiceId: service.id,
            });
          }
        }
      }

      return finalAlerts;
    } catch (error) {
      console.error("Error fetching client payment alerts:", error);
      throw error;
    }
  },

  // Buscar alertas de pagamento de um cliente específico
  async getPaymentAlertsByClient(
    clientId: string
  ): Promise<ClientPaymentAlertData[]> {
    const allAlerts = await this.getAllClientPaymentAlerts();
    return allAlerts.filter((alert) => alert.clientId === clientId);
  },
};
