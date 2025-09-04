import {
  LayoutDashboardIcon,
  UserPlusIcon,
  BarChart3Icon,
  SettingsIcon,
  FileTextIcon,
} from "lucide-react";

interface PathOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export const pathOptions: PathOption[] = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    value: "cadastros",
    label: "Cadastros",
    icon: <UserPlusIcon />,
  },
  {
    value: "relatorios",
    label: "Relatórios",
    icon: <BarChart3Icon />,
  },
  {
    value: "documentos",
    label: "Documentos",
    icon: <FileTextIcon />,
  },
  {
    value: "configuracoes",
    label: "Configurações",
    icon: <SettingsIcon />,
  },
];
