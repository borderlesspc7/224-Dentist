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
    label: "Cadastro de Usuário",
    icon: <UserPlusIcon />,
  },
  {
    value: "cadastro-servico",
    label: "Cadastro de Serviço",
    icon: <ServerIcon />,
  },
  {
    value: "cadastro-clientes",
    label: "Cadastro de Clientes",
    icon: <UsersIcon />,
  },
  {
    value: "cadastro-funcionario",
    label: "Cadastro de Funcionário",
    icon: <UserPlusIcon />,
  },
  {
    value: "cadastro-subcontratados",
    label: "Cadastro de Subcontratados",
    icon: <UserPlusIcon />,
  },
  {
    value: "cadastro-servicos-contratados",
    label: "Cadastro de Serviços Contratados",
    icon: <ServerIcon />,
  },
  {
    value: "cadastro-financiamentos",
    label: "Cadastro de Financiamentos",
    icon: <CreditCardIcon />,
  },
  {
    value: "cadastro-veiculos",
    label: "Cadastro de Veículos",
    icon: <CarIcon />,
  },
];
