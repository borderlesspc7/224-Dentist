import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Cadastros.css";
import {
  ServerIcon,
  UserPlusIcon,
  UsersIcon,
  CreditCardIcon,
  CarIcon,
  UserIcon,
  HandshakeIcon,
  BookIcon,
  HomeIcon,
  WalletIcon,
  FileTextIcon,
  DollarSignIcon,
} from "lucide-react";
import { usePermissions } from "../../../hooks/usePermissions";
import { PERMISSIONS, type Permission } from "../../../config/permissions";

interface RegistrationCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  permission: Permission;
}

const Cadastros: React.FC = () => {
  const navigate = useNavigate();
  const { checkPermission } = usePermissions();

  const registrationCards: RegistrationCard[] = [
    {
      id: "cadastro-usuario",
      title: "Users",
      description: "Register and manage system users",
      icon: <UserPlusIcon />,
      path: "cadastro-usuario",
      permission: PERMISSIONS.REGISTER_USER,
    },
    {
      id: "cadastro-servico",
      title: "Services",
      description: "Register available services",
      icon: <ServerIcon />,
      path: "cadastro-servico",
      permission: PERMISSIONS.REGISTER_SERVICE,
    },
    {
      id: "cadastro-clientes",
      title: "Clients",
      description: "Register company clients",
      icon: <UsersIcon />,
      path: "cadastro-clientes",
      permission: PERMISSIONS.REGISTER_CLIENT,
    },
    {
      id: "cadastro-funcionario",
      title: "Employees",
      description: "Register employees",
      icon: <UserIcon />,
      path: "cadastro-funcionario",
      permission: PERMISSIONS.REGISTER_EMPLOYEE,
    },
    {
      id: "cadastro-subcontratados",
      title: "Subcontractors",
      description: "Register service providers",
      icon: <HandshakeIcon />,
      path: "cadastro-subcontratados",
      permission: PERMISSIONS.REGISTER_SUBCONTRACTOR,
    },
    {
      id: "cadastro-servicos-contratados",
      title: "Contract Services",
      description: "Register contracted services",
      icon: <BookIcon />,
      path: "cadastro-servicos-contratados",
      permission: PERMISSIONS.REGISTER_CONTRACT_SERVICE,
    },
    {
      id: "cadastro-financiamentos",
      title: "Financing",
      description: "Register financing options",
      icon: <CreditCardIcon />,
      path: "cadastro-financiamentos",
      permission: PERMISSIONS.REGISTER_FINANCING,
    },
    {
      id: "cadastro-veiculos",
      title: "Vehicles",
      description: "Register fleet vehicles",
      icon: <CarIcon />,
      path: "cadastro-veiculos",
      permission: PERMISSIONS.REGISTER_VEHICLE,
    },
    {
      id: "cadastro-conta-bancaria",
      title: "Bank Accounts",
      description: "Register bank accounts",
      icon: <HomeIcon />,
      path: "cadastro-conta-bancaria",
      permission: PERMISSIONS.REGISTER_BANK_ACCOUNT,
    },
    {
      id: "cadastro-cartao-credito",
      title: "Credit Cards",
      description: "Register credit cards",
      icon: <WalletIcon />,
      path: "cadastro-cartao-credito",
      permission: PERMISSIONS.REGISTER_CREDIT_CARD,
    },
    {
      id: "cadastro-tipo-despesa",
      title: "Expense Types",
      description: "Register expense categories",
      icon: <FileTextIcon />,
      path: "cadastro-tipo-despesa",
      permission: PERMISSIONS.REGISTER_EXPENSE_TYPE,
    },
    {
      id: "cadastro-preco-servico",
      title: "Service Pricing",
      description: "Register service prices",
      icon: <DollarSignIcon />,
      path: "cadastro-preco-servico",
      permission: PERMISSIONS.REGISTER_SERVICE_PRICING,
    },
  ];

  // Filter cards based on user permissions
  const filteredCards = useMemo(() => {
    return registrationCards.filter((card) => checkPermission(card.permission));
  }, [checkPermission]);

  const handleCardClick = (path: string) => {
    navigate(`/admin/${path}`);
  };

  return (
    <div className="cadastros">
      <div className="cadastros-header">
        <h1>System Registration</h1>
        <p>Select the type of registration you want to perform</p>
      </div>

      {filteredCards.length === 0 ? (
        <div className="cadastros-empty">
          <p>Você não tem permissão para acessar nenhuma área de cadastro.</p>
        </div>
      ) : (
        <div className="cadastros-grid">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="registration-card"
              onClick={() => handleCardClick(card.path)}
            >
              <div className="card-icon">{card.icon}</div>
              <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cadastros;
