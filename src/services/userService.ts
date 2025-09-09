import { db } from "../lib/firebaseconfig";
import type { UserProfile } from "../types/user";
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

export const userService = {
  // Buscar todos os usuários
  async getAllUsers(): Promise<UserProfile[]> {
    const userRef = collection(db, "users");
    const userQuery = query(userRef, orderBy("createdAt", "desc"));
    const userSnapshot = await getDocs(userQuery);

    const users = userSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid || doc.id,
        email: data.email || "",
        displayName: data.displayName || "",
        role: data.role || "user",
        allowedPaths: data.allowedPaths || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile & { id: string; createdAt: Date; updatedAt: Date };
    });

    return users;
  },

  // Buscar usuário por ID
  async getUserById(
    id: string
  ): Promise<
    (UserProfile & { id: string; createdAt: Date; updatedAt: Date }) | null
  > {
    const userRef = doc(db, "users", id);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      return null;
    }

    const data = userSnapshot.data();
    return {
      id: userSnapshot.id,
      uid: data.uid || userSnapshot.id,
      email: data.email || "",
      displayName: data.displayName || "",
      role: data.role || "user",
      allowedPaths: data.allowedPaths || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  },

  // Atualizar usuário
  async updateUser(id: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, "users", id);
    const now = new Date();
    const updatesToSave = {
      ...updates,
      updatedAt: now,
    };
    await updateDoc(userRef, updatesToSave);
  },

  // Deletar usuário
  async deleteUser(id: string): Promise<void> {
    const userRef = doc(db, "users", id);
    await deleteDoc(userRef);
  },

  // Buscar usuários por role
  async getUsersByRole(role: string): Promise<UserProfile[]> {
    const userRef = collection(db, "users");
    const userQuery = query(
      userRef,
      where("role", "==", role),
      orderBy("createdAt", "desc")
    );
    const userSnapshot = await getDocs(userQuery);
    const users = userSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid || doc.id,
        email: data.email || "",
        displayName: data.displayName || "",
        role: data.role || "user",
        allowedPaths: data.allowedPaths || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile & { id: string; createdAt: Date; updatedAt: Date };
    });
    return users;
  },
};
