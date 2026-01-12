import type { UserProfile } from "../types/user";

/**
 * Define all available permissions in the system
 * Each permission corresponds to a specific feature or route
 */
export const PERMISSIONS = {
  // Dashboard and Overview
  DASHBOARD: "dashboard",
  MANAGEMENT: "management",
  REPORTS: "reports",

  // Registration Pages
  CADASTROS: "cadastros",
  REGISTER_USER: "cadastro-usuario",
  REGISTER_SERVICE: "cadastro-servico",
  REGISTER_CLIENT: "cadastro-clientes",
  REGISTER_EMPLOYEE: "cadastro-funcionario",
  REGISTER_SUBCONTRACTOR: "cadastro-subcontratados",
  REGISTER_CONTRACT_SERVICE: "cadastro-servicos-contratados",
  REGISTER_FINANCING: "cadastro-financiamentos",
  REGISTER_VEHICLE: "cadastro-veiculos",
  REGISTER_BANK_ACCOUNT: "cadastro-conta-bancaria",
  REGISTER_CREDIT_CARD: "cadastro-cartao-credito",
  REGISTER_EXPENSE_TYPE: "cadastro-tipo-despesa",
  REGISTER_SERVICE_PRICING: "cadastro-preco-servico",

  // Alerts
  ALERTS: "avisos",
  ALERT_VEHICLE: "manutencao-veiculos",
  ALERT_PROJECT: "termino-projeto",
  ALERT_SUBCONTRACTOR: "pagamento-subcontratados",
  ALERT_CLIENT: "recebimento-cliente",
  ALERT_CONTRACT_SERVICE: "pagamento-servicos-contratados",

  // Users Management
  USERS: "users",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Permission labels for UI display
 */
export const PERMISSION_LABELS: Record<Permission, string> = {
  [PERMISSIONS.DASHBOARD]: "Dashboard",
  [PERMISSIONS.MANAGEMENT]: "Gerenciamento",
  [PERMISSIONS.REPORTS]: "Relatórios",
  [PERMISSIONS.CADASTROS]: "Página de Cadastros",
  [PERMISSIONS.REGISTER_USER]: "Cadastro de Usuários",
  [PERMISSIONS.REGISTER_SERVICE]: "Cadastro de Serviços",
  [PERMISSIONS.REGISTER_CLIENT]: "Cadastro de Clientes",
  [PERMISSIONS.REGISTER_EMPLOYEE]: "Cadastro de Funcionários",
  [PERMISSIONS.REGISTER_SUBCONTRACTOR]: "Cadastro de Subcontratados",
  [PERMISSIONS.REGISTER_CONTRACT_SERVICE]: "Cadastro de Serviços Contratados",
  [PERMISSIONS.REGISTER_FINANCING]: "Cadastro de Financiamentos",
  [PERMISSIONS.REGISTER_VEHICLE]: "Cadastro de Veículos",
  [PERMISSIONS.REGISTER_BANK_ACCOUNT]: "Cadastro de Contas Bancárias",
  [PERMISSIONS.REGISTER_CREDIT_CARD]: "Cadastro de Cartões de Crédito",
  [PERMISSIONS.REGISTER_EXPENSE_TYPE]: "Cadastro de Tipos de Despesa",
  [PERMISSIONS.REGISTER_SERVICE_PRICING]: "Cadastro de Preços de Serviços",
  [PERMISSIONS.ALERTS]: "Página de Avisos",
  [PERMISSIONS.ALERT_VEHICLE]: "Alerta de Manutenção de Veículos",
  [PERMISSIONS.ALERT_PROJECT]: "Alerta de Término de Projeto",
  [PERMISSIONS.ALERT_SUBCONTRACTOR]: "Alerta de Pagamento de Subcontratados",
  [PERMISSIONS.ALERT_CLIENT]: "Alerta de Recebimento de Cliente",
  [PERMISSIONS.ALERT_CONTRACT_SERVICE]:
    "Alerta de Pagamento de Serviços Contratados",
  [PERMISSIONS.USERS]: "Gerenciamento de Usuários",
};

/**
 * Groups permissions by category for better UI organization
 */
export const PERMISSION_GROUPS = [
  {
    id: "overview",
    name: "Visão Geral",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.MANAGEMENT,
      PERMISSIONS.REPORTS,
    ],
  },
  {
    id: "registration",
    name: "Cadastros",
    permissions: [
      PERMISSIONS.CADASTROS,
      PERMISSIONS.REGISTER_USER,
      PERMISSIONS.REGISTER_SERVICE,
      PERMISSIONS.REGISTER_CLIENT,
      PERMISSIONS.REGISTER_EMPLOYEE,
      PERMISSIONS.REGISTER_SUBCONTRACTOR,
      PERMISSIONS.REGISTER_CONTRACT_SERVICE,
      PERMISSIONS.REGISTER_FINANCING,
      PERMISSIONS.REGISTER_VEHICLE,
      PERMISSIONS.REGISTER_BANK_ACCOUNT,
      PERMISSIONS.REGISTER_CREDIT_CARD,
      PERMISSIONS.REGISTER_EXPENSE_TYPE,
      PERMISSIONS.REGISTER_SERVICE_PRICING,
    ],
  },
  {
    id: "alerts",
    name: "Avisos e Alertas",
    permissions: [
      PERMISSIONS.ALERTS,
      PERMISSIONS.ALERT_VEHICLE,
      PERMISSIONS.ALERT_PROJECT,
      PERMISSIONS.ALERT_SUBCONTRACTOR,
      PERMISSIONS.ALERT_CLIENT,
      PERMISSIONS.ALERT_CONTRACT_SERVICE,
    ],
  },
  {
    id: "users",
    name: "Usuários",
    permissions: [PERMISSIONS.USERS],
  },
];

/**
 * Verifies if a user has access to a specific permission
 */
export function hasPermission(
  user: UserProfile | null,
  permission?: Permission
): boolean {
  if (!permission) return true; // No permission required
  if (!user) return false; // Not authenticated
  if (user.role === "admin") return true; // Admin has all permissions

  // Check if user's allowed paths include the permission
  return !!user.allowedPaths?.includes(permission);
}

/**
 * Verifies if a user has access to ANY of the specified permissions
 */
export function hasAnyPermission(
  user: UserProfile | null,
  permissions: Permission[]
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;

  return permissions.some((permission) =>
    user.allowedPaths?.includes(permission)
  );
}

/**
 * Verifies if a user has access to ALL of the specified permissions
 */
export function hasAllPermissions(
  user: UserProfile | null,
  permissions: Permission[]
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;

  return permissions.every((permission) =>
    user.allowedPaths?.includes(permission)
  );
}

/**
 * Gets all available permissions as an array
 */
export function getAllPermissions(): Permission[] {
  return Object.values(PERMISSIONS);
}

/**
 * Gets user's granted permissions
 */
export function getUserPermissions(user: UserProfile | null): Permission[] {
  if (!user) return [];
  if (user.role === "admin") return getAllPermissions();
  return (user.allowedPaths || []) as Permission[];
}
