import {
  LayoutDashboardIcon,
  UserPlusIcon,
  BarChart3Icon,
  UserIcon,
  BellIcon,
  FilesIcon,
} from "lucide-react";
import { PERMISSIONS, type Permission } from "../../config/permissions";

interface PathOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  permission?: Permission;
}

export const pathOptions: PathOption[] = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
    permission: PERMISSIONS.DASHBOARD,
  },
  {
    value: "Managment",
    label: "Managment",
    icon: <FilesIcon />,
    permission: PERMISSIONS.MANAGEMENT,
  },
  {
    value: "cadastros",
    label: "Registration",
    icon: <UserPlusIcon />,
    permission: PERMISSIONS.CADASTROS,
  },
  {
    value: "avisos",
    label: "Alerts",
    icon: <BellIcon />,
    permission: PERMISSIONS.ALERTS,
  },
  {
    value: "users/",
    label: "Users",
    icon: <UserIcon />,
    permission: PERMISSIONS.USERS,
  },
  {
    value: "relatorios",
    label: "Reports",
    icon: <BarChart3Icon />,
    permission: PERMISSIONS.REPORTS,
  },
];
