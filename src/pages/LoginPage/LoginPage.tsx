import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "../../hooks/useNavigation";
import LoginForm from "../../components/LoginForm/LoginForm";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { goTo } = useNavigation();

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<void> => {
    await login({ email, password });
    // Login bem-sucedido, redireciona para admin
    goTo("/admin");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="company-logo">
            LUNDER
            <br />
            UNDERGROUND SERVICES
            <br />
            CORP
          </div>
          <div className="company-subtitle">
            Engineering Excellence Underground
          </div>

          <LoginForm onLogin={handleLogin} />

          <div className="login-footer">
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
