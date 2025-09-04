export interface Document {
    id?: string;
    name: string; // Nome do documento
    category: "insurance" | "license" | "certification" | "contract" | "invoice" | "other"; // Categoria do documento
    entityType: "employee" | "subcontractor" | "vehicle" | "client" | "service" | "general"; // Tipo de entidade
    entityId: string; // ID da entidade relacionada
    fileUrl: string; // URL do arquivo no storage
    fileName: string; // Nome original do arquivo
    fileSize: number; // Tamanho do arquivo em bytes
    mimeType: string; // Tipo MIME do arquivo
    expiryDate?: string; // Data de vencimento (opcional)
    isActive: boolean; // Se o documento está ativo
    description?: string; // Descrição do documento
    uploadedBy: string; // ID do usuário que fez o upload
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateDocumentData {
    name: string;
    category: "insurance" | "license" | "certification" | "contract" | "invoice" | "other";
    entityType: "employee" | "subcontractor" | "vehicle" | "client" | "service" | "general";
    entityId: string;
    file: File; // Arquivo para upload
    expiryDate?: string;
    isActive: boolean;
    description?: string;
    uploadedBy: string;
}

export interface DocumentCategory {
    id: string;
    name: string;
    description: string;
    icon: string; // Ícone para exibição
    color: string; // Cor para exibição
}
