"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiUser, FiShield } from "react-icons/fi";
import Input from "../../../components/ui/Input/Input";
import MultiSelect from "../../../components/ui/MultiSelect/MultiSelect";
import Button from "../../../components/ui/Button/Button";
import { pathOptions } from "../navigationOptions";
import "../../../styles/forms.css";
import "./RegisterUser.css";
import { authService } from "../../../services/authService";
import { userService } from "../../../services/userService";
import type { RegisterCredentials } from "../../../types/user";

interface FormData {
  email: string;
  password: string;
  displayName: string;
  role: "partial" | "admin";
  allowedPaths: string[];
}

interface FormErrors {
  email?: string;
  password?: string;
  displayName?: string;
  allowedPaths?: string;
  submit?: string;
}

const RegisterUserPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    displayName: "",
    role: "partial",
    allowedPaths: [],
  });

  // Path options for MultiSelect (without icons)
  const pathOptionsForForm = pathOptions.map(({ value, label }) => ({
    value,
    label,
  }));

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  // Load user data when in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      setLoadingUser(true);
      userService.getUserById(editId)
        .then((user) => {
          if (user) {
            setFormData({
              email: user.email || "",
              password: "", // Don't load password
              displayName: user.displayName || "",
              role: user.role as "partial" | "admin" || "partial",
              allowedPaths: user.allowedPaths || [],
            });
          }
        })
        .catch((error) => {
          console.error("Error loading user:", error);
          setErrors({ submit: "Erro ao carregar dados do usuário" });
        })
        .finally(() => {
          setLoadingUser(false);
        });
    }
  }, [isEditMode, editId]);
  const [successMessage, setSuccessMessage] = useState("");
  const isAdmin = formData.role === "admin";

  // Handle input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | string[]
  ) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Clear allowedPaths when role changes to admin
      if (field === "role" && value === "admin") {
        newData.allowedPaths = [];
      }

      return newData;
    });

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Only validate password for new users
    if (!isEditMode && !formData.password) {
      newErrors.password = "Password is required";
    } else if (!isEditMode && formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.displayName) {
      newErrors.displayName = "Display name is required";
    }

    // Only validate allowedPaths for non-admin users
    if (formData.role === "partial" && formData.allowedPaths.length === 0) {
      newErrors.allowedPaths = "Please select at least one allowed path";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage("");
    setErrors({});

    try {
      if (isEditMode && editId) {
        // Update existing user
        await userService.updateUser(editId, {
          email: formData.email,
          displayName: formData.displayName,
          role: formData.role,
          allowedPaths: formData.allowedPaths,
        });
        setSuccessMessage("Usuário atualizado com sucesso!");
      } else {
        // Create new user
        const newUser: RegisterCredentials = {
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          role: formData.role,
          allowedPaths: formData.allowedPaths,
        };

        await authService.register(newUser);
        setSuccessMessage("Usuário criado com sucesso!");
      }

      // Limpar o formulário apenas se não estiver editando
      if (!isEditMode) {
        setFormData({
          email: "",
          password: "",
          displayName: "",
          role: "partial",
          allowedPaths: [],
        });
      }
      setErrors({});

      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrors({
        submit:
          "Failed to create user: " +
          (error instanceof Error ? error.message : String(error)),
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      email: "",
      password: "",
      displayName: "",
      role: "partial",
      allowedPaths: [],
    });
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="form-page-content">
      <div className="content-header">
        <h1 className="page-title">
          {isEditMode ? "Edit User" : "Create New User"}
        </h1>
        <p className="page-subtitle">
          {isEditMode
            ? "Update user information and permissions"
            : "Add a new user to the system with specific permissions and access rights"
          }
        </p>
      </div>

      <div className={`form-container ${loading || loadingUser ? "form-loading" : ""}`}>
        {/* Loading Message */}
        {loadingUser && (
          <div className="status-message info-message">Carregando dados do usuário...</div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="status-message success-message">{successMessage}</div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="status-message error-message">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit} className="modern-form">
          {/* User Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FiUser className="section-icon" />
              User Information
            </h3>
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e)}
              placeholder="user@company.com"
              error={errors.email}
              required
              disabled={loading}
            />
            <div className="form-row">
              <Input
                label="Display Name"
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange("displayName", e)}
                placeholder="John Doe"
                error={errors.displayName}
                required
                disabled={loading}
              />
              <Input
                label={isEditMode ? "New Password (optional)" : "Password"}
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e)}
                placeholder={isEditMode ? "Leave empty to keep current password" : "Enter secure password"}
                error={errors.password}
                required={!isEditMode}
                disabled={loading}
              />
            </div>
          </div>

          {/* Role and Permissions Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FiShield className="section-icon" />
              Role & Permissions
            </h3>
            <div className="form-group">
              <label className="form-label">
                User Role <span className="required">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  handleInputChange(
                    "role",
                    e.target.value as "partial" | "admin"
                  )
                }
                className="role-select"
                disabled={loading}
              >
                <option value="partial">Partial Access User</option>
                <option value="admin">Administrator</option>
              </select>
              <small className="form-help-text">
                {isAdmin
                  ? "Administrators have full access to all system features"
                  : "Partial access users can only access selected pages"}
              </small>
            </div>

            {!isAdmin && (
              <MultiSelect
                label="Allowed Pages"
                options={pathOptionsForForm}
                value={formData.allowedPaths}
                onChange={(value) => handleInputChange("allowedPaths", value)}
                placeholder="Select which pages this user can access..."
                error={errors.allowedPaths}
                required={!isAdmin}
                disabled={isAdmin || loading}
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={loading || loadingUser}>
              {loading
                ? (isEditMode ? "Updating User..." : "Creating User...")
                : (isEditMode ? "Update User" : "Create User")
              }
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserPage;
