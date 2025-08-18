"use client";

import React, { useState } from "react";
import "./RegisterService.css";
import SelectInput from "../../../components/ui/SelectInput/SelectInput";
import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";

interface FormData {
  serviceCode: string;
  serviceName: string;
  billingUnit: string;
}

interface FormErrors {
  serviceCode?: string;
  serviceName?: string;
  billingUnit?: string;
  submit?: string;
}

const RegisterServicePage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    serviceCode: "",
    serviceName: "",
    billingUnit: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const billingUnitOptions = [
    { value: "ft", label: "Foot (ft)" },
    { value: "box", label: "Box" },
    { value: "fixed", label: "Fixed Price" },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
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
      console.log("Service data to save:", formData);

      await new Promise((resolve) => setTimeout(resolve, 1000));

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
      }, 3000);
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
    <div className="register-service-content">
      <div className="content-header">
        <h1 className="page-title">Register Service</h1>
        <p className="page-subtitle">Create a new service</p>
      </div>

      <div className="form-container">
        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <span>✓ {successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="error-message">
            <span>✗ {errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="service-form">
          <Input
            label="Service Code"
            type="text"
            value={formData.serviceCode}
            onChange={(value) => handleInputChange("serviceCode", value)}
            placeholder="Enter service code"
            error={errors.serviceCode}
            required
          />

          <Input
            label="Service Name"
            type="text"
            value={formData.serviceName}
            onChange={(value) => handleInputChange("serviceName", value)}
            placeholder="Enter service name"
            error={errors.serviceName}
            required
          />

          <SelectInput
            label="Billing Unit"
            options={billingUnitOptions}
            value={formData.billingUnit}
            onChange={(value) => handleInputChange("billingUnit", value)}
            placeholder="Select billing unit"
            error={errors.billingUnit}
            required
          />

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
