import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import "./NoPermissions.css";

const NoPermissions: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="no-permissions-container">
      <div className="no-permissions-content">
        <div className="no-permissions-icon">
          <ShieldAlert size={64} />
        </div>
        <h1 className="no-permissions-title">Acesso Negado</h1>
        <p className="no-permissions-message">
          Você não tem permissões suficientes para acessar esta área do sistema.
        </p>
        {user && (
          <div className="user-info-box">
            <p className="user-email">{user.email}</p>
            <p className="user-role">
              Perfil:{" "}
              {user.role === "admin" ? "Administrador" : "Acesso Parcial"}
            </p>
          </div>
        )}
        <div className="no-permissions-actions">
          <button onClick={handleLogout} className="btn-logout">
            Fazer Logout
          </button>
        </div>
        <p className="no-permissions-help">
          Entre em contato com o administrador do sistema para solicitar as
          permissões necessárias.
        </p>
      </div>
    </div>
  );
};

export default NoPermissions;
