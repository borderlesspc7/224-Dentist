import React from "react";
import { useNavigate } from "react-router-dom";
import "./Avisos.css";
import {
  CarIcon,
  CheckCircleIcon,
  CreditCardIcon,
  DollarSignIcon,
} from "lucide-react";

const Avisos: React.FC = () => {
  const navigate = useNavigate();

  const avisosCards = [
    {
      id: "manutencao-veiculos",
      title: "Vehicle Maintenance",
      description: "Vehicle maintenance alerts",
      icon: <CarIcon />,
      path: "manutencao-veiculos",
    },
    {
      id: "termino-projeto",
      title: "Project Completion",
      description: "Project completion alerts",
      icon: <CheckCircleIcon />,
      path: "termino-projeto",
    },
    {
      id: "pagamento-subcontratados",
      title: "Subcontractor Payment",
      description: "Subcontractor payment alerts",
      icon: <CreditCardIcon />,
      path: "pagamento-subcontratados",
    },
    {
      id: "recebimento-cliente",
      title: "Client Payment",
      description: "Client payment alerts",
      icon: <DollarSignIcon />,
      path: "recebimento-cliente",
    },
    {
      id: "pagamento-servicos-contratados",
      title: "Contracted Services Payment",
      description: "Contracted services payment alerts",
      icon: <CreditCardIcon />,
      path: "pagamento-servicos-contratados",
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(`/admin/${path}`);
  };

  return (
    <div className="avisos">
      <div className="avisos-header">
        <h1>Alerts</h1>
        <p>Select the type of alert you want to view</p>
      </div>

      <div className="avisos-grid">
        {avisosCards.map((card) => (
          <div
            key={card.id}
            className="aviso-card"
            onClick={() => handleCardClick(card.path)}
          >
            <div className="aviso-card-icon">{card.icon}</div>
            <div className="aviso-card-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Avisos;
