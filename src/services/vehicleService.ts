import { db } from "../lib/firebaseconfig";
import type { Vehicle, CreateVehicleData } from "../types/vehicle";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    where,
} from "firebase/firestore";

export const vehicleService = {
    // Criar novo veículo
    async createVehicle(vehicleData: CreateVehicleData): Promise<Vehicle> {
        const now = new Date();

        // Remove undefined values to avoid Firestore errors
        const cleanData = Object.fromEntries(
            Object.entries(vehicleData).filter(([_, value]) => value !== undefined)
        );

        const vehicleToCreate = {
            ...cleanData,
            createdAt: now,
            updatedAt: now,
        };

        const vehicleRef = collection(db, "vehicles");
        const vehicleDoc = await addDoc(vehicleRef, vehicleToCreate);

        return {
            id: vehicleDoc.id,
            ...vehicleData,
            createdAt: now,
            updatedAt: now,
        };
    },

    // Buscar todos os veículos
    async getAllVehicles(): Promise<Vehicle[]> {
        const vehicleRef = collection(db, "vehicles");
        const vehicleQuery = query(vehicleRef, orderBy("createdAt", "desc"));
        const vehicleSnapshot = await getDocs(vehicleQuery);

        const vehicles = vehicleSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Vehicle;
        });

        return vehicles;
    },

    // Buscar veículo por ID
    async getVehicleById(id: string): Promise<Vehicle | null> {
        const vehicleRef = doc(db, "vehicles", id);
        const vehicleSnapshot = await getDoc(vehicleRef);
        if (!vehicleSnapshot.exists()) {
            return null;
        }

        const data = vehicleSnapshot.data();
        return {
            id: vehicleSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Vehicle;
    },

    // Atualizar veículo
    async updateVehicle(
        id: string,
        updates: Partial<CreateVehicleData>
    ): Promise<void> {
        const vehicleRef = doc(db, "vehicles", id);
        const now = new Date();
        const updatesToSave = {
            ...updates,
            updatedAt: now,
        };
        await updateDoc(vehicleRef, updatesToSave);
    },

    // Deletar veículo
    async deleteVehicle(id: string): Promise<void> {
        const vehicleRef = doc(db, "vehicles", id);
        await deleteDoc(vehicleRef);
    },

    // Buscar veículos por tipo
    async getVehiclesByType(vehicleType: "truck" | "excavator" | "bulldozer" | "crane" | "loader" | "compactor" | "grader" | "dump_truck" | "concrete_mixer" | "other"): Promise<Vehicle[]> {
        const vehicleRef = collection(db, "vehicles");
        const vehicleQuery = query(
            vehicleRef,
            where("vehicleType", "==", vehicleType),
            orderBy("createdAt", "desc")
        );
        const vehicleSnapshot = await getDocs(vehicleQuery);
        const vehicles = vehicleSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Vehicle;
        });
        return vehicles;
    },

    // Buscar veículos por status
    async getVehiclesByStatus(status: "active" | "maintenance" | "retired" | "sold"): Promise<Vehicle[]> {
        const vehicleRef = collection(db, "vehicles");
        const vehicleQuery = query(
            vehicleRef,
            where("status", "==", status),
            orderBy("createdAt", "desc")
        );
        const vehicleSnapshot = await getDocs(vehicleQuery);
        const vehicles = vehicleSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Vehicle;
        });
        return vehicles;
    },

    // Buscar veículos por localização
    async getVehiclesByLocation(location: string): Promise<Vehicle[]> {
        const vehicleRef = collection(db, "vehicles");
        const vehicleQuery = query(
            vehicleRef,
            where("location", "==", location),
            orderBy("createdAt", "desc")
        );
        const vehicleSnapshot = await getDocs(vehicleQuery);
        const vehicles = vehicleSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Vehicle;
        });
        return vehicles;
    },

    // Buscar veículos por marca
    async getVehiclesByMake(make: string): Promise<Vehicle[]> {
        const vehicleRef = collection(db, "vehicles");
        const vehicleQuery = query(
            vehicleRef,
            where("make", "==", make),
            orderBy("createdAt", "desc")
        );
        const vehicleSnapshot = await getDocs(vehicleQuery);
        const vehicles = vehicleSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Vehicle;
        });
        return vehicles;
    },
};
