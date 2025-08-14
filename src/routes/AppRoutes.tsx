import { BrowserRouter, Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage/LoginPage";

export default function AppRoutes() {
  function Register() {
    return <div>Register</div>;
  }
  function Menu() {
    return <div>Menu</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<LoginPage />} />
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.register} element={<Register />} />
        <Route path="*" element={<LoginPage />} />
        <Route
          path={paths.menu}
          element={
            <ProtectedRoute required={paths.menu}>
              <Menu />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
