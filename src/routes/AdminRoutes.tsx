import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import Cadastros from "../pages/admin/Cadastros/Cadastros";
import Avisos from "../pages/admin/Avisos/Avisos";
import VehicleAlert from "../pages/admin/Avisos/VehicleAlert/VehicleAlert";
import RegisterUser from "../pages/admin/RegisterUser/RegisterUser";
import RegisterService from "../pages/admin/RegisterService/RegisterService";
import RegisterClient from "../pages/admin/RegisterClient/RegisterClient";
import RegisterEmployee from "../pages/admin/RegisterEmployee/RegisterEmployee";
import RegisterSubcontractor from "../pages/admin/RegisterSubcontractor/RegisterSubcontractor";
import RegisterContractService from "../pages/admin/RegisterContractService/RegisterContractService";
import RegisterFinancing from "../pages/admin/RegisterFinancing/RegisterFinancing";
import RegisterVehicle from "../pages/admin/RegisterVehicle/RegisterVehicle";
import RegisterBankAccount from "../pages/admin/RegisterBankAccount/RegisterBankAccount";
import RegisterCreditCard from "../pages/admin/RegisterCreditCard/RegisterCreditCard";
import RegisterExpenseType from "../pages/admin/RegisterExpenseType/RegisterExpenseType";
import RegisterServicePricing from "../pages/admin/RegisterServicePricing/RegisterServicePricing";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cadastros" element={<Cadastros />} />
        <Route path="avisos" element={<Avisos />} />
        <Route path="manutencao-veiculos" element={<VehicleAlert />} />
        <Route path="cadastro-usuario" element={<RegisterUser />} />
        <Route path="cadastro-servico" element={<RegisterService />} />
        <Route path="cadastro-clientes" element={<RegisterClient />} />
        <Route path="cadastro-funcionario" element={<RegisterEmployee />} />
        <Route
          path="cadastro-subcontratados"
          element={<RegisterSubcontractor />}
        />
        <Route
          path="cadastro-servicos-contratados"
          element={<RegisterContractService />}
        />
        <Route path="cadastro-financiamentos" element={<RegisterFinancing />} />
        <Route path="cadastro-veiculos" element={<RegisterVehicle />} />
        <Route
          path="cadastro-conta-bancaria"
          element={<RegisterBankAccount />}
        />
        <Route
          path="cadastro-cartao-credito"
          element={<RegisterCreditCard />}
        />
        <Route path="cadastro-tipo-despesa" element={<RegisterExpenseType />} />
        <Route
          path="cadastro-preco-servico"
          element={<RegisterServicePricing />}
        />
      </Route>
    </Routes>
  );
}
