import React from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const handleLogin = async (
    username: string,
    password: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "admin" && password === "password") {
          console.log("Login successful");
          resolve();
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1500);
    });
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
