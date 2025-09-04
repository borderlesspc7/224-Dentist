"use client";

import React, { useState, useEffect } from "react";
import { FiDollarSign, FiCalendar, FiFileText } from "react-icons/fi";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import "../../../styles/forms.css";
import "./RegisterServicePricing.css";
import type { CreateServicePricingData } from "../../../types/servicePricing";
import { servicePricingService } from "../../../services/servicePricingService";
import { serviceService } from "../../../services/serviceService";
import { clientService } from "../../../services/clientService";
import type { Service } from "../../../types/service";
import type { Client } from "../../../types/client";

interface FormErrors {
    serviceId?: string;
    clientId?: string;
    price?: string;
    currency?: string;
    effectiveDate?: string;
    submit?: string;
}

const RegisterServicePricingPage: React.FC = () => {
    const [formData, setFormData] = useState<CreateServicePricingData>({
        serviceId: "",
        clientId: "",
        price: 0,
        currency: "USD",
        effectiveDate: "",
        endDate: "",
        isActive: true,
        notes: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [clients, setClients] = useState<Client[]>([]);

    const currencyOptions = [
        { value: "USD", label: "USD - US Dollar" },
        { value: "BRL", label: "BRL - Brazilian Real" },
        { value: "EUR", label: "EUR - Euro" },
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const [servicesData, clientsData] = await Promise.all([
                    serviceService.getAllServices(),
                    clientService.getAllClients()
                ]);
                setServices(servicesData);
                setClients(clientsData);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, []);

    const handleInputChange = (field: keyof CreateServicePricingData, value: string | number | boolean) => {
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

        if (!formData.serviceId) {
            newErrors.serviceId = "Service is required";
        }

        if (!formData.clientId) {
            newErrors.clientId = "Client is required";
        }

        if (formData.price <= 0) {
            newErrors.price = "Price must be greater than 0";
        }

        if (!formData.currency) {
            newErrors.currency = "Currency is required";
        }

        if (!formData.effectiveDate) {
            newErrors.effectiveDate = "Effective date is required";
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
            await servicePricingService.createServicePricing(formData);
            setSuccessMessage("Service pricing registered successfully!");

            // Clear the form
            setFormData({
                serviceId: "",
                clientId: "",
                price: 0,
                currency: "USD",
                effectiveDate: "",
                endDate: "",
                isActive: true,
                notes: "",
            });
            setErrors({});

            setTimeout(() => {
                setSuccessMessage("");
            }, 6000);
        } catch (error) {
            setErrors({
                submit:
                    "Failed to register service pricing: " +
                    (error instanceof Error ? error.message : String(error)),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            serviceId: "",
            clientId: "",
            price: 0,
            currency: "USD",
            effectiveDate: "",
            endDate: "",
            isActive: true,
            notes: "",
        });
        setErrors({});
        setSuccessMessage("");
    };

    return (
        <div className="form-page-content">
            <div className="content-header">
                <h1 className="page-title">Register Service Pricing</h1>
                <p className="page-subtitle">
                    Set specific pricing for services by client
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
                    {/* Service and Client Selection Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiDollarSign className="section-icon" />
                            Service and Client Selection
                        </h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Service <span className="required">*</span>
                                </label>
                                <select
                                    value={formData.serviceId}
                                    onChange={(e) => handleInputChange("serviceId", e.target.value)}
                                    className="role-select"
                                    disabled={loading}
                                >
                                    <option value="">Select a service</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name} ({service.code})
                                        </option>
                                    ))}
                                </select>
                                {errors.serviceId && (
                                    <span className="error-message">{errors.serviceId}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Client <span className="required">*</span>
                                </label>
                                <select
                                    value={formData.clientId}
                                    onChange={(e) => handleInputChange("clientId", e.target.value)}
                                    className="role-select"
                                    disabled={loading}
                                >
                                    <option value="">Select a client</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.clientId && (
                                    <span className="error-message">{errors.clientId}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pricing Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiDollarSign className="section-icon" />
                            Pricing Information
                        </h3>
                        <div className="form-row">
                            <Input
                                label="Price"
                                type="number"
                                value={formData.price.toString()}
                                onChange={(value) => handleInputChange("price", value ? parseFloat(value) : 0)}
                                placeholder="0.00"
                                error={errors.price}
                                required
                                disabled={loading}
                            />
                            <div className="form-group">
                                <label className="form-label">
                                    Currency <span className="required">*</span>
                                </label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => handleInputChange("currency", e.target.value)}
                                    className="role-select"
                                    disabled={loading}
                                >
                                    {currencyOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.currency && (
                                    <span className="error-message">{errors.currency}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Date Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiCalendar className="section-icon" />
                            Date Information
                        </h3>
                        <div className="form-row">
                            <Input
                                label="Effective Date"
                                type="date"
                                value={formData.effectiveDate}
                                onChange={(value) => handleInputChange("effectiveDate", value)}
                                error={errors.effectiveDate}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="End Date (Optional)"
                                type="date"
                                value={formData.endDate || ""}
                                onChange={(value) => handleInputChange("endDate", value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiFileText className="section-icon" />
                            Additional Information
                        </h3>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea
                                value={formData.notes || ""}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                placeholder="Enter any additional notes about this pricing..."
                                className="form-textarea"
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                rows={4}
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                                    disabled={loading}
                                />
                                <span style={{ marginLeft: '8px' }}>Pricing is active</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? "Saving Pricing..." : "Save Pricing"}
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

export default RegisterServicePricingPage;
