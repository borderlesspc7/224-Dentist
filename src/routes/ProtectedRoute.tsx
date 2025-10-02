import type { ReactNode } from "react";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { hasAccess } from "./permissions";
import "./ProtectedRoute.css";

interface ProtectedRouteProps {
  children: ReactNode;
  required?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  required,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading-container">
        <div className="auth-loading-content">
          <div className="auth-loading-spinner"></div>
          <p className="auth-loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const isAllowed = hasAccess(user, required);

  if (!isAllowed) return <Navigate to="/" replace />;

  return children;
};
