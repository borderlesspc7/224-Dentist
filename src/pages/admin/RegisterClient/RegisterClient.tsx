"use client";
import React, { useState } from "react";
import { FiUser, FiMapPin, FiPhone, FiTool } from "react-icons/fi";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import "../../../styles/forms.css";
import type { CreateClientData } from "../../../types/client";
import { clientService } from "../../../services/clientService";

interface FormErrors {
  name?: string;
  state?: string;
  city?: string;
  address?: string;
  personPhone?: string;
  officePhone?: string;
  projectNumber?: string;
  projectContractDate?: string;
  projectFinalDate?: string;
  projectDeadline?: string;
  submit?: string;
}

const RegisterClientPage: React.FC = () => {
  const [formData, setFormData] = useState<CreateClientData>({
    name: "",
    state: "",
    city: "",
    address: "",
    personPhone: "",
    officePhone: "",
    projectNumber: "",
    projectContractDate: "",
    projectFinalDate: "",
    projectDeadline: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field: keyof CreateClientData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.personPhone.trim()) {
      newErrors.personPhone = "Person Phone is required";
    }

    if (!formData.officePhone.trim()) {
      newErrors.officePhone = "Office Phone is required";
    }

    if (!formData.projectNumber.trim()) {
      newErrors.projectNumber = "Project Number is required";
    }

    if (!formData.projectContractDate) {
      newErrors.projectContractDate = "Contract Date is required";
    }

    if (!formData.projectFinalDate) {
      newErrors.projectFinalDate = "Final Date is required";
    }

    if (formData.projectContractDate && formData.projectFinalDate) {
      if (
        new Date(formData.projectFinalDate) <
        new Date(formData.projectContractDate)
      ) {
        newErrors.projectFinalDate =
          "Final date cannot be before contract date";
      }
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
      console.log("Client data to save:", formData);

      const newClient = await clientService.createClient(formData);
      console.log("New client:", newClient);

      setSuccessMessage("Client registered successfully!");

      // Limpar o formulário mas manter a mensagem de sucesso
      setFormData({
        name: "",
        state: "",
        city: "",
        address: "",
        personPhone: "",
        officePhone: "",
        projectNumber: "",
        projectContractDate: "",
        projectFinalDate: "",
        projectDeadline: "",
      });
      setErrors({});

      setTimeout(() => {
        setSuccessMessage("");
      }, 6000);
    } catch (error) {
      setErrors({
        submit:
          "Failed to register client: " +
          (error instanceof Error ? error.message : String(error)),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      state: "",
      city: "",
      address: "",
      personPhone: "",
      officePhone: "",
      projectNumber: "",
      projectContractDate: new Date().toISOString().split("T")[0],
      projectFinalDate: new Date().toISOString().split("T")[0],
      projectDeadline: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="form-page-content">
      <div className="content-header">
        <h1 className="page-title">Register Client</h1>
        <p className="page-subtitle">
          Create a new client profile with project details and contact
          information
        </p>
      </div>

      <div className={`form-container ${loading ? "form-loading" : ""}`}>
        {successMessage && (
          <div className="status-message success-message">{successMessage}</div>
        )}

        {errors.submit && (
          <div className="status-message error-message">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit} className="modern-form">
          {/* Client Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FiUser className="section-icon" />
              Client Information
            </h3>
            <Input
              label="Client Name"
              type="text"
              value={formData.name}
              onChange={(value) => handleInputChange("name", value)}
              placeholder="Enter the client's full name"
              error={errors.name}
              required
              disabled={loading}
            />
          </div>

          {/* Location Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FiMapPin className="section-icon" />
              Location Details
            </h3>
            <div className="form-row">
              <Input
                label="State"
                type="text"
                value={formData.state}
                onChange={(value) => handleInputChange("state", value)}
                placeholder="e.g., California"
                error={errors.state}
                required
                disabled={loading}
              />
              <Input
                label="City"
                type="text"
                value={formData.city}
                onChange={(value) => handleInputChange("city", value)}
                placeholder="e.g., Los Angeles"
                error={errors.city}
                required
                disabled={loading}
              />
            </div>
            <Input
              label="Address"
              type="text"
              value={formData.address}
              onChange={(value) => handleInputChange("address", value)}
              placeholder="Enter the complete address"
              error={errors.address}
              required
              disabled={loading}
            />
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FiPhone className="section-icon" />
              Contact Information
            </h3>
            <div className="form-row">
              <Input
                label="Personal Phone"
                type="text"
                value={formData.personPhone}
                onChange={(value) => handleInputChange("personPhone", value)}
                placeholder="(555) 123-4567"
                error={errors.personPhone}
                required
                disabled={loading}
              />
              <Input
                label="Office Phone"
                type="text"
                value={formData.officePhone}
                onChange={(value) => handleInputChange("officePhone", value)}
                placeholder="(555) 987-6543"
                error={errors.officePhone}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Project Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FiTool className="section-icon" />
              Project Details
            </h3>
            <Input
              label="Project Number"
              type="text"
              value={formData.projectNumber}
              onChange={(value) => handleInputChange("projectNumber", value)}
              placeholder="PRJ-2024-001"
              error={errors.projectNumber}
              required
              disabled={loading}
            />
            <div className="form-row">
              <Input
                label="Contract Date"
                type="date"
                value={formData.projectContractDate}
                onChange={(value) =>
                  handleInputChange("projectContractDate", value)
                }
                error={errors.projectContractDate}
                required
                disabled={loading}
              />
              <Input
                label="Final Date"
                type="date"
                value={formData.projectFinalDate}
                onChange={(value) =>
                  handleInputChange("projectFinalDate", value)
                }
                error={errors.projectFinalDate}
                required
                disabled={loading}
              />
            </div>
            <Input
              label="Project Deadline"
              type="text"
              value={formData.projectDeadline}
              onChange={(value) => handleInputChange("projectDeadline", value)}
              placeholder="e.g., 90 days, 6 months, December 2024"
              error={errors.projectDeadline}
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving Client..." : "Save Client"}
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

export default RegisterClientPage;
