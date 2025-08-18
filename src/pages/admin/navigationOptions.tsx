import {
  ServerIcon,
  UserPlusIcon,
  UsersIcon,
  CreditCardIcon,
  CarIcon,
} from "lucide-react";

interface PathOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export const pathOptions: PathOption[] = [
  {
    value: "cadastro-usuario",
    label: "Register User",
    icon: <UserPlusIcon />,
  },
  {
    value: "cadastro-servico",
    label: "Register Service",
    icon: <ServerIcon />,
  },
  {
    value: "cadastro-clientes",
    label: "Register Clients",
    icon: <UsersIcon />,
  },
  {
    value: "cadastro-funcionario",
    label: "Register Employee",
    icon: <UserPlusIcon />,
  },
  {
    value: "cadastro-subcontratados",
    label: "Register Subcontractors",
    icon: <UserPlusIcon />,
  },
  {
    value: "cadastro-servicos-contratados",
    label: "Register Contract Services",
    icon: <ServerIcon />,
  },
  {
    value: "cadastro-financiamentos",
    label: "Register Financings",
    icon: <CreditCardIcon />,
  },
  {
    value: "cadastro-veiculos",
    label: "Register Vehicles",
    icon: <CarIcon />,
  },
];
