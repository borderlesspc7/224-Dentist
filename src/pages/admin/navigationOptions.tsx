import {
  LayoutDashboardIcon,
  UserPlusIcon,
  BarChart3Icon,
  UserIcon,
  BellIcon,
  FilesIcon,
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
    value: "Managment",
    label: "Managment",
    icon: <FilesIcon />,
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
    value: "users/",
    label: "Users",
    icon: <UserIcon />,
  },
  {
    value: "relatorios",
    label: "Reports",
    icon: <BarChart3Icon />,
  },
];
