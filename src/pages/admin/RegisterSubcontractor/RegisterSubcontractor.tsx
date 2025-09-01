"use client";
import React, { useState } from "react";
import { FiHome, FiMapPin, FiPhone, FiTool, FiShield, FiDollarSign } from "react-icons/fi";
import Input from "../../../components/ui/Input/Input";
import MultiSelect from "../../../components/ui/MultiSelect/MultiSelect";
import Button from "../../../components/ui/Button/Button";
import "../../../styles/forms.css";
import type { CreateSubcontractorData } from "../../../types/subcontractor";
import { subcontractorService } from "../../../services/subcontractorService";

interface FormErrors {
    companyName?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    state?: string;
    city?: string;
    address?: string;
    services?: string;
    licenseNumber?: string;
    insuranceExpiry?: string;
    hourlyRate?: string;
    submit?: string;
}

const RegisterSubcontractorPage: React.FC = () => {
    const [formData, setFormData] = useState<CreateSubcontractorData>({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        state: "",
        city: "",
        address: "",
        services: [],
        licenseNumber: "",
        insuranceExpiry: "",
        certifications: [],
        hourlyRate: undefined,
        availability: "available",
        notes: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Service options for MultiSelect
    const serviceOptions = [
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

    // Certification options for MultiSelect
    const certificationOptions = [
        { value: "osha_10", label: "OSHA 10-Hour" },
        { value: "osha_30", label: "OSHA 30-Hour" },
        { value: "confined_space", label: "Confined Space Entry" },
        { value: "hazmat", label: "HAZMAT Certification" },
        { value: "crane_operator", label: "Crane Operator" },
        { value: "welding", label: "Welding Certification" },
        { value: "electrical", label: "Electrical License" },
        { value: "plumbing", label: "Plumbing License" },
        { value: "general_contractor", label: "General Contractor License" },
    ];

    const handleInputChange = (field: keyof CreateSubcontractorData, value: string | string[] | number) => {
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

        if (!formData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }

        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = "Contact person is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
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

        if (formData.services.length === 0) {
            newErrors.services = "Please select at least one service";
        }

        if (formData.hourlyRate !== undefined && formData.hourlyRate < 0) {
            newErrors.hourlyRate = "Hourly rate cannot be negative";
        }

        if (!formData.insuranceExpiry || !formData.insuranceExpiry.trim()) {
            newErrors.insuranceExpiry = "Insurance expiry date is required";
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
            await subcontractorService.createSubcontractor(formData);
            setSuccessMessage("Subcontractor registered successfully!");

            // Limpar o formulário mas manter a mensagem de sucesso
            setFormData({
                companyName: "",
                contactPerson: "",
                email: "",
                phone: "",
                state: "",
                city: "",
                address: "",
                services: [],
                licenseNumber: "",
                insuranceExpiry: "",
                certifications: [],
                hourlyRate: undefined,
                availability: "available",
                notes: "",
            });
            setErrors({});

            setTimeout(() => {
                setSuccessMessage("");
            }, 6000);
        } catch (error) {
            setErrors({
                submit:
                    "Failed to register subcontractor: " +
                    (error instanceof Error ? error.message : String(error)),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            companyName: "",
            contactPerson: "",
            email: "",
            phone: "",
            state: "",
            city: "",
            address: "",
            services: [],
            licenseNumber: "",
            insuranceExpiry: "",
            certifications: [],
            hourlyRate: undefined,
            availability: "available",
            notes: "",
        });
        setErrors({});
        setSuccessMessage("");
    };

    return (
        <div className="form-page-content">
            <div className="content-header">
                <h1 className="page-title">Register Subcontractor</h1>
                <p className="page-subtitle">
                    Add a new subcontractor to the system with their services, certifications, and contact information
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
                    {/* Company Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiHome className="section-icon" />
                            Company Information
                        </h3>
                        <Input
                            label="Company Name"
                            type="text"
                            value={formData.companyName}
                            onChange={(value) => handleInputChange("companyName", value)}
                            placeholder="Enter the company name"
                            error={errors.companyName}
                            required
                            disabled={loading}
                        />
                        <Input
                            label="Contact Person"
                            type="text"
                            value={formData.contactPerson}
                            onChange={(value) => handleInputChange("contactPerson", value)}
                            placeholder="Enter the main contact person"
                            error={errors.contactPerson}
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
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(value) => handleInputChange("email", value)}
                                placeholder="company@example.com"
                                error={errors.email}
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

                    {/* Services Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiTool className="section-icon" />
                            Services & Capabilities
                        </h3>
                        <MultiSelect
                            label="Services Offered"
                            options={serviceOptions}
                            value={formData.services}
                            onChange={(value) => handleInputChange("services", value)}
                            placeholder="Select the services this subcontractor offers..."
                            error={errors.services}
                            required
                            disabled={loading}
                        />
                        <MultiSelect
                            label="Certifications"
                            options={certificationOptions}
                            value={formData.certifications || []}
                            onChange={(value) => handleInputChange("certifications", value)}
                            placeholder="Select relevant certifications..."
                            disabled={loading}
                        />
                    </div>

                    {/* Business Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiShield className="section-icon" />
                            Business Information
                        </h3>
                        <div className="form-row">
                            <Input
                                label="License Number"
                                type="text"
                                value={formData.licenseNumber || ""}
                                onChange={(value) => handleInputChange("licenseNumber", value)}
                                placeholder="Enter license number if applicable"
                                disabled={loading}
                            />
                            <Input
                                label="Insurance Expiry Date"
                                type="date"
                                value={formData.insuranceExpiry || ""}
                                onChange={(value) => handleInputChange("insuranceExpiry", value)}
                                error={errors.insuranceExpiry}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-row">
                            <Input
                                label="Hourly Rate"
                                type="text"
                                value={formData.hourlyRate?.toString() || ""}
                                onChange={(value) => handleInputChange("hourlyRate", value ? parseFloat(value) : 0)}
                                placeholder="Enter hourly rate (optional)"
                                error={errors.hourlyRate}
                                disabled={loading}
                            />
                            <div className="form-group">
                                <label className="form-label">
                                    Availability <span className="required">*</span>
                                </label>
                                <select
                                    value={formData.availability}
                                    onChange={(e) => handleInputChange("availability", e.target.value as "available" | "busy" | "unavailable")}
                                    className="role-select"
                                    disabled={loading}
                                >
                                    <option value="available">Available</option>
                                    <option value="busy">Busy</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </div>
                        </div>
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
                            {loading ? "Saving Subcontractor..." : "Save Subcontractor"}
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

export default RegisterSubcontractorPage;
