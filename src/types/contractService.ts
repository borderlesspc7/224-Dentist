export interface ContractService {
    id?: string;
    serviceName: string;
    clientId: string;
    clientName: string;
    subcontractorId?: string;
    subcontractorName?: string;
    projectNumber: string;
    contractNumber: string;
    startDate: string;
    endDate: string;
    estimatedDuration: string;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    serviceType: string;
    description: string;
    location: {
        address: string;
        city: string;
        state: string;
        zipCode?: string;
    };
    budget: {
        estimatedCost: number;
        actualCost?: number;
        currency: string;
    };
    requirements: string[];
    deliverables: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateContractServiceData {
    serviceName: string;
    clientId: string;
    clientName: string;
    subcontractorId?: string;
    subcontractorName?: string;
    projectNumber: string;
    contractNumber: string;
    startDate: string;
    endDate: string;
    estimatedDuration: string;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    serviceType: string;
    description: string;
    location: {
        address: string;
        city: string;
        state: string;
        zipCode?: string;
    };
    budget: {
        estimatedCost: number;
        actualCost?: number;
        currency: string;
    };
    requirements: string[];
    deliverables: string[];
    notes?: string;
}
