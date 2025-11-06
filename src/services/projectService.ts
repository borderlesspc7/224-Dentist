import { db } from "../lib/firebaseconfig";
import { clientService } from "./clientService";
import { contractServiceService } from "./contractServiceService";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export interface ProjectAlertData {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  clientId: string;
  projectType: string;
  startDate: string;
  plannedEndDate: string;
  actualProgress: number;
  status: "on-track" | "at-risk" | "delayed" | "completed";
  priority: "low" | "medium" | "high";
  description: string;
  responsiblePerson: string;
  lastUpdate: string;
}

const PROJECT_PROGRESS_COLLECTION = "projectProgress";

// Calcular status baseado nas datas
const calculateStatus = (
  startDate: string,
  endDate: string,
  progress: number
): "on-track" | "at-risk" | "delayed" | "completed" => {
  if (progress >= 100) {
    return "completed";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Se a data final já passou e não está 100% concluído
  if (diffDays < 0) {
    return "delayed";
  }

  // Calcular progresso esperado baseado nas datas
  const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const daysElapsed = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  
  if (totalDays <= 0) {
    return progress >= 100 ? "completed" : "delayed";
  }
  
  const expectedProgress = Math.max(0, Math.min(100, (daysElapsed / totalDays) * 100));

  // Se o progresso está muito atrás do esperado (mais de 15%)
  if (progress < expectedProgress - 15) {
    return "at-risk";
  } else {
    return "on-track";
  }
};

// Calcular prioridade baseado na proximidade do prazo
const calculatePriority = (endDate: string): "low" | "medium" | "high" => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "high"; // Atrasado
  } else if (diffDays <= 7) {
    return "high"; // Próximo do prazo
  } else if (diffDays <= 30) {
    return "medium"; // Dentro de um mês
  } else {
    return "low"; // Ainda há tempo
  }
};

export const projectService = {
  // Buscar progresso do projeto
  async getProjectProgress(projectId: string): Promise<number | null> {
    try {
      const progressRef = doc(db, PROJECT_PROGRESS_COLLECTION, projectId);
      const progressSnap = await getDoc(progressRef);
      if (progressSnap.exists()) {
        return progressSnap.data().progress || 0;
      }
      return null;
    } catch (error) {
      console.error("Error getting project progress:", error);
      return null;
    }
  },

  // Salvar ou atualizar progresso do projeto
  async saveProjectProgress(
    projectId: string,
    progress: number,
    lastUpdate: string = new Date().toISOString().split("T")[0]
  ): Promise<void> {
    try {
      const progressRef = doc(db, PROJECT_PROGRESS_COLLECTION, projectId);
      await setDoc(
        progressRef,
        {
          progress,
          lastUpdate,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving project progress:", error);
      throw error;
    }
  },

  // Buscar todos os projetos como alertas
  async getAllProjectAlerts(): Promise<ProjectAlertData[]> {
    try {
      // Buscar todos os clientes
      const clients = await clientService.getAllClients();
      
      // Buscar todos os serviços contratados para obter mais informações
      const contractServices = await contractServiceService.getAllContractServices();

      const projects: ProjectAlertData[] = [];

      for (const client of clients) {
        // Pular clientes sem informações de projeto
        if (!client.projectNumber || !client.projectDeadline) {
          continue;
        }

        // Buscar progresso salvo
        const projectId = client.id || client.projectNumber;
        const savedProgress = await this.getProjectProgress(projectId);
        
        // Buscar serviços contratados relacionados a este cliente
        const relatedServices = contractServices.filter(
          (service) => service.clientId === client.id && 
          service.projectNumber === client.projectNumber
        );

        // Determinar tipo de projeto, nome e descrição
        let projectType = "Infrastructure";
        let projectName = `Project ${client.projectNumber}`;
        let description = `Project ${client.projectNumber}`;
        
        if (relatedServices.length > 0) {
          const firstService = relatedServices[0];
          projectType = firstService.serviceType || "Infrastructure";
          projectName = firstService.serviceName || projectName;
          description = firstService.description || description;
        }

        // Usar datas do cliente ou do serviço contratado
        const startDate = client.projectContractDate || relatedServices[0]?.startDate || new Date().toISOString().split("T")[0];
        const plannedEndDate = client.projectDeadline || relatedServices[0]?.endDate || client.projectFinalDate || new Date().toISOString().split("T")[0];

        // Calcular progresso (usar salvo ou calcular)
        const actualProgress = savedProgress !== null ? savedProgress : 0;

        // Calcular status e prioridade usando a data de início real
        const status = calculateStatus(startDate, plannedEndDate, actualProgress);
        const priority = calculatePriority(plannedEndDate);

        // Determinar responsável (por enquanto usar o primeiro funcionário relacionado ou "N/A")
        const responsiblePerson = "N/A"; // Pode ser melhorado buscando funcionários relacionados

        // Data da última atualização
        const lastUpdate = client.updatedAt 
          ? client.updatedAt.toISOString().split("T")[0] 
          : new Date().toISOString().split("T")[0];

        projects.push({
          id: projectId,
          projectId: projectId,
          projectName,
          clientName: client.name,
          clientId: client.id || "",
          projectType,
          startDate,
          plannedEndDate,
          actualProgress,
          status,
          priority,
          description,
          responsiblePerson,
          lastUpdate,
        });
      }

      return projects;
    } catch (error) {
      console.error("Error fetching project alerts:", error);
      throw error;
    }
  },

  // Atualizar progresso de um projeto
  async updateProjectProgress(
    projectId: string,
    progress: number
  ): Promise<void> {
    try {
      const lastUpdate = new Date().toISOString().split("T")[0];
      await this.saveProjectProgress(projectId, progress, lastUpdate);
    } catch (error) {
      console.error("Error updating project progress:", error);
      throw error;
    }
  },

  // Marcar projeto como concluído
  async markProjectAsCompleted(projectId: string): Promise<void> {
    try {
      await this.saveProjectProgress(projectId, 100);
    } catch (error) {
      console.error("Error marking project as completed:", error);
      throw error;
    }
  },
};
