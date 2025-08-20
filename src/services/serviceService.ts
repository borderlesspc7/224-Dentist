import type { Service, CreateServiceData, BillingUnit } from "../types/service";
import { db } from "../lib/firebaseconfig";
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
} from "firebase/firestore";

export const serviceService = {
  // Criar novo serviço
  async createService(serviceData: CreateServiceData): Promise<Service> {
    const now = new Date();
    const serviceToCreate = {
      ...serviceData,
      createdAt: now,
      updatedAt: now,
    };

    const serviceRef = collection(db, "services");
    const serviceDoc = await addDoc(serviceRef, serviceToCreate);

    // Converter o valor do billingUnit para o objeto completo
    const billingUnitMap: Record<
      CreateServiceData["billingUnit"],
      BillingUnit
    > = {
      ft: { value: "ft", label: "Foot (ft)" },
      box: { value: "box", label: "Box" },
      fixed: { value: "fixed", label: "Fixed Price" },
      "": { value: "", label: "" },
    };

    return {
      id: serviceDoc.id,
      ...serviceToCreate,
      billingUnit: billingUnitMap[serviceData.billingUnit],
    };
  },

  // Buscar todos os serviços
  async getAllServices(): Promise<Service[]> {
    const serviceRef = collection(db, "services");
    const q = query(serviceRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const services = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Service;
    });
    return services;
  },

  // Buscar serviço por ID
  async getServiceById(id: string): Promise<Service | null> {
    const serviceRef = doc(db, "services", id);
    const serviceDoc = await getDoc(serviceRef);

    if (!serviceDoc.exists()) {
      return null;
    }

    const data = serviceDoc.data();
    return {
      id: serviceDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Service;
  },

  // Atualizar serviço
  async updateService(
    id: string,
    updates: Partial<CreateServiceData>
  ): Promise<void> {
    const serviceRef = doc(db, "services", id);
    const now = new Date();
    const serviceToUpdate = {
      ...updates,
      updatedAt: now,
    };
    await updateDoc(serviceRef, serviceToUpdate);
  },

  // Deletar serviço
  async deleteService(id: string): Promise<void> {
    const serviceRef = doc(db, "services", id);
    await deleteDoc(serviceRef);
  },
};
