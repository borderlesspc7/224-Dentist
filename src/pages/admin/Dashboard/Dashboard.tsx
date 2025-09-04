import React, { useState } from "react";
import "./Dashboard.css";
import DataTable from "../../../components/ui/DataTable/DataTable";
import { useDashboardData } from "../../../hooks/useDashboardData";
import {
    UsersIcon,
    UserPlusIcon,
    ServerIcon,
    CreditCardIcon,
    CarIcon,
    PlusIcon,
    HomeIcon,
    WalletIcon,
    FileTextIcon,
    DollarSignIcon,
} from "lucide-react";

interface DashboardSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
    route: string;
}

const dashboardSections: DashboardSection[] = [
    {
        id: "users",
        title: "Users",
        icon: <UserPlusIcon />,
        description: "Manage system users and their permissions",
        route: "/dashboard/users",
    },
    {
        id: "services",
        title: "Services",
        icon: <ServerIcon />,
        description: "Manage available services",
        route: "/dashboard/services",
    },
    {
        id: "clients",
        title: "Clients",
        icon: <UsersIcon />,
        description: "Manage client information and records",
        route: "/dashboard/clients",
    },
    {
        id: "employees",
        title: "Employees",
        icon: <UserPlusIcon />,
        description: "Manage employee profiles and information",
        route: "/dashboard/employees",
    },
    {
        id: "subcontractors",
        title: "Subcontractors",
        icon: <UserPlusIcon />,
        description: "Manage subcontractor information",
        route: "/dashboard/subcontractors",
    },
    {
        id: "contract-services",
        title: "Contract Services",
        icon: <ServerIcon />,
        description: "Manage contracted services",
        route: "/dashboard/contract-services",
    },
    {
        id: "financings",
        title: "Financings",
        icon: <CreditCardIcon />,
        description: "Manage financing information",
        route: "/dashboard/financings",
    },
    {
        id: "vehicles",
        title: "Vehicles",
        icon: <CarIcon />,
        description: "Manage vehicle fleet and information",
        route: "/dashboard/vehicles",
    },
    {
        id: "bank-accounts",
        title: "Bank Accounts",
        icon: <HomeIcon />,
        description: "Manage bank accounts and financial information",
        route: "/dashboard/bank-accounts",
    },
    {
        id: "credit-cards",
        title: "Credit Cards",
        icon: <WalletIcon />,
        description: "Manage credit cards for teams and operations",
        route: "/dashboard/credit-cards",
    },
    {
        id: "expense-types",
        title: "Expense Types",
        icon: <FileTextIcon />,
        description: "Manage expense categories and types",
        route: "/dashboard/expense-types",
    },
    {
        id: "service-pricing",
        title: "Service Pricing",
        icon: <DollarSignIcon />,
        description: "Manage service pricing by client",
        route: "/dashboard/service-pricing",
    },
];

export default function Dashboard() {
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const { data, loading, refreshData } = useDashboardData();

    const handleSectionClick = (sectionId: string) => {
        setSelectedSection(selectedSection === sectionId ? null : sectionId);
    };

    // Mapeamento das rotas para cada seção (rotas relativas dentro do admin)
    const getRouteForSection = (sectionId: string): string => {
        const routes: Record<string, string> = {
            users: "cadastro-usuario",
            services: "cadastro-servico",
            clients: "cadastro-clientes",
            employees: "cadastro-funcionario",
            subcontractors: "cadastro-subcontratados",
            "contract-services": "cadastro-servicos-contratados",
            financings: "cadastro-financiamentos",
            vehicles: "cadastro-veiculos",
            "bank-accounts": "cadastro-conta-bancaria",
            "credit-cards": "cadastro-cartao-credito",
            "expense-types": "cadastro-tipo-despesa",
            "service-pricing": "cadastro-preco-servico",
        };
        return routes[sectionId] || "";
    };

    // Get real data from Firestore
    const getRealData = (sectionId: string) => {
        const dataMapping: Record<string, keyof typeof data> = {
            users: "users",
            services: "services",
            clients: "clients",
            employees: "employees",
            subcontractors: "subcontractors",
            "contract-services": "contractServices",
            financings: "financings",
            vehicles: "vehicles",
            "bank-accounts": "bankAccounts",
            "credit-cards": "creditCards",
            "expense-types": "expenseTypes",
            "service-pricing": "servicePricing",
        };

        const dataKey = dataMapping[sectionId];
        const sectionData = dataKey ? data[dataKey] || [] : [];

        // Transform data to match table format
        return sectionData.map((item: Record<string, unknown>) => {
            const baseItem = {
                id: item.id || item.uid || "N/A",
                name: item.name || item.displayName || item.fullName || "N/A",
                status: item.status || "active",
                created: item.createdAt && typeof item.createdAt === 'object' && 'toDate' in item.createdAt ?
                    (item.createdAt as { toDate: () => Date }).toDate().toLocaleDateString() :
                    "N/A",
            };

            // Add specific fields based on section type
            switch (sectionId) {
                case "users":
                    return {
                        ...baseItem,
                        email: item.email || "N/A",
                        role: item.role || "N/A",
                    };
                case "clients":
                    return {
                        ...baseItem,
                        company: item.company || "N/A",
                        phone: item.phone || "N/A",
                    };
                case "services":
                    return {
                        ...baseItem,
                        description: item.description || "N/A",
                        price: item.price || "N/A",
                    };
                case "subcontractors":
                    return {
                        ...baseItem,
                        company: item.company || "N/A",
                        phone: item.phone || "N/A",
                    };
                case "contractServices":
                    return {
                        ...baseItem,
                        service: item.serviceName || "N/A",
                        client: item.clientName || "N/A",
                    };
                case "financings":
                    return {
                        ...baseItem,
                        amount: item.amount || "N/A",
                        status: item.financingStatus || "N/A",
                    };
                case "vehicles":
                    return {
                        ...baseItem,
                        make: item.make || "N/A",
                        model: item.model || "N/A",
                        license: item.licensePlate || "N/A",
                    };
                default:
                    return baseItem;
            }
        });
    };

    const getColumns = (sectionId: string) => {
        const baseColumns = [
            { key: "id", label: "ID", width: "80px" },
            { key: "name", label: "Name" },
            {
                key: "status",
                label: "Status",
                width: "120px",
                render: (value: string) => (
                    <span className={`status-badge ${value}`}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                ),
            },
            { key: "created", label: "Created", width: "120px" },
        ];

        // Add specific columns based on section type
        switch (sectionId) {
            case "users":
                return [
                    ...baseColumns,
                    { key: "email", label: "Email" },
                    { key: "role", label: "Role", width: "120px" },
                ];
            case "clients":
                return [
                    ...baseColumns,
                    { key: "company", label: "Company" },
                    { key: "phone", label: "Phone", width: "140px" },
                ];
            case "services":
                return [
                    ...baseColumns,
                    { key: "description", label: "Description" },
                    { key: "price", label: "Price", width: "100px" },
                ];
            case "subcontractors":
                return [
                    ...baseColumns,
                    { key: "company", label: "Company" },
                    { key: "phone", label: "Phone", width: "140px" },
                ];
            case "contractServices":
                return [
                    ...baseColumns,
                    { key: "service", label: "Service" },
                    { key: "client", label: "Client" },
                ];
            case "financings":
                return [
                    ...baseColumns,
                    { key: "amount", label: "Amount", width: "120px" },
                    { key: "status", label: "Status", width: "120px" },
                ];
            case "vehicles":
                return [
                    ...baseColumns,
                    { key: "make", label: "Make", width: "100px" },
                    { key: "model", label: "Model", width: "100px" },
                    { key: "license", label: "License", width: "100px" },
                ];
            default:
                return baseColumns;
        }
    };

    const handleView = (record: Record<string, unknown>) => {
        console.log("View record:", record);
        // Navegar para a página de visualização (pode ser implementado depois)
        alert(`Visualizando ${record.name} (ID: ${record.id})\n\nFuncionalidade de visualização será implementada em breve.`);
    };

    const handleEdit = (record: Record<string, unknown>) => {
        console.log("Edit record:", record);
        console.log("Selected section:", selectedSection);

        if (!selectedSection) {
            alert("Por favor, selecione uma seção primeiro clicando em um dos cards acima.");
            return;
        }

        // Navegar para a página de edição
        const route = getRouteForSection(selectedSection);
        console.log("Navigating to:", route);

        // Teste com window.location para ver se o problema é com React Router
        if (route) {
            window.location.href = `/admin/${route}?edit=${record.id}`;
        } else {
            console.error("Route not found for section:", selectedSection);
            alert("Rota não encontrada para a seção selecionada.");
        }
    };

    const handleDelete = async (record: Record<string, unknown>) => {
        if (confirm(`Tem certeza que deseja excluir ${record.name}?`)) {
            try {
                // Import services dynamically based on section
                const { userService } = await import("../../../services/userService");
                const { clientService } = await import("../../../services/clientService");
                const { serviceService } = await import("../../../services/serviceService");
                const { subcontractorService } = await import("../../../services/subcontractorService");
                const { contractServiceService } = await import("../../../services/contractServiceService");
                const { financingService } = await import("../../../services/financingService");
                const { vehicleService } = await import("../../../services/vehicleService");

                // Delete based on section type
                const recordId = String(record.id);
                switch (selectedSection) {
                    case "users":
                        await userService.deleteUser(recordId);
                        break;
                    case "clients":
                        await clientService.deleteClient(recordId);
                        break;
                    case "services":
                        await serviceService.deleteService(recordId);
                        break;
                    case "subcontractors":
                        await subcontractorService.deleteSubcontractor(recordId);
                        break;
                    case "contractServices":
                        await contractServiceService.deleteContractService(recordId);
                        break;
                    case "financings":
                        await financingService.deleteFinancing(recordId);
                        break;
                    case "vehicles":
                        await vehicleService.deleteVehicle(recordId);
                        break;
                    default:
                        throw new Error("Tipo de seção desconhecido");
                }

                // Refresh data after deletion
                await refreshData();
                alert(`${record.name} excluído com sucesso!`);
            } catch (error) {
                console.error("Error deleting record:", error);
                alert(`Falha ao excluir ${record.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            }
        }
    };

    const handleAddNew = () => {
        console.log("Add new record");
        console.log("Selected section:", selectedSection);

        if (!selectedSection) {
            alert("Por favor, selecione uma seção primeiro clicando em um dos cards acima.");
            return;
        }

        // Navegar para a página de registro da seção selecionada
        const route = getRouteForSection(selectedSection);
        console.log("Navigating to:", route);

        // Teste com window.location para ver se o problema é com React Router
        if (route) {
            window.location.href = `/admin/${route}`;
        } else {
            console.error("Route not found for section:", selectedSection);
            alert("Rota não encontrada para a seção selecionada.");
        }
    };

    const renderSectionContent = (sectionId: string) => {
        const sectionData = getRealData(sectionId);
        const columns = getColumns(sectionId);

        return (
            <div className="section-content">
                <div className="section-header">
                    <h3>Manage {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}</h3>
                    <button className="add-button" onClick={handleAddNew}>
                        <PlusIcon />
                        Add New
                    </button>
                </div>
                <DataTable
                    columns={columns}
                    data={sectionData}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage=""
                />
            </div>
        );
    };

    return (
        <div className="dashboard">

            <div className="dashboard-content">
                <div className="sections-grid">
                    {dashboardSections.map((section) => (
                        <div
                            key={section.id}
                            className={`section-card ${selectedSection === section.id ? "active" : ""
                                }`}
                            onClick={() => handleSectionClick(section.id)}
                        >
                            <div className="section-icon">{section.icon}</div>
                            <div className="section-info">
                                <h3>{section.title}</h3>
                                <p>{section.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedSection && (
                    <div className="section-details">
                        {renderSectionContent(selectedSection)}
                    </div>
                )}
            </div>
        </div>
    );
}
