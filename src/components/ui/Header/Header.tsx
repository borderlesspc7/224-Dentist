import { LogOutIcon } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import "./Header.css";
import { authService } from "../../../services/authService";

export default function Header() {
  const { user } = useAuth();

  const displayName = user?.displayName || user?.email || "User";
  const roleLabel = user?.role === "admin" ? "Administrator" : "Partial Access";
  const initials = (displayName || "U")
    .trim()
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="header-title">Admin Panel</h1>
        <p className="header-subtitle">Manage registrations and settings</p>
      </div>
      <div className="header-right">
        <div className="logout-container">
          <button
            className="logout-button"
            onClick={() => authService.logOut()}
          >
            <LogOutIcon />
          </button>
        </div>
        <div className="user-info">
          <div className="avatar" aria-hidden>
            {initials}
          </div>
          <div className="user-texts">
            <div className="user-name" title={displayName}>
              {displayName}
            </div>
            <span className={`user-role ${user?.role || "partial"}`}>
              {roleLabel}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
