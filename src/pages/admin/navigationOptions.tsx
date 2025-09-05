import {
  LayoutDashboardIcon,
  UserPlusIcon,
  BarChart3Icon,
  SettingsIcon,
  FileTextIcon,
  BellIcon,
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
    label: "Registration",
    icon: <UserPlusIcon />,
  },
  {
    value: "avisos",
    label: "Alerts",
    icon: <BellIcon />,
  },
  {
    value: "relatorios",
    label: "Reports",
    icon: <BarChart3Icon />,
  },
  {
    value: "documentos",
    label: "Documents",
    icon: <FileTextIcon />,
  },
  {
    value: "configuracoes",
    label: "Settings",
    icon: <SettingsIcon />,
  },
];
