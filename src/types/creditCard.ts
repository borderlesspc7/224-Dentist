export interface CreditCard {
    id?: string;
    cardName: string; // Nome do cartão (ex: "Cartão Equipe 1", "Cartão Operações")
    cardNumber: string; // Últimos 4 dígitos do cartão
    cardType: "visa" | "mastercard" | "amex" | "discover"; // Tipo do cartão
    bankName: string; // Banco emissor
    assignedTo: string; // Equipe ou pessoa responsável
    creditLimit: number; // Limite de crédito
    currentBalance: number; // Saldo atual
    expiryDate: string; // Data de vencimento
    isActive: boolean; // Se o cartão está ativo
    monthlyLimit?: number; // Limite mensal (opcional)
    description?: string; // Descrição adicional
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCreditCardData {
    cardName: string;
    cardNumber: string;
    cardType: "visa" | "mastercard" | "amex" | "discover";
    bankName: string;
    assignedTo: string;
    creditLimit: number;
    currentBalance: number;
    expiryDate: string;
    isActive: boolean;
    monthlyLimit?: number;
    description?: string;
}
