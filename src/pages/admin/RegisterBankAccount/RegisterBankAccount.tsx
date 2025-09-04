"use client";

import React, { useState } from "react";
import { FiCreditCard, FiDollarSign, FiHome, FiSettings } from "react-icons/fi";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import "../../../styles/forms.css";
import "./RegisterBankAccount.css";
import type { CreateBankAccountData } from "../../../types/bankAccount";
import { bankAccountService } from "../../../services/bankAccountService";

interface FormErrors {
    accountName?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    accountType?: string;
    balance?: string;
    currency?: string;
    submit?: string;
}

const RegisterBankAccountPage: React.FC = () => {
    const [formData, setFormData] = useState<CreateBankAccountData>({
        accountName: "",
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        accountType: "checking",
        balance: 0,
        currency: "USD",
        isActive: true,
        description: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const accountTypeOptions = [
        { value: "checking", label: "Checking Account" },
        { value: "savings", label: "Savings Account" },
        { value: "business", label: "Business Account" },
    ];

    const currencyOptions = [
        { value: "USD", label: "USD - US Dollar" },
        { value: "BRL", label: "BRL - Brazilian Real" },
        { value: "EUR", label: "EUR - Euro" },
    ];

    const handleInputChange = (field: keyof CreateBankAccountData, value: string | number | boolean) => {
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

        if (!formData.accountName.trim()) {
            newErrors.accountName = "Account name is required";
        }

        if (!formData.bankName.trim()) {
            newErrors.bankName = "Bank name is required";
        }

        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber = "Account number is required";
        }

        if (!formData.routingNumber.trim()) {
            newErrors.routingNumber = "Routing number is required";
        }

        if (!formData.accountType) {
            newErrors.accountType = "Account type is required";
        }

        if (formData.balance < 0) {
            newErrors.balance = "Balance cannot be negative";
        }

        if (!formData.currency) {
            newErrors.currency = "Currency is required";
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
            await bankAccountService.createBankAccount(formData);
            setSuccessMessage("Bank account registered successfully!");

            // Clear the form
            setFormData({
                accountName: "",
                bankName: "",
                accountNumber: "",
                routingNumber: "",
                accountType: "checking",
                balance: 0,
                currency: "USD",
                isActive: true,
                description: "",
            });
            setErrors({});

            setTimeout(() => {
                setSuccessMessage("");
            }, 6000);
        } catch (error) {
            setErrors({
                submit:
                    "Failed to register bank account: " +
                    (error instanceof Error ? error.message : String(error)),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            accountName: "",
            bankName: "",
            accountNumber: "",
            routingNumber: "",
            accountType: "checking",
            balance: 0,
            currency: "USD",
            isActive: true,
            description: "",
        });
        setErrors({});
        setSuccessMessage("");
    };

    return (
        <div className="form-page-content">
            <div className="content-header">
                <h1 className="page-title">Register Bank Account</h1>
                <p className="page-subtitle">
                    Add a new bank account to the financial management system
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
                    {/* Account Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiCreditCard className="section-icon" />
                            Account Information
                        </h3>
                        <Input
                            label="Account Name"
                            type="text"
                            value={formData.accountName}
                            onChange={(value) => handleInputChange("accountName", value)}
                            placeholder="e.g., Main Business Account"
                            error={errors.accountName}
                            required
                            disabled={loading}
                        />
                        <Input
                            label="Bank Name"
                            type="text"
                            value={formData.bankName}
                            onChange={(value) => handleInputChange("bankName", value)}
                            placeholder="e.g., Bank of America"
                            error={errors.bankName}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Account Details Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiHome className="section-icon" />
                            Account Details
                        </h3>
                        <div className="form-row">
                            <Input
                                label="Account Number"
                                type="text"
                                value={formData.accountNumber}
                                onChange={(value) => handleInputChange("accountNumber", value)}
                                placeholder="Enter account number"
                                error={errors.accountNumber}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Routing Number"
                                type="text"
                                value={formData.routingNumber}
                                onChange={(value) => handleInputChange("routingNumber", value)}
                                placeholder="Enter routing number"
                                error={errors.routingNumber}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Account Type <span className="required">*</span>
                                </label>
                                <select
                                    value={formData.accountType}
                                    onChange={(e) => handleInputChange("accountType", e.target.value as any)}
                                    className="role-select"
                                    disabled={loading}
                                >
                                    {accountTypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.accountType && (
                                    <span className="error-message">{errors.accountType}</span>
                                )}
                            </div>
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

                    {/* Financial Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiDollarSign className="section-icon" />
                            Financial Information
                        </h3>
                        <Input
                            label="Current Balance"
                            type="number"
                            value={formData.balance.toString()}
                            onChange={(value) => handleInputChange("balance", value ? parseFloat(value) : 0)}
                            placeholder="0.00"
                            error={errors.balance}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Additional Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiSettings className="section-icon" />
                            Additional Information
                        </h3>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                value={formData.description || ""}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Enter any additional notes about this account..."
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
                                <span style={{ marginLeft: '8px' }}>Account is active</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? "Saving Account..." : "Save Account"}
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

export default RegisterBankAccountPage;
