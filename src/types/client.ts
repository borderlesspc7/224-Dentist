export interface Client {
  id?: string;
  name: string;
  state: string;
  city: string;
  address: string;
  personPhone: string;
  officePhone: string;
  projectNumber: string;
  projectContractDate: string;
  projectFinalDate: string;
  projectDeadline: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientData {
  name: string;
  state: string;
  city: string;
  address: string;
  personPhone: string;
  officePhone: string;
  projectNumber: string;
  projectContractDate: string;
  projectFinalDate: string;
  projectDeadline: string;
}
