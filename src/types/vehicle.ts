export interface Vehicle {
    id?: string;
    vehicleType: "truck" | "excavator" | "bulldozer" | "crane" | "loader" | "compactor" | "grader" | "dump_truck" | "concrete_mixer" | "other";
    make: string;
    model: string;
    year: number;
    vin: string;
    licensePlate: string;
    color: string;
    fuelType: "gasoline" | "diesel" | "electric" | "hybrid" | "lpg";
    engineSize: string;
    transmission: "manual" | "automatic" | "cvt";
    mileage: number;
    purchaseDate: string;
    purchasePrice: number;
    currentValue: number;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    insuranceExpiry: string;
    registrationExpiry: string;
    maintenanceSchedule: "monthly" | "quarterly" | "annually" | "as_needed";
    lastMaintenanceDate: string;
    nextMaintenanceDate: string;
    status: "active" | "maintenance" | "retired" | "sold";
    assignedTo?: string;
    location: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateVehicleData {
    vehicleType: "truck" | "excavator" | "bulldozer" | "crane" | "loader" | "compactor" | "grader" | "dump_truck" | "concrete_mixer" | "other";
    make: string;
    model: string;
    year: number;
    vin: string;
    licensePlate: string;
    color: string;
    fuelType: "gasoline" | "diesel" | "electric" | "hybrid" | "lpg";
    engineSize: string;
    transmission: "manual" | "automatic" | "cvt";
    mileage: number;
    purchaseDate: string;
    purchasePrice: number;
    currentValue: number;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    insuranceExpiry: string;
    registrationExpiry: string;
    maintenanceSchedule: "monthly" | "quarterly" | "annually" | "as_needed";
    lastMaintenanceDate: string;
    nextMaintenanceDate: string;
    status: "active" | "maintenance" | "retired" | "sold";
    assignedTo?: string;
    location: string;
    notes?: string;
}
