export interface BillingUnit {
  value: "ft" | "box" | "fixed" | "";
  label: "Foot (ft)" | "Box" | "Fixed Price" | "";
}

export interface Service {
  id?: string; // ID do documento no Firestore (opcional para criação)
  serviceCode: string; // Código do serviço (ex: SRV-001)
  serviceName: string; // Nome do serviço
  billingUnit: BillingUnit; // Unidade de cobrança (ft, box, fixed)
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data de última atualização
}

export interface CreateServiceData {
  serviceCode: string;
  serviceName: string;
  billingUnit: BillingUnit["value"];
}
