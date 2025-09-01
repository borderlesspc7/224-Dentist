"use client";
import React, { useState } from "react";
import { FiCreditCard, FiUser, FiDollarSign, FiCalendar, FiFileText, FiShield } from "react-icons/fi";
import Input from "../../../components/ui/Input/Input";
import MultiSelect from "../../../components/ui/MultiSelect/MultiSelect";
import Button from "../../../components/ui/Button/Button";
import "../../../styles/forms.css";
import type { CreateFinancingData } from "../../../types/financing";
import { financingService } from "../../../services/financingService";

interface FormErrors {
    projectId?: string;
    projectName?: string;
    clientId?: string;
    clientName?: string;
    financingType?: string;
    lenderName?: string;
    lenderContact?: string;
    lenderPhone?: string;
    lenderEmail?: string;
    loanAmount?: string;
    interestRate?: string;
    termMonths?: string;
    monthlyPayment?: string;
    startDate?: string;
    maturityDate?: string;
    submit?: string;
}

const RegisterFinancingPage: React.FC = () => {
    const [formData, setFormData] = useState<CreateFinancingData>({
        projectId: "",
        projectName: "",
        clientId: "",
        clientName: "",
        financingType: "loan",
        lenderName: "",
        lenderContact: "",
        lenderPhone: "",
        lenderEmail: "",
        loanAmount: 0,
        interestRate: 0,
        termMonths: 0,
        monthlyPayment: 0,
        startDate: "",
        maturityDate: "",
        status: "pending",
        collateral: [],
        requirements: [],
        notes: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Financing type options
    const financingTypeOptions = [
        { value: "loan", label: "Business Loan" },
        { value: "credit_line", label: "Credit Line" },
        { value: "equipment_financing", label: "Equipment Financing" },
        { value: "working_capital", label: "Working Capital" },
        { value: "construction_loan", label: "Construction Loan" },
    ];

    // Collateral options
    const collateralOptions = [
        { value: "real_estate", label: "Real Estate" },
        { value: "equipment", label: "Equipment" },
        { value: "vehicles", label: "Vehicles" },
        { value: "accounts_receivable", label: "Accounts Receivable" },
        { value: "inventory", label: "Inventory" },
        { value: "personal_guarantee", label: "Personal Guarantee" },
        { value: "cash_collateral", label: "Cash Collateral" },
        { value: "securities", label: "Securities" },
    ];

    // Requirements options
    const requirementsOptions = [
        { value: "financial_statements", label: "Financial Statements" },
        { value: "tax_returns", label: "Tax Returns" },
        { value: "business_plan", label: "Business Plan" },
        { value: "credit_report", label: "Credit Report" },
        { value: "insurance", label: "Insurance Documentation" },
        { value: "legal_documents", label: "Legal Documents" },
        { value: "appraisal", label: "Property/Equipment Appraisal" },
        { value: "environmental_assessment", label: "Environmental Assessment" },
    ];

    const handleInputChange = (field: keyof CreateFinancingData, value: string | string[] | number) => {
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

        if (!formData.projectId.trim()) {
            newErrors.projectId = "Project ID is required";
        }

        if (!formData.projectName.trim()) {
            newErrors.projectName = "Project name is required";
        }

        if (!formData.clientId.trim()) {
            newErrors.clientId = "Client ID is required";
        }

        if (!formData.clientName.trim()) {
            newErrors.clientName = "Client name is required";
        }

        if (!formData.lenderName.trim()) {
            newErrors.lenderName = "Lender name is required";
        }

        if (!formData.lenderContact.trim()) {
            newErrors.lenderContact = "Lender contact is required";
        }

        if (!formData.lenderPhone.trim()) {
            newErrors.lenderPhone = "Lender phone is required";
        }

        if (!formData.lenderEmail.trim()) {
            newErrors.lenderEmail = "Lender email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.lenderEmail)) {
            newErrors.lenderEmail = "Please enter a valid email";
        }

        if (formData.loanAmount <= 0) {
            newErrors.loanAmount = "Loan amount must be greater than 0";
        }

        if (formData.interestRate < 0) {
            newErrors.interestRate = "Interest rate cannot be negative";
        }

        if (formData.termMonths <= 0) {
            newErrors.termMonths = "Term must be greater than 0";
        }

        if (formData.monthlyPayment <= 0) {
            newErrors.monthlyPayment = "Monthly payment must be greater than 0";
        }

        if (!formData.startDate) {
            newErrors.startDate = "Start date is required";
        }

        if (!formData.maturityDate) {
            newErrors.maturityDate = "Maturity date is required";
        }

        if (formData.startDate && formData.maturityDate) {
            if (new Date(formData.maturityDate) <= new Date(formData.startDate)) {
                newErrors.maturityDate = "Maturity date must be after start date";
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
            await financingService.createFinancing(formData);
            setSuccessMessage("Financing registered successfully!");

            // Limpar o formulário mas manter a mensagem de sucesso
            setFormData({
                projectId: "",
                projectName: "",
                clientId: "",
                clientName: "",
                financingType: "loan",
                lenderName: "",
                lenderContact: "",
                lenderPhone: "",
                lenderEmail: "",
                loanAmount: 0,
                interestRate: 0,
                termMonths: 0,
                monthlyPayment: 0,
                startDate: "",
                maturityDate: "",
                status: "pending",
                collateral: [],
                requirements: [],
                notes: "",
            });
            setErrors({});

            setTimeout(() => {
                setSuccessMessage("");
            }, 6000);
        } catch (error) {
            setErrors({
                submit:
                    "Failed to register financing: " +
                    (error instanceof Error ? error.message : String(error)),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            projectId: "",
            projectName: "",
            clientId: "",
            clientName: "",
            financingType: "loan",
            lenderName: "",
            lenderContact: "",
            lenderPhone: "",
            lenderEmail: "",
            loanAmount: 0,
            interestRate: 0,
            termMonths: 0,
            monthlyPayment: 0,
            startDate: "",
            maturityDate: "",
            status: "pending",
            collateral: [],
            requirements: [],
            notes: "",
        });
        setErrors({});
        setSuccessMessage("");
    };

    return (
        <div className="form-page-content">
            <div className="content-header">
                <h1 className="page-title">Register Financing</h1>
                <p className="page-subtitle">
                    Create a new financing record with loan details, terms, and requirements
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
                    {/* Project Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiFileText className="section-icon" />
                            Project Information
                        </h3>
                        <div className="form-row">
                            <Input
                                label="Project ID"
                                type="text"
                                value={formData.projectId}
                                onChange={(value) => handleInputChange("projectId", value)}
                                placeholder="PRJ-2024-001"
                                error={errors.projectId}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Project Name"
                                type="text"
                                value={formData.projectName}
                                onChange={(value) => handleInputChange("projectName", value)}
                                placeholder="Enter project name"
                                error={errors.projectName}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-row">
                            <Input
                                label="Client ID"
                                type="text"
                                value={formData.clientId}
                                onChange={(value) => handleInputChange("clientId", value)}
                                placeholder="CLI-2024-001"
                                error={errors.clientId}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Client Name"
                                type="text"
                                value={formData.clientName}
                                onChange={(value) => handleInputChange("clientName", value)}
                                placeholder="Enter client name"
                                error={errors.clientName}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Financing Details Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiCreditCard className="section-icon" />
                            Financing Details
                        </h3>
                        <div className="form-group">
                            <label className="form-label">
                                Financing Type <span className="required">*</span>
                            </label>
                            <select
                                value={formData.financingType}
                                onChange={(e) => handleInputChange("financingType", e.target.value as any)}
                                className="role-select"
                                disabled={loading}
                            >
                                {financingTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-row">
                            <Input
                                label="Loan Amount"
                                type="text"
                                value={formData.loanAmount.toString()}
                                onChange={(value) => handleInputChange("loanAmount", value ? parseFloat(value) : 0)}
                                placeholder="Enter loan amount"
                                error={errors.loanAmount}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Interest Rate (%)"
                                type="text"
                                value={formData.interestRate.toString()}
                                onChange={(value) => handleInputChange("interestRate", value ? parseFloat(value) : 0)}
                                placeholder="Enter interest rate"
                                error={errors.interestRate}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-row">
                            <Input
                                label="Term (Months)"
                                type="text"
                                value={formData.termMonths.toString()}
                                onChange={(value) => handleInputChange("termMonths", value ? parseInt(value) : 0)}
                                placeholder="Enter term in months"
                                error={errors.termMonths}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Monthly Payment"
                                type="text"
                                value={formData.monthlyPayment.toString()}
                                onChange={(value) => handleInputChange("monthlyPayment", value ? parseFloat(value) : 0)}
                                placeholder="Enter monthly payment"
                                error={errors.monthlyPayment}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Lender Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiUser className="section-icon" />
                            Lender Information
                        </h3>
                        <Input
                            label="Lender Name"
                            type="text"
                            value={formData.lenderName}
                            onChange={(value) => handleInputChange("lenderName", value)}
                            placeholder="Enter lender name"
                            error={errors.lenderName}
                            required
                            disabled={loading}
                        />
                        <div className="form-row">
                            <Input
                                label="Lender Contact"
                                type="text"
                                value={formData.lenderContact}
                                onChange={(value) => handleInputChange("lenderContact", value)}
                                placeholder="Enter contact person"
                                error={errors.lenderContact}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Lender Phone"
                                type="text"
                                value={formData.lenderPhone}
                                onChange={(value) => handleInputChange("lenderPhone", value)}
                                placeholder="(555) 123-4567"
                                error={errors.lenderPhone}
                                required
                                disabled={loading}
                            />
                        </div>
                        <Input
                            label="Lender Email"
                            type="email"
                            value={formData.lenderEmail}
                            onChange={(value) => handleInputChange("lenderEmail", value)}
                            placeholder="lender@example.com"
                            error={errors.lenderEmail}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Timeline Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiCalendar className="section-icon" />
                            Timeline
                        </h3>
                        <div className="form-row">
                            <Input
                                label="Start Date"
                                type="date"
                                value={formData.startDate}
                                onChange={(value) => handleInputChange("startDate", value)}
                                error={errors.startDate}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Maturity Date"
                                type="date"
                                value={formData.maturityDate}
                                onChange={(value) => handleInputChange("maturityDate", value)}
                                error={errors.maturityDate}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Collateral and Requirements Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiShield className="section-icon" />
                            Collateral & Requirements
                        </h3>
                        <MultiSelect
                            label="Collateral"
                            options={collateralOptions}
                            value={formData.collateral}
                            onChange={(value) => handleInputChange("collateral", value)}
                            placeholder="Select collateral types..."
                            disabled={loading}
                        />
                        <MultiSelect
                            label="Requirements"
                            options={requirementsOptions}
                            value={formData.requirements}
                            onChange={(value) => handleInputChange("requirements", value)}
                            placeholder="Select required documents..."
                            disabled={loading}
                        />
                    </div>

                    {/* Additional Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiDollarSign className="section-icon" />
                            Additional Information
                        </h3>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea
                                value={formData.notes || ""}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                placeholder="Enter any additional notes or special requirements..."
                                className="form-textarea"
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                rows={4}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? "Saving Financing..." : "Save Financing"}
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

export default RegisterFinancingPage;
