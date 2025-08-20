export interface Employee {
  id?: string; // ID do documento no Firestore (opcional para criação)
  name: string; // Nome completo do funcionário
  address: string; // Endereço completo
  itinNumber: string; // Número do ITIN
  driverLicenseNumber: string; // Número da carteira de motorista
  driverLicenseDocument?: string; // URL do documento PDF no Storage (opcional)
  phone: string; // Telefone do funcionário
  emergencyContactName: string; // Nome do contato de emergência
  emergencyContactPhone: string; // Telefone do contato de emergência
  emergencyContactRelationship: string; // Grau de parentesco
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data de última atualização
}

export interface CreateEmployeeData {
  name: string;
  address: string;
  itinNumber: string;
  driverLicenseNumber: string;
  driverLicenseDocument?: File; // Arquivo PDF para upload
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}
