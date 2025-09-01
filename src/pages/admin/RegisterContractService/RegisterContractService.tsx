"use client";
import React, { useState } from "react";
import { FiFileText, FiMapPin, FiDollarSign, FiCalendar, FiClipboard } from "react-icons/fi";
import Input from "../../../components/ui/Input/Input";
import MultiSelect from "../../../components/ui/MultiSelect/MultiSelect";
import Button from "../../../components/ui/Button/Button";
import "../../../styles/forms.css";
import type { CreateContractServiceData } from "../../../types/contractService";
import { contractServiceService } from "../../../services/contractServiceService";

interface FormErrors {
    serviceName?: string;
    clientId?: string;
    clientName?: string;
    projectNumber?: string;
    contractNumber?: string;
    startDate?: string;
    endDate?: string;
    estimatedDuration?: string;
    serviceType?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    estimatedCost?: string;
    currency?: string;
    submit?: string;
}

const RegisterContractServicePage: React.FC = () => {
    const [formData, setFormData] = useState<CreateContractServiceData>({
        serviceName: "",
        clientId: "",
        clientName: "",
        subcontractorId: "",
        subcontractorName: "",
        projectNumber: "",
        contractNumber: "",
        startDate: "",
        endDate: "",
        estimatedDuration: "",
        status: "pending",
        serviceType: "",
        description: "",
        location: {
            address: "",
            city: "",
            state: "",
            zipCode: "",
        },
        budget: {
            estimatedCost: 0,
            actualCost: 0,
            currency: "USD",
        },
        requirements: [],
        deliverables: [],
        notes: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Service type options for MultiSelect
    const serviceTypeOptions = [
        { value: "excavation", label: "Excavation" },
        { value: "trenching", label: "Trenching" },
        { value: "underground_utilities", label: "Underground Utilities" },
        { value: "concrete_work", label: "Concrete Work" },
        { value: "asphalt_paving", label: "Asphalt Paving" },
        { value: "landscaping", label: "Landscaping" },
        { value: "drainage", label: "Drainage Systems" },
        { value: "electrical", label: "Electrical Work" },
        { value: "plumbing", label: "Plumbing" },
        { value: "surveying", label: "Surveying" },
        { value: "equipment_rental", label: "Equipment Rental" },
        { value: "traffic_control", label: "Traffic Control" },
    ];

    // Requirements options for MultiSelect
    const requirementsOptions = [
        { value: "permits", label: "Permits Required" },
        { value: "safety_equipment", label: "Safety Equipment" },
        { value: "environmental_clearance", label: "Environmental Clearance" },
        { value: "traffic_control", label: "Traffic Control Plan" },
        { value: "utility_marking", label: "Utility Marking" },
        { value: "soil_testing", label: "Soil Testing" },
        { value: "surveying", label: "Surveying Required" },
        { value: "inspections", label: "Regular Inspections" },
        { value: "insurance", label: "Insurance Coverage" },
        { value: "bonding", label: "Performance Bond" },
    ];

    // Deliverables options for MultiSelect
    const deliverablesOptions = [
        { value: "excavation_complete", label: "Excavation Complete" },
        { value: "utilities_installed", label: "Utilities Installed" },
        { value: "backfill_complete", label: "Backfill Complete" },
        { value: "paving_complete", label: "Paving Complete" },
        { value: "landscaping_complete", label: "Landscaping Complete" },
        { value: "final_inspection", label: "Final Inspection" },
        { value: "as_built_drawings", label: "As-Built Drawings" },
        { value: "warranty_documentation", label: "Warranty Documentation" },
        { value: "cleanup_complete", label: "Site Cleanup Complete" },
        { value: "final_report", label: "Final Project Report" },
    ];

    const handleInputChange = (field: keyof CreateContractServiceData, value: string | string[] | number) => {
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

    const handleLocationChange = (field: keyof CreateContractServiceData['location'], value: string) => {
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: value,
            },
        }));

        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleBudgetChange = (field: keyof CreateContractServiceData['budget'], value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            budget: {
                ...prev.budget,
                [field]: value,
            },
        }));

        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.serviceName.trim()) {
            newErrors.serviceName = "Service name is required";
        }

        if (!formData.clientId.trim()) {
            newErrors.clientId = "Client ID is required";
        }

        if (!formData.clientName.trim()) {
            newErrors.clientName = "Client name is required";
        }

        if (!formData.projectNumber.trim()) {
            newErrors.projectNumber = "Project number is required";
        }

        if (!formData.contractNumber.trim()) {
            newErrors.contractNumber = "Contract number is required";
        }

        if (!formData.startDate) {
            newErrors.startDate = "Start date is required";
        }

        if (!formData.endDate) {
            newErrors.endDate = "End date is required";
        }

        if (formData.startDate && formData.endDate) {
            if (new Date(formData.endDate) < new Date(formData.startDate)) {
                newErrors.endDate = "End date cannot be before start date";
            }
        }

        if (!formData.estimatedDuration.trim()) {
            newErrors.estimatedDuration = "Estimated duration is required";
        }

        if (!formData.serviceType.trim()) {
            newErrors.serviceType = "Service type is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }

        if (!formData.location.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!formData.location.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.location.state.trim()) {
            newErrors.state = "State is required";
        }

        if (formData.budget.estimatedCost <= 0) {
            newErrors.estimatedCost = "Estimated cost must be greater than 0";
        }

        if (!formData.budget.currency.trim()) {
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
            console.log("Contract service data to save:", formData);

            const newContractService = await contractServiceService.createContractService(formData);
            console.log("New contract service:", newContractService);

            setSuccessMessage("Contract service registered successfully!");

            // Limpar o formulário mas manter a mensagem de sucesso
            setFormData({
                serviceName: "",
                clientId: "",
                clientName: "",
                subcontractorId: "",
                subcontractorName: "",
                projectNumber: "",
                contractNumber: "",
                startDate: "",
                endDate: "",
                estimatedDuration: "",
                status: "pending",
                serviceType: "",
                description: "",
                location: {
                    address: "",
                    city: "",
                    state: "",
                    zipCode: "",
                },
                budget: {
                    estimatedCost: 0,
                    actualCost: 0,
                    currency: "USD",
                },
                requirements: [],
                deliverables: [],
                notes: "",
            });
            setErrors({});

            setTimeout(() => {
                setSuccessMessage("");
            }, 6000);
        } catch (error) {
            setErrors({
                submit:
                    "Failed to register contract service: " +
                    (error instanceof Error ? error.message : String(error)),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            serviceName: "",
            clientId: "",
            clientName: "",
            subcontractorId: "",
            subcontractorName: "",
            projectNumber: "",
            contractNumber: "",
            startDate: "",
            endDate: "",
            estimatedDuration: "",
            status: "pending",
            serviceType: "",
            description: "",
            location: {
                address: "",
                city: "",
                state: "",
                zipCode: "",
            },
            budget: {
                estimatedCost: 0,
                actualCost: 0,
                currency: "USD",
            },
            requirements: [],
            deliverables: [],
            notes: "",
        });
        setErrors({});
        setSuccessMessage("");
    };

    return (
        <div className="form-page-content">
            <div className="content-header">
                <h1 className="page-title">Register Contract Service</h1>
                <p className="page-subtitle">
                    Create a new contract service with project details, budget, and requirements
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
                    {/* Service Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiFileText className="section-icon" />
                            Service Information
                        </h3>
                        <Input
                            label="Service Name"
                            type="text"
                            value={formData.serviceName}
                            onChange={(value) => handleInputChange("serviceName", value)}
                            placeholder="Enter the service name"
                            error={errors.serviceName}
                            required
                            disabled={loading}
                        />
                        <div className="form-row">
                            <Input
                                label="Client ID"
                                type="text"
                                value={formData.clientId}
                                onChange={(value) => handleInputChange("clientId", value)}
                                placeholder="Enter client ID"
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
                        <div className="form-row">
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
                            <Input
                                label="Contract Number"
                                type="text"
                                value={formData.contractNumber}
                                onChange={(value) => handleInputChange("contractNumber", value)}
                                placeholder="CNT-2024-001"
                                error={errors.contractNumber}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Project Timeline Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiCalendar className="section-icon" />
                            Project Timeline
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
                                label="End Date"
                                type="date"
                                value={formData.endDate}
                                onChange={(value) => handleInputChange("endDate", value)}
                                error={errors.endDate}
                                required
                                disabled={loading}
                            />
                        </div>
                        <Input
                            label="Estimated Duration"
                            type="text"
                            value={formData.estimatedDuration}
                            onChange={(value) => handleInputChange("estimatedDuration", value)}
                            placeholder="e.g., 30 days, 3 months, 6 weeks"
                            error={errors.estimatedDuration}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Service Details Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiClipboard className="section-icon" />
                            Service Details
                        </h3>
                        <div className="form-group">
                            <label className="form-label">
                                Service Type <span className="required">*</span>
                            </label>
                            <select
                                value={formData.serviceType}
                                onChange={(e) => handleInputChange("serviceType", e.target.value)}
                                className="role-select"
                                disabled={loading}
                            >
                                <option value="">Select service type</option>
                                {serviceTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.serviceType && (
                                <small className="form-error">{errors.serviceType}</small>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description <span className="required">*</span></label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Enter detailed service description..."
                                className="form-textarea"
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                rows={4}
                                disabled={loading}
                            />
                            {errors.description && (
                                <small className="form-error">{errors.description}</small>
                            )}
                        </div>
                    </div>

                    {/* Location Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiMapPin className="section-icon" />
                            Location Information
                        </h3>
                        <Input
                            label="Address"
                            type="text"
                            value={formData.location.address}
                            onChange={(value) => handleLocationChange("address", value)}
                            placeholder="Enter the complete address"
                            error={errors.address}
                            required
                            disabled={loading}
                        />
                        <div className="form-row">
                            <Input
                                label="City"
                                type="text"
                                value={formData.location.city}
                                onChange={(value) => handleLocationChange("city", value)}
                                placeholder="e.g., Los Angeles"
                                error={errors.city}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="State"
                                type="text"
                                value={formData.location.state}
                                onChange={(value) => handleLocationChange("state", value)}
                                placeholder="e.g., California"
                                error={errors.state}
                                required
                                disabled={loading}
                            />
                        </div>
                        <Input
                            label="ZIP Code"
                            type="text"
                            value={formData.location.zipCode || ""}
                            onChange={(value) => handleLocationChange("zipCode", value)}
                            placeholder="e.g., 90210"
                            disabled={loading}
                        />
                    </div>

                    {/* Budget Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiDollarSign className="section-icon" />
                            Budget Information
                        </h3>
                        <div className="form-row">
                            <Input
                                label="Estimated Cost"
                                type="text"
                                value={formData.budget.estimatedCost.toString()}
                                onChange={(value) => handleBudgetChange("estimatedCost", value ? parseFloat(value) : 0)}
                                placeholder="Enter estimated cost"
                                error={errors.estimatedCost}
                                required
                                disabled={loading}
                            />
                            <div className="form-group">
                                <label className="form-label">
                                    Currency <span className="required">*</span>
                                </label>
                                <select
                                    value={formData.budget.currency}
                                    onChange={(e) => handleBudgetChange("currency", e.target.value)}
                                    className="role-select"
                                    disabled={loading}
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="BRL">BRL - Brazilian Real</option>
                                    <option value="CAD">CAD - Canadian Dollar</option>
                                </select>
                                {errors.currency && (
                                    <small className="form-error">{errors.currency}</small>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Requirements and Deliverables Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiClipboard className="section-icon" />
                            Requirements & Deliverables
                        </h3>
                        <MultiSelect
                            label="Requirements"
                            options={requirementsOptions}
                            value={formData.requirements}
                            onChange={(value) => handleInputChange("requirements", value)}
                            placeholder="Select project requirements..."
                            disabled={loading}
                        />
                        <MultiSelect
                            label="Deliverables"
                            options={deliverablesOptions}
                            value={formData.deliverables}
                            onChange={(value) => handleInputChange("deliverables", value)}
                            placeholder="Select expected deliverables..."
                            disabled={loading}
                        />
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
                            {loading ? "Saving Contract Service..." : "Save Contract Service"}
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

export default RegisterContractServicePage;
