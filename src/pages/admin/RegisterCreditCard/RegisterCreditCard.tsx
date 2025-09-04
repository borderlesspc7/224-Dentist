"use client";

import React, { useState } from "react";
import { FiCreditCard, FiDollarSign, FiUser, FiCalendar } from "react-icons/fi";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import "../../../styles/forms.css";
import "./RegisterCreditCard.css";
import type { CreateCreditCardData } from "../../../types/creditCard";
import { creditCardService } from "../../../services/creditCardService";

interface FormErrors {
    cardName?: string;
    cardNumber?: string;
    cardType?: string;
    bankName?: string;
    assignedTo?: string;
    creditLimit?: string;
    currentBalance?: string;
    expiryDate?: string;
    submit?: string;
}

const RegisterCreditCardPage: React.FC = () => {
    const [formData, setFormData] = useState<CreateCreditCardData>({
        cardName: "",
        cardNumber: "",
        cardType: "visa",
        bankName: "",
        assignedTo: "",
        creditLimit: 0,
        currentBalance: 0,
        expiryDate: "",
        isActive: true,
        monthlyLimit: 0,
        description: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const cardTypeOptions = [
        { value: "visa", label: "Visa" },
        { value: "mastercard", label: "Mastercard" },
        { value: "amex", label: "American Express" },
        { value: "discover", label: "Discover" },
    ];

    const handleInputChange = (field: keyof CreateCreditCardData, value: string | number | boolean) => {
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

        if (!formData.cardName.trim()) {
            newErrors.cardName = "Card name is required";
        }

        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = "Card number is required";
        }

        if (!formData.cardType) {
            newErrors.cardType = "Card type is required";
        }

        if (!formData.bankName.trim()) {
            newErrors.bankName = "Bank name is required";
        }

        if (!formData.assignedTo.trim()) {
            newErrors.assignedTo = "Assigned to is required";
        }

        if (formData.creditLimit < 0) {
            newErrors.creditLimit = "Credit limit cannot be negative";
        }

        if (formData.currentBalance < 0) {
            newErrors.currentBalance = "Current balance cannot be negative";
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = "Expiry date is required";
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
            await creditCardService.createCreditCard(formData);
            setSuccessMessage("Credit card registered successfully!");

            // Clear the form
            setFormData({
                cardName: "",
                cardNumber: "",
                cardType: "visa",
                bankName: "",
                assignedTo: "",
                creditLimit: 0,
                currentBalance: 0,
                expiryDate: "",
                isActive: true,
                monthlyLimit: 0,
                description: "",
            });
            setErrors({});

            setTimeout(() => {
                setSuccessMessage("");
            }, 6000);
        } catch (error) {
            setErrors({
                submit:
                    "Failed to register credit card: " +
                    (error instanceof Error ? error.message : String(error)),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            cardName: "",
            cardNumber: "",
            cardType: "visa",
            bankName: "",
            assignedTo: "",
            creditLimit: 0,
            currentBalance: 0,
            expiryDate: "",
            isActive: true,
            monthlyLimit: 0,
            description: "",
        });
        setErrors({});
        setSuccessMessage("");
    };

    return (
        <div className="form-page-content">
            <div className="content-header">
                <h1 className="page-title">Register Credit Card</h1>
                <p className="page-subtitle">
                    Add a new credit card for team operations
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
                    {/* Card Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiCreditCard className="section-icon" />
                            Card Information
                        </h3>
                        <Input
                            label="Card Name"
                            type="text"
                            value={formData.cardName}
                            onChange={(value) => handleInputChange("cardName", value)}
                            placeholder="e.g., Team 1 Operations Card"
                            error={errors.cardName}
                            required
                            disabled={loading}
                        />
                        <div className="form-row">
                            <Input
                                label="Card Number (Last 4 digits)"
                                type="text"
                                value={formData.cardNumber}
                                onChange={(value) => handleInputChange("cardNumber", value)}
                                placeholder="1234"
                                error={errors.cardNumber}
                                required
                                disabled={loading}
                            />
                            <div className="form-group">
                                <label className="form-label">
                                    Card Type <span className="required">*</span>
                                </label>
                                <select
                                    value={formData.cardType}
                                    onChange={(e) => handleInputChange("cardType", e.target.value as any)}
                                    className="role-select"
                                    disabled={loading}
                                >
                                    {cardTypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.cardType && (
                                    <span className="error-message">{errors.cardType}</span>
                                )}
                            </div>
                        </div>
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

                    {/* Assignment Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiUser className="section-icon" />
                            Assignment
                        </h3>
                        <Input
                            label="Assigned To"
                            type="text"
                            value={formData.assignedTo}
                            onChange={(value) => handleInputChange("assignedTo", value)}
                            placeholder="e.g., Team 1, Operations Manager"
                            error={errors.assignedTo}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Financial Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiDollarSign className="section-icon" />
                            Financial Information
                        </h3>
                        <div className="form-row">
                            <Input
                                label="Credit Limit"
                                type="number"
                                value={formData.creditLimit.toString()}
                                onChange={(value) => handleInputChange("creditLimit", value ? parseFloat(value) : 0)}
                                placeholder="0.00"
                                error={errors.creditLimit}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Current Balance"
                                type="number"
                                value={formData.currentBalance.toString()}
                                onChange={(value) => handleInputChange("currentBalance", value ? parseFloat(value) : 0)}
                                placeholder="0.00"
                                error={errors.currentBalance}
                                required
                                disabled={loading}
                            />
                        </div>
                        <Input
                            label="Monthly Limit (Optional)"
                            type="number"
                            value={formData.monthlyLimit?.toString() || ""}
                            onChange={(value) => handleInputChange("monthlyLimit", value ? parseFloat(value) : 0)}
                            placeholder="0.00"
                            disabled={loading}
                        />
                    </div>

                    {/* Expiry Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiCalendar className="section-icon" />
                            Expiry Information
                        </h3>
                        <Input
                            label="Expiry Date"
                            type="date"
                            value={formData.expiryDate}
                            onChange={(value) => handleInputChange("expiryDate", value)}
                            error={errors.expiryDate}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Additional Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiCreditCard className="section-icon" />
                            Additional Information
                        </h3>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                value={formData.description || ""}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Enter any additional notes about this card..."
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
                                <span style={{ marginLeft: '8px' }}>Card is active</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? "Saving Card..." : "Save Card"}
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

export default RegisterCreditCardPage;
