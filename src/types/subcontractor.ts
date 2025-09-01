export interface Subcontractor {
    id?: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    state: string;
    city: string;
    address: string;
    services: string[];
    licenseNumber?: string;
    insuranceExpiry?: string;
    certifications?: string[];
    hourlyRate?: number;
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
    services: string[];
    licenseNumber?: string;
    insuranceExpiry?: string;
    certifications?: string[];
    hourlyRate?: number;
    availability: "available" | "busy" | "unavailable";
    notes?: string;
}
