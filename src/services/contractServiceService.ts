import { db } from "../lib/firebaseconfig";
import type { ContractService, CreateContractServiceData } from "../types/contractService";
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

export const contractServiceService = {
    // Criar novo serviço contratado
    async createContractService(contractServiceData: CreateContractServiceData): Promise<ContractService> {
        const now = new Date();
        
        // Remove undefined values to avoid Firestore errors
        const cleanData = Object.fromEntries(
            Object.entries(contractServiceData).filter(([_, value]) => value !== undefined)
        );
        
        const contractServiceToCreate = {
            ...cleanData,
            createdAt: now,
            updatedAt: now,
        };
        
        const contractServiceRef = collection(db, "contractServices");
        const contractServiceDoc = await addDoc(contractServiceRef, contractServiceToCreate);
        return {
            id: contractServiceDoc.id,
            ...contractServiceData,
            createdAt: now,
            updatedAt: now,
        };
    },

    // Buscar todos os serviços contratados
    async getAllContractServices(): Promise<ContractService[]> {
        const contractServiceRef = collection(db, "contractServices");
        const contractServiceQuery = query(contractServiceRef, orderBy("createdAt", "desc"));
        const contractServiceSnapshot = await getDocs(contractServiceQuery);

        const contractServices = contractServiceSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as ContractService;
        });

        return contractServices;
    },

    // Buscar serviço contratado por ID
    async getContractServiceById(id: string): Promise<ContractService | null> {
        const contractServiceRef = doc(db, "contractServices", id);
        const contractServiceSnapshot = await getDoc(contractServiceRef);
        if (!contractServiceSnapshot.exists()) {
            return null;
        }

        const data = contractServiceSnapshot.data();
        return {
            id: contractServiceSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        } as ContractService;
    },

    // Atualizar serviço contratado
    async updateContractService(
        id: string,
        updates: Partial<CreateContractServiceData>
    ): Promise<void> {
        const contractServiceRef = doc(db, "contractServices", id);
        const now = new Date();
        const updatesToSave = {
            ...updates,
            updatedAt: now,
        };
        await updateDoc(contractServiceRef, updatesToSave);
    },

    // Deletar serviço contratado
    async deleteContractService(id: string): Promise<void> {
        const contractServiceRef = doc(db, "contractServices", id);
        await deleteDoc(contractServiceRef);
    },

    // Buscar serviços por cliente
    async getContractServicesByClient(clientId: string): Promise<ContractService[]> {
        const contractServiceRef = collection(db, "contractServices");
        const contractServiceQuery = query(
            contractServiceRef,
            where("clientId", "==", clientId),
            orderBy("createdAt", "desc")
        );
        const contractServiceSnapshot = await getDocs(contractServiceQuery);
        const contractServices = contractServiceSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as ContractService;
        });
        return contractServices;
    },

    // Buscar serviços por subcontratado
    async getContractServicesBySubcontractor(subcontractorId: string): Promise<ContractService[]> {
        const contractServiceRef = collection(db, "contractServices");
        const contractServiceQuery = query(
            contractServiceRef,
            where("subcontractorId", "==", subcontractorId),
            orderBy("createdAt", "desc")
        );
        const contractServiceSnapshot = await getDocs(contractServiceQuery);
        const contractServices = contractServiceSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as ContractService;
        });
        return contractServices;
    },

    // Buscar serviços por status
    async getContractServicesByStatus(status: "pending" | "in_progress" | "completed" | "cancelled"): Promise<ContractService[]> {
        const contractServiceRef = collection(db, "contractServices");
        const contractServiceQuery = query(
            contractServiceRef,
            where("status", "==", status),
            orderBy("createdAt", "desc")
        );
        const contractServiceSnapshot = await getDocs(contractServiceQuery);
        const contractServices = contractServiceSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as ContractService;
        });
        return contractServices;
    },

    // Buscar serviços por tipo
    async getContractServicesByType(serviceType: string): Promise<ContractService[]> {
        const contractServiceRef = collection(db, "contractServices");
        const contractServiceQuery = query(
            contractServiceRef,
            where("serviceType", "==", serviceType),
            orderBy("createdAt", "desc")
        );
        const contractServiceSnapshot = await getDocs(contractServiceQuery);
        const contractServices = contractServiceSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as ContractService;
        });
        return contractServices;
    },
};
