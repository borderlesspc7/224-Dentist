import { db } from "../lib/firebaseconfig";
import type { Client, CreateClientData } from "../types/client";
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

export const clientService = {
  // Criar novo cliente
  async createClient(clientData: CreateClientData): Promise<Client> {
    const now = new Date();
    const clientToCreate = {
      ...clientData,
      createdAt: now,
      updatedAt: now,
    };
    const clientRef = collection(db, "clients");
    const clientDoc = await addDoc(clientRef, clientToCreate);
    return {
      id: clientDoc.id,
      ...clientData,
      createdAt: now,
      updatedAt: now,
    };
  },

  // Buscar todos os clientes
  async getAllClients(): Promise<Client[]> {
    const clientRef = collection(db, "clients");
    const clientQuery = query(clientRef, orderBy("createdAt", "desc"));
    const clientSnapshot = await getDocs(clientQuery);

    const clients = clientSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Client;
    });

    return clients;
  },

  // Buscar cliente por ID
  async getClientById(id: string): Promise<Client | null> {
    const clientRef = doc(db, "clients", id);
    const clientSnapshot = await getDoc(clientRef);
    if (!clientSnapshot.exists()) {
      return null;
    }

    const data = clientSnapshot.data();
    return {
      id: clientSnapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Client;
  },

  // Atualizar cliente
  async updateClient(
    id: string,
    updates: Partial<CreateClientData>
  ): Promise<void> {
    const clientRef = doc(db, "clients", id);
    const now = new Date();
    const updatesToSave = {
      ...updates,
      updatedAt: now,
    };
    await updateDoc(clientRef, updatesToSave);
  },

  // Deletar cliente
  async deleteClient(id: string): Promise<void> {
    const clientRef = doc(db, "clients", id);
    await deleteDoc(clientRef);
  },

  // Buscar clientes por estado
  async getClientsByState(state: string): Promise<Client[]> {
    const clientRef = collection(db, "clients");
    const clientQuery = query(
      clientRef,
      where("state", "==", state),
      orderBy("createdAt", "desc")
    );
    const clientSnapshot = await getDocs(clientQuery);
    const clients = clientSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Client;
    });
    return clients;
  },

  // Buscar clientes por cidade
  async getClientsByCity(city: string): Promise<Client[]> {
    const clientRef = collection(db, "clients");
    const clientSnapshot = await getDocs(
      query(clientRef, where("city", "==", city), orderBy("createdAt", "desc"))
    );
    const clients = clientSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Client;
    });
    return clients;
  },
};
