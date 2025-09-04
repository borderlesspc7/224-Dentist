"use client";

import React, { useState } from "react";
import { FiFileText, FiSettings, FiDollarSign } from "react-icons/fi";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import "../../../styles/forms.css";
import "./RegisterExpenseType.css";
import type { CreateExpenseTypeData } from "../../../types/expenseType";
import { expenseTypeService } from "../../../services/expenseTypeService";

interface FormErrors {
    name?: string;
    category?: string;
    maxAmount?: string;
    submit?: string;
}

const RegisterExpenseTypePage: React.FC = () => {
    const [formData, setFormData] = useState<CreateExpenseTypeData>({
        name: "",
        category: "operational",
        description: "",
        isActive: true,
        requiresApproval: false,
        maxAmount: 0,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const categoryOptions = [
        { value: "operational", label: "Operational" },
        { value: "administrative", label: "Administrative" },
        { value: "equipment", label: "Equipment" },
        { value: "fuel", label: "Fuel" },
        { value: "maintenance", label: "Maintenance" },
        { value: "insurance", label: "Insurance" },
        { value: "other", label: "Other" },
    ];

    const handleInputChange = (field: keyof CreateExpenseTypeData, value: string | number | boolean) => {
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
            newErrors.name = "Expense type name is required";
        }

        if (!formData.category) {
            newErrors.category = "Category is required";
        }

        if (formData.maxAmount && formData.maxAmount < 0) {
            newErrors.maxAmount = "Maximum amount cannot be negative";
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
            await expenseTypeService.createExpenseType(formData);
            setSuccessMessage("Expense type registered successfully!");

            // Clear the form
            setFormData({
                name: "",
                category: "operational",
                description: "",
                isActive: true,
                requiresApproval: false,
                maxAmount: 0,
            });
            setErrors({});

            setTimeout(() => {
                setSuccessMessage("");
            }, 6000);
        } catch (error) {
            setErrors({
                submit:
                    "Failed to register expense type: " +
                    (error instanceof Error ? error.message : String(error)),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: "",
            category: "operational",
            description: "",
            isActive: true,
            requiresApproval: false,
            maxAmount: 0,
        });
        setErrors({});
        setSuccessMessage("");
    };

    return (
        <div className="form-page-content">
            <div className="content-header">
                <h1 className="page-title">Register Expense Type</h1>
                <p className="page-subtitle">
                    Add a new expense type for financial management
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
                    {/* Basic Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiFileText className="section-icon" />
                            Basic Information
                        </h3>
                        <Input
                            label="Expense Type Name"
                            type="text"
                            value={formData.name}
                            onChange={(value) => handleInputChange("name", value)}
                            placeholder="e.g., Fuel Expenses, Equipment Maintenance"
                            error={errors.name}
                            required
                            disabled={loading}
                        />
                        <div className="form-group">
                            <label className="form-label">
                                Category <span className="required">*</span>
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleInputChange("category", e.target.value as any)}
                                className="role-select"
                                disabled={loading}
                            >
                                {categoryOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <span className="error-message">{errors.category}</span>
                            )}
                        </div>
                    </div>

                    {/* Financial Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiDollarSign className="section-icon" />
                            Financial Information
                        </h3>
                        <Input
                            label="Maximum Amount (Optional)"
                            type="number"
                            value={formData.maxAmount?.toString() || ""}
                            onChange={(value) => handleInputChange("maxAmount", value ? parseFloat(value) : 0)}
                            placeholder="0.00"
                            error={errors.maxAmount}
                            disabled={loading}
                        />
                    </div>

                    {/* Settings Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiSettings className="section-icon" />
                            Settings
                        </h3>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                value={formData.description || ""}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Enter a description for this expense type..."
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
                                <span style={{ marginLeft: '8px' }}>Expense type is active</span>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <input
                                    type="checkbox"
                                    checked={formData.requiresApproval}
                                    onChange={(e) => handleInputChange("requiresApproval", e.target.checked)}
                                    disabled={loading}
                                />
                                <span style={{ marginLeft: '8px' }}>Requires approval</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? "Saving Expense Type..." : "Save Expense Type"}
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

export default RegisterExpenseTypePage;
