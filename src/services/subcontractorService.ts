import { db } from "../lib/firebaseconfig";
import type {
  Subcontractor,
  CreateSubcontractorData,
} from "../types/subcontractor";
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

export const subcontractorService = {
  // Criar novo subcontratado
  async createSubcontractor(
    subcontractorData: CreateSubcontractorData
  ): Promise<Subcontractor> {
    const now = new Date();

    // Handle file uploads for insurance documents
    let insuranceDocumentUrls: string[] = [];
    if (
      subcontractorData.insuranceDocuments &&
      subcontractorData.insuranceDocuments.length > 0
    ) {
      // TODO: Implement file upload to storage and get URLs
      // For now, we'll store empty array and handle file uploads separately
      insuranceDocumentUrls = [];
    }

    // Prepare data for Firestore (exclude File objects)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { insuranceDocuments, ...dataWithoutFiles } = subcontractorData;

    // Remove undefined values to avoid Firestore errors
    const cleanData = Object.fromEntries(
      Object.entries(dataWithoutFiles).filter(
        ([, value]) => value !== undefined
      )
    );

    const subcontractorToCreate = {
      ...cleanData,
      insuranceDocuments: insuranceDocumentUrls,
      createdAt: now,
      updatedAt: now,
    };

    const subcontractorRef = collection(db, "subcontractors");
    const subcontractorDoc = await addDoc(
      subcontractorRef,
      subcontractorToCreate
    );

    return {
      id: subcontractorDoc.id,
      ...dataWithoutFiles,
      insuranceDocuments: insuranceDocumentUrls,
      createdAt: now,
      updatedAt: now,
    };
  },

  // Buscar todos os subcontratados
  async getAllSubcontractors(): Promise<Subcontractor[]> {
    const subcontractorRef = collection(db, "subcontractors");
    const subcontractorQuery = query(
      subcontractorRef,
      orderBy("createdAt", "desc")
    );
    const subcontractorSnapshot = await getDocs(subcontractorQuery);

    const subcontractors = subcontractorSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Subcontractor;
    });

    return subcontractors;
  },

  // Buscar subcontratado por ID
  async getSubcontractorById(id: string): Promise<Subcontractor | null> {
    const subcontractorRef = doc(db, "subcontractors", id);
    const subcontractorSnapshot = await getDoc(subcontractorRef);
    if (!subcontractorSnapshot.exists()) {
      return null;
    }

    const data = subcontractorSnapshot.data();
    return {
      id: subcontractorSnapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Subcontractor;
  },

  // Atualizar subcontratado
  async updateSubcontractor(
    id: string,
    updates: Partial<CreateSubcontractorData>
  ): Promise<void> {
    const subcontractorRef = doc(db, "subcontractors", id);
    const now = new Date();
    const updatesToSave = {
      ...updates,
      updatedAt: now,
    };
    await updateDoc(subcontractorRef, updatesToSave);
  },

  // Deletar subcontratado
  async deleteSubcontractor(id: string): Promise<void> {
    const subcontractorRef = doc(db, "subcontractors", id);
    await deleteDoc(subcontractorRef);
  },

  // Buscar subcontratados por estado
  async getSubcontractorsByState(state: string): Promise<Subcontractor[]> {
    const subcontractorRef = collection(db, "subcontractors");
    const subcontractorQuery = query(
      subcontractorRef,
      where("state", "==", state),
      orderBy("createdAt", "desc")
    );
    const subcontractorSnapshot = await getDocs(subcontractorQuery);
    const subcontractors = subcontractorSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Subcontractor;
    });
    return subcontractors;
  },

  // Buscar subcontratados por cidade
  async getSubcontractorsByCity(city: string): Promise<Subcontractor[]> {
    const subcontractorRef = collection(db, "subcontractors");
    const subcontractorSnapshot = await getDocs(
      query(
        subcontractorRef,
        where("city", "==", city),
        orderBy("createdAt", "desc")
      )
    );
    const subcontractors = subcontractorSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Subcontractor;
    });
    return subcontractors;
  },

  // Buscar subcontratados por disponibilidade
  async getSubcontractorsByAvailability(
    availability: "available" | "busy" | "unavailable"
  ): Promise<Subcontractor[]> {
    const subcontractorRef = collection(db, "subcontractors");
    const subcontractorQuery = query(
      subcontractorRef,
      where("availability", "==", availability),
      orderBy("createdAt", "desc")
    );
    const subcontractorSnapshot = await getDocs(subcontractorQuery);
    const subcontractors = subcontractorSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Subcontractor;
    });
    return subcontractors;
  },

  // Buscar subcontratados por serviço
  async getSubcontractorsByService(service: string): Promise<Subcontractor[]> {
    const subcontractorRef = collection(db, "subcontractors");
    const subcontractorQuery = query(
      subcontractorRef,
      where("services", "array-contains", service),
      orderBy("createdAt", "desc")
    );
    const subcontractorSnapshot = await getDocs(subcontractorQuery);
    const subcontractors = subcontractorSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Subcontractor;
    });
    return subcontractors;
  },
};
