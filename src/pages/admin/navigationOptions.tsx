import {
  ServerIcon,
  UserPlusIcon,
  UsersIcon,
  CreditCardIcon,
  CarIcon,
  LayoutDashboardIcon,
  HomeIcon,
  WalletIcon,
  FileTextIcon,
  DollarSignIcon,
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
  {
    value: "cadastro-conta-bancaria",
    label: "Register Bank Account",
    icon: <HomeIcon />,
  },
  {
    value: "cadastro-cartao-credito",
    label: "Register Credit Card",
    icon: <WalletIcon />,
  },
  {
    value: "cadastro-tipo-despesa",
    label: "Register Expense Type",
    icon: <FileTextIcon />,
  },
  {
    value: "cadastro-preco-servico",
    label: "Register Service Pricing",
    icon: <DollarSignIcon />,
  },
];
