export interface ServicePricing {
    id?: string;
    serviceId: string; // ID do serviço
    clientId: string; // ID do cliente
    price: number; // Preço específico para este cliente
    currency: string; // Moeda
    effectiveDate: string; // Data de início da vigência
    endDate?: string; // Data de fim da vigência (opcional)
    isActive: boolean; // Se o preço está ativo
    notes?: string; // Observações sobre o preço
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateServicePricingData {
    serviceId: string;
    clientId: string;
    price: number;
    currency: string;
    effectiveDate: string;
    endDate?: string;
    isActive: boolean;
    notes?: string;
}

export interface PricingHistory {
    id?: string;
    serviceId: string;
    clientId: string;
    oldPrice: number;
    newPrice: number;
    changeDate: string;
    changeReason: string;
    changedBy: string; // ID do usuário que fez a alteração
    createdAt: Date;
}

export interface CreatePricingHistoryData {
    serviceId: string;
    clientId: string;
    oldPrice: number;
    newPrice: number;
    changeDate: string;
    changeReason: string;
    changedBy: string;
}
