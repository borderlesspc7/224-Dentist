import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/ui/Sidebar/Sidebar";
import Logo from "../../components/ui/Logo/Logo";
import Header from "../../components/ui/Header/Header";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar Logo={Logo} />
      <main className="admin-content">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
