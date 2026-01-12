import { PERMISSIONS, type Permission } from "./permissions";

/**
 * Pre-defined permission templates for common user roles
 * These can be used to quickly assign permissions when creating users
 */

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export const PERMISSION_TEMPLATES: PermissionTemplate[] = [
  {
    id: "admin",
    name: "Administrador Geral",
    description: "Acesso completo a todas as funcionalidades do sistema",
    permissions: [], // Admin role grants all permissions automatically
  },
  {
    id: "manager",
    name: "Gerente de Projetos",
    description: "Gerenciamento de projetos, clientes e relatórios",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.MANAGEMENT,
      PERMISSIONS.REPORTS,
      PERMISSIONS.CADASTROS,
      PERMISSIONS.REGISTER_CLIENT,
      PERMISSIONS.REGISTER_SERVICE,
      PERMISSIONS.ALERTS,
      PERMISSIONS.ALERT_PROJECT,
      PERMISSIONS.ALERT_CLIENT,
    ],
  },
  {
    id: "financial",
    name: "Financeiro",
    description: "Gestão financeira, contas bancárias e despesas",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.REPORTS,
      PERMISSIONS.CADASTROS,
      PERMISSIONS.REGISTER_BANK_ACCOUNT,
      PERMISSIONS.REGISTER_CREDIT_CARD,
      PERMISSIONS.REGISTER_EXPENSE_TYPE,
      PERMISSIONS.REGISTER_FINANCING,
      PERMISSIONS.ALERTS,
      PERMISSIONS.ALERT_SUBCONTRACTOR,
      PERMISSIONS.ALERT_CONTRACT_SERVICE,
    ],
  },
  {
    id: "hr",
    name: "Recursos Humanos",
    description: "Gestão de funcionários e veículos",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.CADASTROS,
      PERMISSIONS.REGISTER_EMPLOYEE,
      PERMISSIONS.REGISTER_VEHICLE,
      PERMISSIONS.ALERTS,
      PERMISSIONS.ALERT_VEHICLE,
    ],
  },
  {
    id: "operations",
    name: "Operacional",
    description: "Cadastros básicos e operações do dia a dia",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.CADASTROS,
      PERMISSIONS.REGISTER_CLIENT,
      PERMISSIONS.REGISTER_EMPLOYEE,
      PERMISSIONS.REGISTER_SERVICE,
      PERMISSIONS.REGISTER_SUBCONTRACTOR,
      PERMISSIONS.REGISTER_CONTRACT_SERVICE,
      PERMISSIONS.ALERTS,
    ],
  },
  {
    id: "support",
    name: "Atendimento/Suporte",
    description: "Visualização de avisos e informações básicas",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.ALERTS,
      PERMISSIONS.ALERT_CLIENT,
      PERMISSIONS.ALERT_PROJECT,
    ],
  },
  {
    id: "readonly",
    name: "Apenas Leitura",
    description: "Visualização de dashboard e relatórios sem edição",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.REPORTS,
    ],
  },
  {
    id: "data_entry",
    name: "Cadastrador",
    description: "Apenas cadastros básicos de clientes e serviços",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.CADASTROS,
      PERMISSIONS.REGISTER_CLIENT,
      PERMISSIONS.REGISTER_SERVICE,
    ],
  },
];

/**
 * Get a template by its ID
 */
export function getTemplateById(id: string): PermissionTemplate | undefined {
  return PERMISSION_TEMPLATES.find((template) => template.id === id);
}

/**
 * Get all template IDs and names for selection UI
 */
export function getTemplateOptions() {
  return PERMISSION_TEMPLATES.map((template) => ({
    value: template.id,
    label: template.name,
  }));
}

/**
 * Apply a template to get its permissions
 */
export function applyTemplate(templateId: string): Permission[] {
  const template = getTemplateById(templateId);
  return template ? template.permissions : [];
}

