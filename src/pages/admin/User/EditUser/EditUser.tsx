import "./EditUser.css";
import type { UserProfile } from "../../../../types/user";
import { useState, useEffect, useMemo } from "react";

type EditableUser = UserProfile & {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type FormErrors = {
  displayName?: string;
  email?: string;
};

type formState = {
  displayName: string;
  role: "admin" | "partial";
  allowedPaths: string[];
  email: string;
};

interface EditUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: EditableUser | null;
  onSave: (updates: Partial<EditableUser>) => Promise<void> | void;
}

export default function EditUser({
  isOpen,
  onClose,
  user,
  onSave,
}: EditUserProps) {
  const initialForm = useMemo<formState>(
    () => ({
      displayName: user?.displayName ?? "",
      role: user?.role ?? "partial",
      allowedPaths: user?.allowedPaths ?? [],
      email: user?.email ?? "",
    }),
    [user]
  );

  const [form, setForm] = useState<formState>(initialForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(initialForm);
    setErrors({});
  }, [initialForm]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const validate = () => {
    const next: FormErrors = {};

    if (!form.displayName.trim()) next.displayName = "Provide the name";
    if (!form.email?.trim()) next.email = "Provide the email";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleChange =
    <K extends keyof formState>(key: K) =>
    (value: formState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      await onSave({
        displayName: form.displayName,
        email: form.email,
        role: form.role,
        allowedPaths: form.allowedPaths,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="edit-modal-overlay" onClick={handleBackdropClick}>
      <div
        className="edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
      >
        <div className="edit-modal-header">
          <h3 id="edit-user-title">Edit User</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>

        <form className="edit-modal-body" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="displayName" className="form-label">
              Name
            </label>
            <div className="form-field">
              <input
                type="text"
                id="displayName"
                value={form.displayName}
                onChange={(e) => handleChange("displayName")(e.target.value)}
                placeholder="User name"
              />
              {errors.displayName && (
                <span className="error-text">{errors.displayName}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="form-field">
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email")(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="role" className="form-label">
              Profile
            </label>
            <div className="form-field">
              <select
                id="role"
                value={form.role}
                onChange={(e) =>
                  handleChange("role")(e.target.value as "admin" | "partial")
                }
              >
                <option value="admin">Admin</option>
                <option value="partial">Partial</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Permissions</label>
            <div className="form-field">
              <textarea
                rows={3}
                placeholder="Enter allowed paths (comma-separated)"
                value={form.allowedPaths.join(", ")}
                onChange={(e) =>
                  handleChange("allowedPaths")(
                    e.target.value
                      .split(",")
                      .map((p) => p.trim())
                      .filter(Boolean)
                  )
                }
              />
              <span className="hint-text">
                Let empty for "No permissions". If profile is Admin, will be
                "Full access".
              </span>
            </div>
          </div>

          <div className="edit-modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
