import React from "react";
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

const Cadastros: React.FC = () => {
  const navigate = useNavigate();

  const registrationCards = [
    {
      id: "cadastro-usuario",
      title: "Users",
      description: "Register and manage system users",
      icon: <UserPlusIcon />,
      path: "cadastro-usuario",
    },
    {
      id: "cadastro-servico",
      title: "Services",
      description: "Register available services",
      icon: <ServerIcon />,
      path: "cadastro-servico",
    },
    {
      id: "cadastro-clientes",
      title: "Clients",
      description: "Register company clients",
      icon: <UsersIcon />,
      path: "cadastro-clientes",
    },
    {
      id: "cadastro-funcionario",
      title: "Employees",
      description: "Register employees",
      icon: <UserIcon />,
      path: "cadastro-funcionario",
    },
    {
      id: "cadastro-subcontratados",
      title: "Subcontractors",
      description: "Register service providers",
      icon: <HandshakeIcon />,
      path: "cadastro-subcontratados",
    },
    {
      id: "cadastro-servicos-contratados",
      title: "Contract Services",
      description: "Register contracted services",
      icon: <BookIcon />,
      path: "cadastro-servicos-contratados",
    },
    {
      id: "cadastro-financiamentos",
      title: "Financing",
      description: "Register financing options",
      icon: <CreditCardIcon />,
      path: "cadastro-financiamentos",
    },
    {
      id: "cadastro-veiculos",
      title: "Vehicles",
      description: "Register fleet vehicles",
      icon: <CarIcon />,
      path: "cadastro-veiculos",
    },
    {
      id: "cadastro-conta-bancaria",
      title: "Bank Accounts",
      description: "Register bank accounts",
      icon: <HomeIcon />,
      path: "cadastro-conta-bancaria",
    },
    {
      id: "cadastro-cartao-credito",
      title: "Credit Cards",
      description: "Register credit cards",
      icon: <WalletIcon />,
      path: "cadastro-cartao-credito",
    },
    {
      id: "cadastro-tipo-despesa",
      title: "Expense Types",
      description: "Register expense categories",
      icon: <FileTextIcon />,
      path: "cadastro-tipo-despesa",
    },
    {
      id: "cadastro-preco-servico",
      title: "Service Pricing",
      description: "Register service prices",
      icon: <DollarSignIcon />,
      path: "cadastro-preco-servico",
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(`/admin/${path}`);
  };

  return (
    <div className="cadastros">
      <div className="cadastros-header">
        <h1>System Registration</h1>
        <p>Select the type of registration you want to perform</p>
      </div>

      <div className="cadastros-grid">
        {registrationCards.map((card) => (
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
    </div>
  );
};

export default Cadastros;
