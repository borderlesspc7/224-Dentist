import { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { clientService } from "../services/clientService";
import { serviceService } from "../services/serviceService";
import { subcontractorService } from "../services/subcontractorService";
import { contractServiceService } from "../services/contractServiceService";
import { financingService } from "../services/financingService";
import { vehicleService } from "../services/vehicleService";
import { bankAccountService } from "../services/bankAccountService";
import { creditCardService } from "../services/creditCardService";
import { expenseTypeService } from "../services/expenseTypeService";
import { servicePricingService } from "../services/servicePricingService";

interface DashboardData {
    users: any[];
    clients: any[];
    services: any[];
    employees: any[];
    subcontractors: any[];
    contractServices: any[];
    financings: any[];
    vehicles: any[];
    bankAccounts: any[];
    creditCards: any[];
    expenseTypes: any[];
    servicePricing: any[];
}

interface UseDashboardDataReturn {
    data: DashboardData;
    loading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
    const [data, setData] = useState<DashboardData>({
        users: [],
        clients: [],
        services: [],
        employees: [],
        subcontractors: [],
        contractServices: [],
        financings: [],
        vehicles: [],
        bankAccounts: [],
        creditCards: [],
        expenseTypes: [],
        servicePricing: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [
                users,
                clients,
                services,
                subcontractors,
                contractServices,
                financings,
                vehicles,
                bankAccounts,
                creditCards,
                expenseTypes,
                servicePricing,
            ] = await Promise.all([
                userService.getAllUsers(),
                clientService.getAllClients(),
                serviceService.getAllServices(),
                subcontractorService.getAllSubcontractors(),
                contractServiceService.getAllContractServices(),
                financingService.getAllFinancings(),
                vehicleService.getAllVehicles(),
                bankAccountService.getAllBankAccounts(),
                creditCardService.getAllCreditCards(),
                expenseTypeService.getAllExpenseTypes(),
                servicePricingService.getAllServicePricing(),
            ]);

            setData({
                users,
                clients,
                services,
                employees: [], // Por enquanto vazio, pode ser implementado depois
                subcontractors,
                contractServices,
                financings,
                vehicles,
                bankAccounts,
                creditCards,
                expenseTypes,
                servicePricing,
            });
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        loading,
        error,
        refreshData: fetchData,
    };
};
