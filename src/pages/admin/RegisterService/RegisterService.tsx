"use client";

import React, { useState } from "react";
import { FiSettings, FiDollarSign } from "react-icons/fi";
import "../../../styles/forms.css";
import "./RegisterService.css";
import SelectInput from "../../../components/ui/SelectInput/SelectInput";
import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import { serviceService } from "../../../services/serviceService";
import type { CreateServiceData } from "../../../types/service";

interface FormErrors {
  serviceCode?: string;
  serviceName?: string;
  billingUnit?: string;
  submit?: string;
}

const RegisterServicePage: React.FC = () => {
  const [formData, setFormData] = useState<CreateServiceData>({
    serviceCode: "",
    serviceName: "",
    billingUnit: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const billingUnitOptions = [
    { value: "ft" as const, label: "Foot (ft)" },
    { value: "box" as const, label: "Box" },
    { value: "fixed" as const, label: "Fixed Price" },
  ];

  const handleInputChange = (field: keyof CreateServiceData, value: string) => {
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.serviceCode.trim()) {
      newErrors.serviceCode = "Service Code is required";
    }

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = "Service Name is required";
    }

    if (!formData.billingUnit) {
      newErrors.billingUnit = "Billing Unit is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //integrar com o firebase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrors({});

    try {
      const newService = await serviceService.createService(formData);
      console.log("Service created:", newService);

      setSuccessMessage("Service registered successfully!");

      // Limpar o formulário mas manter a mensagem de sucesso
      setFormData({
        serviceCode: "",
        serviceName: "",
        billingUnit: "",
      });
      setErrors({});

      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 6000);
    } catch (error) {
      setErrors({
        submit:
          "Failed to register service: " +
          (error instanceof Error ? error.message : String(error)),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      serviceCode: "",
      serviceName: "",
      billingUnit: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="form-page-content">
      <div className="content-header">
        <h1 className="page-title">Register Service</h1>
        <p className="page-subtitle">
          Create a new service with billing configuration and pricing details
        </p>
      </div>

      <div className={`form-container ${loading ? "form-loading" : ""}`}>
        {/* Success Message */}
        {successMessage && (
          <div className="status-message success-message">{successMessage}</div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="status-message error-message">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit} className="modern-form">
          {/* Service Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FiSettings className="section-icon" />
              Service Information
            </h3>
            <div className="form-row">
              <Input
                label="Service Code"
                type="text"
                value={formData.serviceCode}
                onChange={(value) => handleInputChange("serviceCode", value)}
                placeholder="SRV-001"
                error={errors.serviceCode}
                required
                disabled={loading}
              />
              <Input
                label="Service Name"
                type="text"
                value={formData.serviceName}
                onChange={(value) => handleInputChange("serviceName", value)}
                placeholder="Enter descriptive service name"
                error={errors.serviceName}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Billing Configuration Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FiDollarSign className="section-icon" />
              Billing Configuration
            </h3>
            <SelectInput
              label="Billing Unit"
              options={billingUnitOptions}
              value={formData.billingUnit}
              onChange={(value) => handleInputChange("billingUnit", value)}
              placeholder="Select how this service is billed"
              error={errors.billingUnit}
              required
              disabled={loading}
            />
            <small className="form-help-text">
              Choose the unit of measurement for billing this service to clients
            </small>
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving Service..." : "Save Service"}
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

export default RegisterServicePage;
