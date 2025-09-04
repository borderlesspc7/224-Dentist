export interface ExpenseType {
    id?: string;
    name: string; // Nome do tipo de despesa
    category: "operational" | "administrative" | "equipment" | "fuel" | "maintenance" | "insurance" | "other"; // Categoria
    description?: string; // Descrição do tipo de despesa
    isActive: boolean; // Se o tipo está ativo
    requiresApproval: boolean; // Se requer aprovação
    maxAmount?: number; // Valor máximo permitido (opcional)
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateExpenseTypeData {
    name: string;
    category: "operational" | "administrative" | "equipment" | "fuel" | "maintenance" | "insurance" | "other";
    description?: string;
    isActive: boolean;
    requiresApproval: boolean;
    maxAmount?: number;
}
