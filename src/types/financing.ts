export interface Financing {
    id?: string;
    projectId: string;
    projectName: string;
    clientId: string;
    clientName: string;
    financingType: "loan" | "credit_line" | "equipment_financing" | "working_capital" | "construction_loan";
    lenderName: string;
    lenderContact: string;
    lenderPhone: string;
    lenderEmail: string;
    loanAmount: number;
    interestRate: number;
    termMonths: number;
    monthlyPayment: number;
    startDate: string;
    maturityDate: string;
    status: "pending" | "approved" | "active" | "paid_off" | "defaulted";
    collateral: string[];
    requirements: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateFinancingData {
    projectId: string;
    projectName: string;
    clientId: string;
    clientName: string;
    financingType: "loan" | "credit_line" | "equipment_financing" | "working_capital" | "construction_loan";
    lenderName: string;
    lenderContact: string;
    lenderPhone: string;
    lenderEmail: string;
    loanAmount: number;
    interestRate: number;
    termMonths: number;
    monthlyPayment: number;
    startDate: string;
    maturityDate: string;
    status: "pending" | "approved" | "active" | "paid_off" | "defaulted";
    collateral: string[];
    requirements: string[];
    notes?: string;
}
