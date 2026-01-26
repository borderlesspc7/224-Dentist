import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import Managment from "../pages/admin/Managment/Managment";
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
import ProjectAlert from "../pages/admin/Avisos/ProjectAlert/ProjectAlert";
import ClientAlert from "../pages/admin/Avisos/ClientAlert/ClientAlert";
import SubcontractorAlert from "../pages/admin/Avisos/SubcontractorAlert/SubcontractorAlert";
import ContractedServiceAlert from "../pages/admin/Avisos/ContractedServiceAlert/ContractedServiceAlert";
import Users from "../pages/admin/User/User";
import Reports from "../pages/admin/Reports/Reports";
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import NoPermissions from "../pages/admin/NoPermissions/NoPermissions";
import Audit from "../pages/admin/Audit/Audit";
import { ProtectedRoute } from "./ProtectedRoute";
import { PERMISSIONS } from "../config/permissions";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<ProtectedRoute required={PERMISSIONS.DASHBOARD}><Dashboard /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute required={PERMISSIONS.DASHBOARD}><Dashboard /></ProtectedRoute>} />
        <Route path="no-permissions" element={<NoPermissions />} />
        <Route path="managment" element={<ProtectedRoute required={PERMISSIONS.MANAGEMENT}><Managment /></ProtectedRoute>} />
        <Route path="cadastros" element={<ProtectedRoute required={PERMISSIONS.CADASTROS}><Cadastros /></ProtectedRoute>} />
        <Route path="avisos" element={<ProtectedRoute required={PERMISSIONS.ALERTS}><Avisos /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute required={PERMISSIONS.USERS}><Users /></ProtectedRoute>} />
        <Route path="relatorios" element={<ProtectedRoute required={PERMISSIONS.REPORTS}><Reports /></ProtectedRoute>} />
        <Route path="audit" element={<ProtectedRoute required={PERMISSIONS.AUDIT}><Audit /></ProtectedRoute>} />
        <Route path="manutencao-veiculos" element={<ProtectedRoute required={PERMISSIONS.ALERT_VEHICLE}><VehicleAlert /></ProtectedRoute>} />

        <Route path="termino-projeto" element={<ProtectedRoute required={PERMISSIONS.ALERT_PROJECT}><ProjectAlert /></ProtectedRoute>} />
        <Route
          path="pagamento-subcontratados"
          element={<ProtectedRoute required={PERMISSIONS.ALERT_SUBCONTRACTOR}><SubcontractorAlert /></ProtectedRoute>}
        />
        <Route path="recebimento-cliente" element={<ProtectedRoute required={PERMISSIONS.ALERT_CLIENT}><ClientAlert /></ProtectedRoute>} />
        <Route
          path="pagamento-servicos-contratados"
          element={<ProtectedRoute required={PERMISSIONS.ALERT_CONTRACT_SERVICE}><ContractedServiceAlert /></ProtectedRoute>}
        />

        <Route path="cadastro-usuario" element={<ProtectedRoute required={PERMISSIONS.REGISTER_USER}><RegisterUser /></ProtectedRoute>} />
        <Route path="cadastro-servico" element={<ProtectedRoute required={PERMISSIONS.REGISTER_SERVICE}><RegisterService /></ProtectedRoute>} />
        <Route path="cadastro-clientes" element={<ProtectedRoute required={PERMISSIONS.REGISTER_CLIENT}><RegisterClient /></ProtectedRoute>} />
        <Route path="cadastro-funcionario" element={<ProtectedRoute required={PERMISSIONS.REGISTER_EMPLOYEE}><RegisterEmployee /></ProtectedRoute>} />
        <Route
          path="cadastro-subcontratados"
          element={<ProtectedRoute required={PERMISSIONS.REGISTER_SUBCONTRACTOR}><RegisterSubcontractor /></ProtectedRoute>}
        />
        <Route
          path="cadastro-servicos-contratados"
          element={<ProtectedRoute required={PERMISSIONS.REGISTER_CONTRACT_SERVICE}><RegisterContractService /></ProtectedRoute>}
        />
        <Route path="cadastro-financiamentos" element={<ProtectedRoute required={PERMISSIONS.REGISTER_FINANCING}><RegisterFinancing /></ProtectedRoute>} />
        <Route path="cadastro-veiculos" element={<ProtectedRoute required={PERMISSIONS.REGISTER_VEHICLE}><RegisterVehicle /></ProtectedRoute>} />
        <Route
          path="cadastro-conta-bancaria"
          element={<ProtectedRoute required={PERMISSIONS.REGISTER_BANK_ACCOUNT}><RegisterBankAccount /></ProtectedRoute>}
        />
        <Route
          path="cadastro-cartao-credito"
          element={<ProtectedRoute required={PERMISSIONS.REGISTER_CREDIT_CARD}><RegisterCreditCard /></ProtectedRoute>}
        />
        <Route path="cadastro-tipo-despesa" element={<ProtectedRoute required={PERMISSIONS.REGISTER_EXPENSE_TYPE}><RegisterExpenseType /></ProtectedRoute>} />
        <Route
          path="cadastro-preco-servico"
          element={<ProtectedRoute required={PERMISSIONS.REGISTER_SERVICE_PRICING}><RegisterServicePricing /></ProtectedRoute>}
        />
      </Route>
    </Routes>
  );
}
