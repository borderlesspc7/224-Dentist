export interface BankAccount {
    id?: string;
    accountName: string; // Nome da conta (ex: "Conta Principal", "Conta de Operações")
    bankName: string; // Nome do banco
    accountNumber: string; // Número da conta
    routingNumber: string; // Número de roteamento
    accountType: "checking" | "savings" | "business"; // Tipo da conta
    balance: number; // Saldo atual
    currency: string; // Moeda (USD, BRL, etc.)
    isActive: boolean; // Se a conta está ativa
    description?: string; // Descrição adicional
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBankAccountData {
    accountName: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: "checking" | "savings" | "business";
    balance: number;
    currency: string;
    isActive: boolean;
    description?: string;
}
