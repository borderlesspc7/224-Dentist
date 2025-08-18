import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import RegisterUser from "../pages/admin/RegisterUser/RegisterUser";
import RegisterService from "../pages/admin/RegisterService/RegisterService";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<RegisterUser />} />
        <Route path="cadastro-usuario" element={<RegisterUser />} />
        <Route path="cadastro-servico" element={<RegisterService />} />
        <Route
          path="cadastro-clientes"
          element={<div>Cadastro de Clientes (em breve)</div>}
        />
        <Route
          path="cadastro-funcionario"
          element={<div>Cadastro de Funcionário (em breve)</div>}
        />
        <Route
          path="cadastro-subcontratados"
          element={<div>Cadastro de Subcontratados (em breve)</div>}
        />
        <Route
          path="cadastro-servicos-contratados"
          element={<div>Cadastro de Serviços Contratados (em breve)</div>}
        />
        <Route
          path="cadastro-financiamentos"
          element={<div>Cadastro de Financiamentos (em breve)</div>}
        />
        <Route
          path="cadastro-veiculos"
          element={<div>Cadastro de Veículos (em breve)</div>}
        />
      </Route>
    </Routes>
  );
}
