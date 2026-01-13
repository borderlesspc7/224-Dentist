import type { ReactNode } from "react";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { hasPermission, type Permission } from "../config/permissions";
import "./ProtectedRoute.css";

interface ProtectedRouteProps {
  children: ReactNode;
  required?: Permission | "admin";
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

  // Special case for "admin" string - checks role
  if (required === "admin") {
    if (user.role !== "admin") return <Navigate to="/admin/no-permissions" replace />;
    return children;
  }

  const isAllowed = hasPermission(user, required);

  if (!isAllowed) return <Navigate to="/admin/no-permissions" replace />;

  return children;
};
