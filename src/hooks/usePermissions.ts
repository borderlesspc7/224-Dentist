import { useMemo } from "react";
import { useAuth } from "./useAuth";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getUserPermissions,
  type Permission,
} from "../config/permissions";

/**
 * Hook to easily check permissions in components
 */
export function usePermissions() {
  const { user } = useAuth();

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const checkPermission = useMemo(
    () => (permission?: Permission) => hasPermission(user, permission),
    [user]
  );

  const checkAnyPermission = useMemo(
    () => (permissions: Permission[]) => hasAnyPermission(user, permissions),
    [user]
  );

  const checkAllPermissions = useMemo(
    () => (permissions: Permission[]) => hasAllPermissions(user, permissions),
    [user]
  );

  const userPermissions = useMemo(() => getUserPermissions(user), [user]);

  return {
    isAdmin,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    userPermissions,
    hasPermission: checkPermission, // Alias for convenience
  };
}

