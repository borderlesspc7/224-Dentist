import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import LoginPage from "../pages/LoginPage/LoginPage";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import AdminRoutes from "./AdminRoutes";

export default function AppRoutes() {
  function Register() {
    return <div>Register</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<LoginPage />} />
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.register} element={<Register />} />
        <Route path={paths.forgotPassword} element={<ForgotPassword />} />
        <Route path="*" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
