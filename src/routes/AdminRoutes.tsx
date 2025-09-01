import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import RegisterUser from "../pages/admin/RegisterUser/RegisterUser";
import RegisterService from "../pages/admin/RegisterService/RegisterService";
import RegisterClient from "../pages/admin/RegisterClient/RegisterClient";
import RegisterEmployee from "../pages/admin/RegisterEmployee/RegisterEmployee";
import RegisterSubcontractor from "../pages/admin/RegisterSubcontractor/RegisterSubcontractor";
import RegisterContractService from "../pages/admin/RegisterContractService/RegisterContractService";
import RegisterFinancing from "../pages/admin/RegisterFinancing/RegisterFinancing";
import RegisterVehicle from "../pages/admin/RegisterVehicle/RegisterVehicle";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<RegisterUser />} />
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
        <Route
          path="cadastro-financiamentos"
          element={<RegisterFinancing />}
        />
        <Route
          path="cadastro-veiculos"
          element={<RegisterVehicle />}
        />
      </Route>
    </Routes>
  );
}
