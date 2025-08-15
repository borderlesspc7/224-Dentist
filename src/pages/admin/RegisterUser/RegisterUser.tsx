"use client";

import type React from "react";

import { useState } from "react";
import Input from "../../../components/ui/Input/Input";
import MultiSelect from "../../../components/ui/MultiSelect/MultiSelect";
import Button from "../../../components/ui/Button/Button";
import { pathOptions } from "./navigationOptions";
import "./RegisterUser.css";

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
}

const RegisterUserPage: React.FC = () => {
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

  // Handle input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.displayName) {
      newErrors.displayName = "Display name is required";
    }

    if (formData.allowedPaths.length === 0) {
      newErrors.allowedPaths = "Please select at least one allowed path";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("User data to save:", formData);
      alert(
        "User created successfully! (This will be integrated with backend)"
      );
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
  };

  return (
    <div className="register-user-content">
      <div className="content-header">
        <h1 className="page-title">Create New User</h1>
        <p className="page-subtitle">
          Add a new user to the system with specific permissions and access
          rights.
        </p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="user-form">
          {/* Email Field */}
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e)}
            placeholder="user@company.com"
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e)}
            placeholder="Enter secure password"
            error={errors.password}
            required
          />

          <Input
            label="Display Name"
            type="text"
            value={formData.displayName}
            onChange={(e) => handleInputChange("displayName", e)}
            placeholder="John Doe"
            error={errors.displayName}
            required
          />

          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">
              Role <span className="required">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                handleInputChange("role", e.target.value as "partial" | "admin")
              }
              className="role-select"
            >
              <option value="partial">Partial Access</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Allowed Paths Multi-Select */}
          <MultiSelect
            label="Allowed Paths"
            options={pathOptionsForForm}
            value={formData.allowedPaths}
            onChange={(value) => handleInputChange("allowedPaths", value)}
            placeholder="Select accessible pages..."
            error={errors.allowedPaths}
            required
          />

          {/* Form Actions */}
          <div className="form-actions">
            <Button type="submit" variant="primary">
              Save User
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserPage;
