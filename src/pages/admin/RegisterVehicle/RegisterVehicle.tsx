"use client";
import React, { useState } from "react";
import { FiTruck, FiCalendar, FiDollarSign, FiShield, FiMapPin, FiSettings } from "react-icons/fi";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import "../../../styles/forms.css";
import type { CreateVehicleData } from "../../../types/vehicle";
import { vehicleService } from "../../../services/vehicleService";

interface FormErrors {
    vehicleType?: string;
    make?: string;
    model?: string;
    year?: string;
    vin?: string;
    licensePlate?: string;
    licensePlateRenewalDate?: string;
    color?: string;
    fuelType?: string;
    engineSize?: string;
    transmission?: string;
    mileage?: string;
    financingStatus?: string;
    dotNumber?: string;
    dotRenewalDate?: string;
    purchaseDate?: string;
    purchasePrice?: string;
    currentValue?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    insuranceExpiry?: string;
    registrationExpiry?: string;
    lastMaintenanceDate?: string;
    nextMaintenanceDate?: string;
    location?: string;
    submit?: string;
}

const RegisterVehiclePage: React.FC = () => {
    const [formData, setFormData] = useState<CreateVehicleData>({
        vehicleType: "truck",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        vin: "",
        licensePlate: "",
        licensePlateRenewalDate: "",
        color: "",
        fuelType: "diesel",
        engineSize: "",
        transmission: "manual",
        mileage: 0,
        monthlyMileageHistory: [],
        financingStatus: "not_financed",
        dotNumber: "",
        dotRenewalDate: "",
        purchaseDate: "",
        purchasePrice: 0,
        currentValue: 0,
        insuranceProvider: "",
        insurancePolicyNumber: "",
        insuranceExpiry: "",
        registrationExpiry: "",
        maintenanceSchedule: "monthly",
        lastMaintenanceDate: "",
        nextMaintenanceDate: "",
        status: "active",
        assignedTo: "",
        location: "",
        notes: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleInputChange = (field: keyof CreateVehicleData, value: string | number) => {
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

        if (!formData.make.trim()) {
            newErrors.make = "Make is required";
        }

        if (!formData.model.trim()) {
            newErrors.model = "Model is required";
        }

        if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
            newErrors.year = "Please enter a valid year";
        }

        if (!formData.vin.trim()) {
            newErrors.vin = "VIN is required";
        }

        if (!formData.licensePlate.trim()) {
            newErrors.licensePlate = "License plate is required";
        }

        if (!formData.licensePlateRenewalDate) {
            newErrors.licensePlateRenewalDate = "License plate renewal date is required";
        }

        if (!formData.color.trim()) {
            newErrors.color = "Color is required";
        }

        if (!formData.engineSize.trim()) {
            newErrors.engineSize = "Engine size is required";
        }

        if (formData.mileage < 0) {
            newErrors.mileage = "Mileage cannot be negative";
        }

        if (!formData.purchaseDate) {
            newErrors.purchaseDate = "Purchase date is required";
        }

        if (formData.purchasePrice <= 0) {
            newErrors.purchasePrice = "Purchase price must be greater than 0";
        }

        if (formData.currentValue < 0) {
            newErrors.currentValue = "Current value cannot be negative";
        }

        if (!formData.insuranceProvider.trim()) {
            newErrors.insuranceProvider = "Insurance provider is required";
        }

        if (!formData.insurancePolicyNumber.trim()) {
            newErrors.insurancePolicyNumber = "Insurance policy number is required";
        }

        if (!formData.insuranceExpiry) {
            newErrors.insuranceExpiry = "Insurance expiry date is required";
        }

        if (!formData.registrationExpiry) {
            newErrors.registrationExpiry = "Registration expiry date is required";
        }

        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
        }

        if (!formData.dotNumber.trim()) {
            newErrors.dotNumber = "DOT Number is required";
        }

        if (!formData.dotRenewalDate) {
            newErrors.dotRenewalDate = "DOT renewal date is required";
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
            await vehicleService.createVehicle(formData);
            setSuccessMessage("Vehicle registered successfully!");

            // Limpar o formulário mas manter a mensagem de sucesso
            setFormData({
                vehicleType: "truck",
                make: "",
                model: "",
                year: new Date().getFullYear(),
                vin: "",
                licensePlate: "",
                licensePlateRenewalDate: "",
                color: "",
                fuelType: "diesel",
                engineSize: "",
                transmission: "manual",
                mileage: 0,
                monthlyMileageHistory: [],
                financingStatus: "not_financed",
                dotNumber: "",
                dotRenewalDate: "",
                purchaseDate: "",
                purchasePrice: 0,
                currentValue: 0,
                insuranceProvider: "",
                insurancePolicyNumber: "",
                insuranceExpiry: "",
                registrationExpiry: "",
                maintenanceSchedule: "monthly",
                lastMaintenanceDate: "",
                nextMaintenanceDate: "",
                status: "active",
                assignedTo: "",
                location: "",
                notes: "",
            });
            setErrors({});

            setTimeout(() => {
                setSuccessMessage("");
            }, 6000);
        } catch (error) {
            setErrors({
                submit:
                    "Failed to register vehicle: " +
                    (error instanceof Error ? error.message : String(error)),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            vehicleType: "truck",
            make: "",
            model: "",
            year: new Date().getFullYear(),
            vin: "",
            licensePlate: "",
            licensePlateRenewalDate: "",
            color: "",
            fuelType: "diesel",
            engineSize: "",
            transmission: "manual",
            mileage: 0,
            monthlyMileageHistory: [],
            financingStatus: "not_financed",
            dotNumber: "",
            dotRenewalDate: "",
            purchaseDate: "",
            purchasePrice: 0,
            currentValue: 0,
            insuranceProvider: "",
            insurancePolicyNumber: "",
            insuranceExpiry: "",
            registrationExpiry: "",
            maintenanceSchedule: "monthly",
            lastMaintenanceDate: "",
            nextMaintenanceDate: "",
            status: "active",
            assignedTo: "",
            location: "",
            notes: "",
        });
        setErrors({});
        setSuccessMessage("");
    };

    return (
        <div className="form-page-content">
            <div className="content-header">
                <h1 className="page-title">Register Vehicle</h1>
                <p className="page-subtitle">
                    Add a new vehicle to the fleet with specifications, insurance, and maintenance information
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
                    {/* Vehicle Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiTruck className="section-icon" />
                            Vehicle Information
                        </h3>
                        <div className="form-group">
                            <label className="form-label">
                                Vehicle Type <span className="required">*</span>
                            </label>
                            <select
                                value={formData.vehicleType}
                                onChange={(e) => handleInputChange("vehicleType", e.target.value as any)}
                                className="role-select"
                                disabled={loading}
                            >
                                <option value="truck">Truck</option>
                                <option value="excavator">Excavator</option>
                                <option value="bulldozer">Bulldozer</option>
                                <option value="crane">Crane</option>
                                <option value="loader">Loader</option>
                                <option value="compactor">Compactor</option>
                                <option value="grader">Grader</option>
                                <option value="dump_truck">Dump Truck</option>
                                <option value="concrete_mixer">Concrete Mixer</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <Input
                                label="Make"
                                type="text"
                                value={formData.make}
                                onChange={(value) => handleInputChange("make", value)}
                                placeholder="e.g., Caterpillar, John Deere"
                                error={errors.make}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Model"
                                type="text"
                                value={formData.model}
                                onChange={(value) => handleInputChange("model", value)}
                                placeholder="e.g., 320D, 950M"
                                error={errors.model}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-row">
                            <Input
                                label="Year"
                                type="text"
                                value={formData.year.toString()}
                                onChange={(value) => handleInputChange("year", value ? parseInt(value) : new Date().getFullYear())}
                                placeholder="2024"
                                error={errors.year}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Color"
                                type="text"
                                value={formData.color}
                                onChange={(value) => handleInputChange("color", value)}
                                placeholder="e.g., Yellow, White"
                                error={errors.color}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-row">
                            <Input
                                label="VIN"
                                type="text"
                                value={formData.vin}
                                onChange={(value) => handleInputChange("vin", value)}
                                placeholder="Enter VIN number"
                                error={errors.vin}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="License Plate"
                                type="text"
                                value={formData.licensePlate}
                                onChange={(value) => handleInputChange("licensePlate", value)}
                                placeholder="Enter license plate"
                                error={errors.licensePlate}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-row">
                            <Input
                                label="License Plate Renewal Date"
                                type="date"
                                value={formData.licensePlateRenewalDate}
                                onChange={(value) => handleInputChange("licensePlateRenewalDate", value)}
                                error={errors.licensePlateRenewalDate}
                                required
                                disabled={loading}
                            />
                            <div className="form-group">
                                <label className="form-label">
                                    Financing Status <span className="required">*</span>
                                </label>
                                <select
                                    value={formData.financingStatus}
                                    onChange={(e) => handleInputChange("financingStatus", e.target.value as "financed" | "not_financed")}
                                    className="role-select"
                                    disabled={loading}
                                >
                                    <option value="not_financed">Not Financed</option>
                                    <option value="financed">Financed</option>
                                </select>
                                {errors.financingStatus && (
                                    <span className="error-message">{errors.financingStatus}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-row">
                            <Input
                                label="DOT Number"
                                type="text"
                                value={formData.dotNumber}
                                onChange={(value) => handleInputChange("dotNumber", value)}
                                placeholder="Enter DOT number"
                                error={errors.dotNumber}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="DOT Renewal Date"
                                type="date"
                                value={formData.dotRenewalDate}
                                onChange={(value) => handleInputChange("dotRenewalDate", value)}
                                error={errors.dotRenewalDate}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Technical Specifications Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiSettings className="section-icon" />
                            Technical Specifications
                        </h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Fuel Type <span className="required">*</span>
                                </label>
                                <select
                                    value={formData.fuelType}
                                    onChange={(e) => handleInputChange("fuelType", e.target.value as any)}
                                    className="role-select"
                                    disabled={loading}
                                >
                                    <option value="diesel">Diesel</option>
                                    <option value="gasoline">Gasoline</option>
                                    <option value="electric">Electric</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="lpg">LPG</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Transmission <span className="required">*</span>
                                </label>
                                <select
                                    value={formData.transmission}
                                    onChange={(e) => handleInputChange("transmission", e.target.value as any)}
                                    className="role-select"
                                    disabled={loading}
                                >
                                    <option value="manual">Manual</option>
                                    <option value="automatic">Automatic</option>
                                    <option value="cvt">CVT</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <Input
                                label="Engine Size"
                                type="text"
                                value={formData.engineSize}
                                onChange={(value) => handleInputChange("engineSize", value)}
                                placeholder="e.g., 6.7L, 4.5L"
                                error={errors.engineSize}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Mileage"
                                type="text"
                                value={formData.mileage.toString()}
                                onChange={(value) => handleInputChange("mileage", value ? parseInt(value) : 0)}
                                placeholder="Enter current mileage"
                                error={errors.mileage}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Purchase Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiDollarSign className="section-icon" />
                            Purchase Information
                        </h3>
                        <Input
                            label="Purchase Date"
                            type="date"
                            value={formData.purchaseDate}
                            onChange={(value) => handleInputChange("purchaseDate", value)}
                            error={errors.purchaseDate}
                            required
                            disabled={loading}
                        />
                        <div className="form-row">
                            <Input
                                label="Purchase Price"
                                type="text"
                                value={formData.purchasePrice.toString()}
                                onChange={(value) => handleInputChange("purchasePrice", value ? parseFloat(value) : 0)}
                                placeholder="Enter purchase price"
                                error={errors.purchasePrice}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Current Value"
                                type="text"
                                value={formData.currentValue.toString()}
                                onChange={(value) => handleInputChange("currentValue", value ? parseFloat(value) : 0)}
                                placeholder="Enter current value"
                                error={errors.currentValue}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Insurance Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiShield className="section-icon" />
                            Insurance Information
                        </h3>
                        <Input
                            label="Insurance Provider"
                            type="text"
                            value={formData.insuranceProvider}
                            onChange={(value) => handleInputChange("insuranceProvider", value)}
                            placeholder="Enter insurance provider"
                            error={errors.insuranceProvider}
                            required
                            disabled={loading}
                        />
                        <div className="form-row">
                            <Input
                                label="Policy Number"
                                type="text"
                                value={formData.insurancePolicyNumber}
                                onChange={(value) => handleInputChange("insurancePolicyNumber", value)}
                                placeholder="Enter policy number"
                                error={errors.insurancePolicyNumber}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Insurance Expiry"
                                type="date"
                                value={formData.insuranceExpiry}
                                onChange={(value) => handleInputChange("insuranceExpiry", value)}
                                error={errors.insuranceExpiry}
                                required
                                disabled={loading}
                            />
                        </div>
                        <Input
                            label="Registration Expiry"
                            type="date"
                            value={formData.registrationExpiry}
                            onChange={(value) => handleInputChange("registrationExpiry", value)}
                            error={errors.registrationExpiry}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Maintenance Information Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiCalendar className="section-icon" />
                            Maintenance Information
                        </h3>
                        <div className="form-group">
                            <label className="form-label">
                                Maintenance Schedule <span className="required">*</span>
                            </label>
                            <select
                                value={formData.maintenanceSchedule}
                                onChange={(e) => handleInputChange("maintenanceSchedule", e.target.value as any)}
                                className="role-select"
                                disabled={loading}
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annually">Annually</option>
                                <option value="as_needed">As Needed</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <Input
                                label="Last Maintenance Date"
                                type="date"
                                value={formData.lastMaintenanceDate}
                                onChange={(value) => handleInputChange("lastMaintenanceDate", value)}
                                disabled={loading}
                            />
                            <Input
                                label="Next Maintenance Date"
                                type="date"
                                value={formData.nextMaintenanceDate}
                                onChange={(value) => handleInputChange("nextMaintenanceDate", value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Location and Assignment Section */}
                    <div className="form-section">
                        <h3 className="form-section-title">
                            <FiMapPin className="section-icon" />
                            Location & Assignment
                        </h3>
                        <Input
                            label="Location"
                            type="text"
                            value={formData.location}
                            onChange={(value) => handleInputChange("location", value)}
                            placeholder="Enter current location"
                            error={errors.location}
                            required
                            disabled={loading}
                        />
                        <Input
                            label="Assigned To"
                            type="text"
                            value={formData.assignedTo || ""}
                            onChange={(value) => handleInputChange("assignedTo", value)}
                            placeholder="Enter assigned operator (optional)"
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
                            {loading ? "Saving Vehicle..." : "Save Vehicle"}
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

export default RegisterVehiclePage;
