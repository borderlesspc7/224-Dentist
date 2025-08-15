import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage/LoginPage";
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
        <Route path="*" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute required="admin">
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
