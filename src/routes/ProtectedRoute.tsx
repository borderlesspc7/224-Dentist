import type { ReactNode } from "react";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { hasAccess } from "./permissions";

interface ProtectedRouteProps {
  children: ReactNode;
  required?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  required,
}) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  const isAllowed = hasAccess(user, required);

  if (!isAllowed) return <Navigate to="/" replace />;

  return children;
};
