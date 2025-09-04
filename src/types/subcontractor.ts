export interface Subcontractor {
    id?: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    state: string;
    city: string;
    address: string;
    itinNumber: string; // ITIN Number
    services: string[];
    licenseNumber?: string;
    insuranceExpiry?: string;
    insuranceDocuments?: string[]; // URLs dos documentos de seguro
    certifications?: string[];
    hourlyRate?: number;
    paymentTerms: "7" | "15" | "30"; // Data para pagamento após execução
    availability: "available" | "busy" | "unavailable";
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateSubcontractorData {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    state: string;
    city: string;
    address: string;
    itinNumber: string; // ITIN Number
    services: string[];
    licenseNumber?: string;
    insuranceExpiry?: string;
    insuranceDocuments?: File[]; // Arquivos PDF para upload
    certifications?: string[];
    hourlyRate?: number;
    paymentTerms: "7" | "15" | "30"; // Data para pagamento após execução
    availability: "available" | "busy" | "unavailable";
    notes?: string;
}
