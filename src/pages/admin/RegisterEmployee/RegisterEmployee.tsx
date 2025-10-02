"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiUser, FiFileText, FiAlertCircle } from "react-icons/fi";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import "../../../styles/forms.css";
import "./RegisterEmployee.css";
import type { CreateEmployeeData } from "../../../types/employee";
import { employeeService } from "../../../services/employeeService";

interface FormErrors {
  name?: string;
  address?: string;
  itinNumber?: string;
  driverLicenseNumber?: string;
  driverLicenseDocument?: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  submit?: string;
}

const RegisterEmployeePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  const [formData, setFormData] = useState<CreateEmployeeData>({
    name: "",
    address: "",
    itinNumber: "",
    driverLicenseNumber: "",
    phone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Load employee data when in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      setLoadingEmployee(true);
      employeeService
        .getEmployeeById(editId)
        .then((employee) => {
          if (employee) {
            setFormData({
              name: employee.name || "",
              address: employee.address || "",
              itinNumber: employee.itinNumber || "",
              driverLicenseNumber: employee.driverLicenseNumber || "",
              phone: employee.phone || "",
              emergencyContactName: employee.emergencyContactName || "",
              emergencyContactPhone: employee.emergencyContactPhone || "",
              emergencyContactRelationship:
                employee.emergencyContactRelationship || "",
            });
          }
        })
        .catch((error) => {
          console.error("Error loading employee:", error);
          setErrors({ submit: "Erro ao carregar dados do funcionário" });
        })
        .finally(() => {
          setLoadingEmployee(false);
        });
    }
  }, [isEditMode, editId]);

  const handleInputChange = (
    field: keyof CreateEmployeeData,
    value: string
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

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        driverLicenseDocument: file,
      }));
    }

    // Clear file error when user selects a file
    if (errors.driverLicenseDocument) {
      setErrors((prev) => ({
        ...prev,
        driverLicenseDocument: "",
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({
        ...prev,
        driverLicenseDocument: file,
      }));
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      driverLicenseDocument: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.itinNumber.trim()) {
      newErrors.itinNumber = "ITIN Number is required";
    }

    if (!formData.driverLicenseNumber.trim()) {
      newErrors.driverLicenseNumber = "Driver License Number is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = "Emergency Contact Name is required";
    }

    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = "Emergency Contact Phone is required";
    }

    if (!formData.emergencyContactRelationship.trim()) {
      newErrors.emergencyContactRelationship = "Relationship is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrors({});

    try {
      console.log("Employee data to save:", formData);

      if (isEditMode && editId) {
        // Update existing employee
        await employeeService.updateEmployee(editId, formData);
        setSuccessMessage("Employee updated successfully!");
      } else {
        // Create new employee
        await employeeService.createEmployee(formData);
        setSuccessMessage("Employee registered successfully!");

        // Clear the form but keep the success message
        setFormData({
          name: "",
          address: "",
          itinNumber: "",
          driverLicenseNumber: "",
          phone: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          emergencyContactRelationship: "",
        });
        setErrors({});
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrors({
        submit:
          `Failed to ${isEditMode ? "update" : "register"} employee: ` +
          (error instanceof Error ? error.message : String(error)),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      address: "",
      itinNumber: "",
      driverLicenseNumber: "",
      phone: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
    });
    setErrors({});
    setSuccessMessage("");
    setLoadingEmployee(false);
  };

  return (
    <div className="form-page-content">
      <div className="content-header">
        <h1 className="page-title">
          {isEditMode ? "Edit Employee" : "Register Employee"}
        </h1>
        <p className="page-subtitle">
          {isEditMode
            ? "Update employee profile with personal details and emergency contact information"
            : "Create a new employee profile with personal details and emergency contact information"}
        </p>
      </div>

      <div
        className={`form-container ${
          loading && !loadingEmployee ? "form-loading" : ""
        }`}
      >
        {/* Loading Message */}
        {loadingEmployee && (
          <div className="status-message info-message">
            Loading employee data...
          </div>
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
          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FiUser className="section-icon" />
              Personal Information
            </h3>
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(value) => handleInputChange("name", value)}
              placeholder="Enter employee's full name"
              error={errors.name}
              required
              disabled={loading}
            />
            <Input
              label="Address"
              type="text"
              value={formData.address}
              onChange={(value) => handleInputChange("address", value)}
              placeholder="Enter complete address"
              error={errors.address}
              required
              disabled={loading}
            />
            <Input
              label="Phone"
              type="text"
              value={formData.phone}
              onChange={(value) => handleInputChange("phone", value)}
              placeholder="(555) 123-4567"
              error={errors.phone}
              required
              disabled={loading}
            />
          </div>

          {/* Documentation Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FiFileText className="section-icon" />
              Documentation
            </h3>
            <Input
              label="ITIN Number"
              type="text"
              value={formData.itinNumber}
              onChange={(value) => handleInputChange("itinNumber", value)}
              placeholder="XXX-XX-XXXX"
              error={errors.itinNumber}
              required
              disabled={loading}
            />
            <Input
              label="Driver License Number"
              type="text"
              value={formData.driverLicenseNumber}
              onChange={(value) =>
                handleInputChange("driverLicenseNumber", value)
              }
              placeholder="Enter driver license number"
              error={errors.driverLicenseNumber}
              required
              disabled={loading}
            />

            {/* File Upload for Driver License */}
            <div className="file-upload-container">
              <div className="form-group">
                <label className="form-label">
                  Driver License Document (PDF){" "}
                  <span className="required">*</span>
                </label>
                <label
                  className={`file-upload-label ${
                    isDragOver ? "dragover" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px 16px",
                    border: "3px dashed #0ea5e9",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "120px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      marginBottom: "8px",
                      opacity: 0.8,
                    }}
                  >
                    📄
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: isDragOver ? "#059669" : "#0ea5e9",
                      textAlign: "center",
                    }}
                  >
                    {isDragOver
                      ? "Drop file here to upload"
                      : "Click to upload driver license document"}
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                    disabled={loading}
                  />
                </label>
              </div>
              {formData.driverLicenseDocument && (
                <div className="file-upload-name">
                  <span>{formData.driverLicenseDocument.name}</span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="file-remove-btn"
                    disabled={loading}
                  >
                    ✕
                  </button>
                </div>
              )}
              {errors.driverLicenseDocument && (
                <span className="error-message">
                  {errors.driverLicenseDocument}
                </span>
              )}
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FiAlertCircle className="section-icon" />
              Emergency Contact
            </h3>
            <Input
              label="Emergency Contact Name"
              type="text"
              value={formData.emergencyContactName}
              onChange={(value) =>
                handleInputChange("emergencyContactName", value)
              }
              placeholder="Enter emergency contact's full name"
              error={errors.emergencyContactName}
              required
              disabled={loading}
            />
            <div className="form-row">
              <Input
                label="Emergency Contact Phone"
                type="text"
                value={formData.emergencyContactPhone}
                onChange={(value) =>
                  handleInputChange("emergencyContactPhone", value)
                }
                placeholder="(555) 987-6543"
                error={errors.emergencyContactPhone}
                required
                disabled={loading}
              />
              <Input
                label="Relationship"
                type="text"
                value={formData.emergencyContactRelationship}
                onChange={(value) =>
                  handleInputChange("emergencyContactRelationship", value)
                }
                placeholder="e.g., Spouse, Parent, Sibling"
                error={errors.emergencyContactRelationship}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={loading || loadingEmployee}
            >
              {loading
                ? isEditMode
                  ? "Updating Employee..."
                  : "Saving Employee..."
                : isEditMode
                ? "Update Employee"
                : "Save Employee"}
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

export default RegisterEmployeePage;
