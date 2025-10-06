import "./ViewUser.css";
import type { UserProfile } from "../../../../types/user";
import { useEffect } from "react";
import { FiCopy } from "react-icons/fi";

type UserWithDates = UserProfile & {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
};

interface ViewUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithDates;
}

const getInitials = (name?: string) => {
  return name
    ?.split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
};

const formatedDate = (date?: Date) =>
  date ? date.toLocaleDateString("pt-BR") : "-";

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Erro ao copiar texto:", error);
  }
};

export default function ViewUser({ isOpen, onClose, user }: ViewUserProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="view-modal-overlay" onClick={handleBackdropClick}>
      <div
        className="view-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-user-title"
      >
        <div className="view-modal-header">
          <div className="avatar">{getInitials(user.displayName)}</div>

          <div className="title-wrap">
            <h3 id="view-user-title">{user.displayName || "No name"}</h3>
            <p className="subtitle" title={user.email}>
              {user.email}
            </p>
          </div>

          <span className={`role-chip ${user.role}`}>
            {user.role === "admin" ? "Admin" : "Partial"}
          </span>

          <button className="close-btn" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>

        <div className="view-modal-body">
          <div className="info-grid">
            <div className="info-card">
              <h4 className="card-title">Profile</h4>
              <div className="info-row">
                <span className="info-label">Name</span>
                <span className="info-value">{user.displayName || "-"}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value" title={user.email}>
                  {user.email}
                  <button className="copy-btn" onClick={() => copy(user.email)}>
                    <FiCopy />
                  </button>
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">UID</span>
                <span className="info-value" title={user.uid}>
                  {user.uid}
                </span>
              </div>
            </div>

            <div className="info-card">
              <h4 className="card-title">Permissions</h4>
              {user.role !== "admin" &&
                (!user.allowedPaths || user.allowedPaths.length === 0) && (
                  <div className="info-row">
                    <span className="info-label">Permissions</span>
                    <span className="info-value">No permissions</span>
                  </div>
                )}

              {user.role === "admin" && (
                <div className="info-row">
                  <span className="info-label">Permissions</span>
                  <span className="info-value">Full access</span>
                </div>
              )}

              {user.allowedPaths && user.allowedPaths.length > 0 && (
                <div className="permissions">
                  {user.allowedPaths.map((p) => (
                    <span key={p} className="permission-pill">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="info-card">
              <h4 className="card-title">Dates</h4>

              <div className="info-row">
                <span className="info-label">Created At</span>
                <span className="info-value">
                  {formatedDate(user.createdAt)}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Updated At</span>
                <span className="info-value">
                  {formatedDate(user.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="view-modal-footer">
          <button className="btn secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
