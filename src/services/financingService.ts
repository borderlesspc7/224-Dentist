import { db } from "../lib/firebaseconfig";
import type { Financing, CreateFinancingData } from "../types/financing";
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

export const financingService = {
    // Criar novo financiamento
    async createFinancing(financingData: CreateFinancingData): Promise<Financing> {
        const now = new Date();

        // Remove undefined values to avoid Firestore errors
        const cleanData = Object.fromEntries(
            Object.entries(financingData).filter(([_, value]) => value !== undefined)
        );

        const financingToCreate = {
            ...cleanData,
            createdAt: now,
            updatedAt: now,
        };

        const financingRef = collection(db, "financings");
        const financingDoc = await addDoc(financingRef, financingToCreate);

        return {
            id: financingDoc.id,
            ...financingData,
            createdAt: now,
            updatedAt: now,
        };
    },

    // Buscar todos os financiamentos
    async getAllFinancings(): Promise<Financing[]> {
        const financingRef = collection(db, "financings");
        const financingQuery = query(financingRef, orderBy("createdAt", "desc"));
        const financingSnapshot = await getDocs(financingQuery);

        const financings = financingSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Financing;
        });

        return financings;
    },

    // Buscar financiamento por ID
    async getFinancingById(id: string): Promise<Financing | null> {
        const financingRef = doc(db, "financings", id);
        const financingSnapshot = await getDoc(financingRef);
        if (!financingSnapshot.exists()) {
            return null;
        }

        const data = financingSnapshot.data();
        return {
            id: financingSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Financing;
    },

    // Atualizar financiamento
    async updateFinancing(
        id: string,
        updates: Partial<CreateFinancingData>
    ): Promise<void> {
        const financingRef = doc(db, "financings", id);
        const now = new Date();
        const updatesToSave = {
            ...updates,
            updatedAt: now,
        };
        await updateDoc(financingRef, updatesToSave);
    },

    // Deletar financiamento
    async deleteFinancing(id: string): Promise<void> {
        const financingRef = doc(db, "financings", id);
        await deleteDoc(financingRef);
    },

    // Buscar financiamentos por projeto
    async getFinancingsByProject(projectId: string): Promise<Financing[]> {
        const financingRef = collection(db, "financings");
        const financingQuery = query(
            financingRef,
            where("projectId", "==", projectId),
            orderBy("createdAt", "desc")
        );
        const financingSnapshot = await getDocs(financingQuery);
        const financings = financingSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Financing;
        });
        return financings;
    },

    // Buscar financiamentos por cliente
    async getFinancingsByClient(clientId: string): Promise<Financing[]> {
        const financingRef = collection(db, "financings");
        const financingQuery = query(
            financingRef,
            where("clientId", "==", clientId),
            orderBy("createdAt", "desc")
        );
        const financingSnapshot = await getDocs(financingQuery);
        const financings = financingSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Financing;
        });
        return financings;
    },

    // Buscar financiamentos por status
    async getFinancingsByStatus(status: "pending" | "approved" | "active" | "paid_off" | "defaulted"): Promise<Financing[]> {
        const financingRef = collection(db, "financings");
        const financingQuery = query(
            financingRef,
            where("status", "==", status),
            orderBy("createdAt", "desc")
        );
        const financingSnapshot = await getDocs(financingQuery);
        const financings = financingSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Financing;
        });
        return financings;
    },

    // Buscar financiamentos por tipo
    async getFinancingsByType(financingType: "loan" | "credit_line" | "equipment_financing" | "working_capital" | "construction_loan"): Promise<Financing[]> {
        const financingRef = collection(db, "financings");
        const financingQuery = query(
            financingRef,
            where("financingType", "==", financingType),
            orderBy("createdAt", "desc")
        );
        const financingSnapshot = await getDocs(financingQuery);
        const financings = financingSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Financing;
        });
        return financings;
    },
};
