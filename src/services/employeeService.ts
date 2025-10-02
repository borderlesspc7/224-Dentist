import { db } from "../lib/firebaseconfig";
import type { Employee, CreateEmployeeData } from "../types/employee";
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

export const employeeService = {
  // Criar novo funcionário
  async createEmployee(employeeData: CreateEmployeeData): Promise<Employee> {
    const now = new Date();

    // Handle file upload for driver license document
    let driverLicenseDocumentUrl: string | undefined;
    if (employeeData.driverLicenseDocument) {
      // TODO: Implement file upload to storage and get URL
      // For now, we'll store undefined and handle file uploads separately
      driverLicenseDocumentUrl = undefined;
    }

    // Prepare data for Firestore (exclude File objects)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { driverLicenseDocument, ...dataWithoutFiles } = employeeData;

    // Remove undefined values to avoid Firestore errors
    const cleanData = Object.fromEntries(
      Object.entries(dataWithoutFiles).filter(
        ([, value]) => value !== undefined
      )
    );

    const employeeToCreate = {
      ...cleanData,
      ...(driverLicenseDocumentUrl !== undefined && {
        driverLicenseDocument: driverLicenseDocumentUrl,
      }),
      createdAt: now,
      updatedAt: now,
    };

    try {
      const docRef = await addDoc(
        collection(db, "employees"),
        employeeToCreate
      );

      return {
        id: docRef.id,
        ...employeeToCreate,
      } as Employee;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw new Error("Failed to create employee");
    }
  },

  // Buscar todos os funcionários
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const q = query(
        collection(db, "employees"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Employee[];
    } catch (error) {
      console.error("Error getting employees:", error);
      throw new Error("Failed to get employees");
    }
  },

  // Buscar funcionário por ID
  async getEmployeeById(id: string): Promise<Employee | null> {
    try {
      const docRef = doc(db, "employees", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as Employee;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting employee:", error);
      throw new Error("Failed to get employee");
    }
  },

  // Buscar funcionários por nome
  async getEmployeesByName(name: string): Promise<Employee[]> {
    try {
      const q = query(
        collection(db, "employees"),
        where("name", ">=", name),
        where("name", "<=", name + "\uf8ff"),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Employee[];
    } catch (error) {
      console.error("Error searching employees by name:", error);
      throw new Error("Failed to search employees");
    }
  },

  // Buscar funcionários por ITIN
  async getEmployeeByItin(itinNumber: string): Promise<Employee | null> {
    try {
      const q = query(
        collection(db, "employees"),
        where("itinNumber", "==", itinNumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as Employee;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting employee by ITIN:", error);
      throw new Error("Failed to get employee by ITIN");
    }
  },

  // Buscar funcionários por carteira de motorista
  async getEmployeeByDriverLicense(
    driverLicenseNumber: string
  ): Promise<Employee | null> {
    try {
      const q = query(
        collection(db, "employees"),
        where("driverLicenseNumber", "==", driverLicenseNumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as Employee;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting employee by driver license:", error);
      throw new Error("Failed to get employee by driver license");
    }
  },

  // Atualizar funcionário
  async updateEmployee(
    id: string,
    updateData: Partial<CreateEmployeeData>
  ): Promise<Employee> {
    try {
      const docRef = doc(db, "employees", id);

      // Handle file upload for driver license document if provided
      let driverLicenseDocumentUrl: string | undefined;
      if (updateData.driverLicenseDocument) {
        // TODO: Implement file upload to storage and get URL
        // For now, we'll store undefined and handle file uploads separately
        driverLicenseDocumentUrl = undefined;
      }

      // Prepare data for Firestore (exclude File objects)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { driverLicenseDocument, ...dataWithoutFiles } = updateData;

      // Remove undefined values to avoid Firestore errors
      const cleanData = Object.fromEntries(
        Object.entries(dataWithoutFiles).filter(
          ([, value]) => value !== undefined
        )
      );

      // Remove undefined values from cleanData as well
      const finalCleanData = Object.fromEntries(
        Object.entries(cleanData).filter(([, value]) => value !== undefined)
      );

      const updatePayload = {
        ...finalCleanData,
        ...(driverLicenseDocumentUrl !== undefined && {
          driverLicenseDocument: driverLicenseDocumentUrl,
        }),
        updatedAt: new Date(),
      };

      await updateDoc(docRef, updatePayload);

      // Return updated employee
      const updatedEmployee = await this.getEmployeeById(id);
      if (!updatedEmployee) {
        throw new Error("Employee not found after update");
      }

      return updatedEmployee;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw new Error("Failed to update employee");
    }
  },

  // Deletar funcionário
  async deleteEmployee(id: string): Promise<void> {
    try {
      const docRef = doc(db, "employees", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw new Error("Failed to delete employee");
    }
  },

  // Verificar se ITIN já existe
  async checkItinExists(
    itinNumber: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, "employees"),
        where("itinNumber", "==", itinNumber)
      );
      const querySnapshot = await getDocs(q);

      if (excludeId) {
        // Check if any document has the same ITIN but different ID
        return querySnapshot.docs.some((doc) => doc.id !== excludeId);
      } else {
        // Check if any document has the same ITIN
        return !querySnapshot.empty;
      }
    } catch (error) {
      console.error("Error checking ITIN existence:", error);
      throw new Error("Failed to check ITIN existence");
    }
  },

  // Verificar se carteira de motorista já existe
  async checkDriverLicenseExists(
    driverLicenseNumber: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, "employees"),
        where("driverLicenseNumber", "==", driverLicenseNumber)
      );
      const querySnapshot = await getDocs(q);

      if (excludeId) {
        // Check if any document has the same driver license but different ID
        return querySnapshot.docs.some((doc) => doc.id !== excludeId);
      } else {
        // Check if any document has the same driver license
        return !querySnapshot.empty;
      }
    } catch (error) {
      console.error("Error checking driver license existence:", error);
      throw new Error("Failed to check driver license existence");
    }
  },

  // Buscar funcionários com filtros
  async searchEmployees(filters: {
    name?: string;
    itinNumber?: string;
    driverLicenseNumber?: string;
    phone?: string;
  }): Promise<Employee[]> {
    try {
      let q = query(collection(db, "employees"));

      // Apply filters
      if (filters.name) {
        q = query(
          q,
          where("name", ">=", filters.name),
          where("name", "<=", filters.name + "\uf8ff")
        );
      }
      if (filters.itinNumber) {
        q = query(q, where("itinNumber", "==", filters.itinNumber));
      }
      if (filters.driverLicenseNumber) {
        q = query(
          q,
          where("driverLicenseNumber", "==", filters.driverLicenseNumber)
        );
      }
      if (filters.phone) {
        q = query(q, where("phone", "==", filters.phone));
      }

      q = query(q, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Employee[];
    } catch (error) {
      console.error("Error searching employees:", error);
      throw new Error("Failed to search employees");
    }
  },

  // Contar total de funcionários
  async getEmployeeCount(): Promise<number> {
    try {
      const querySnapshot = await getDocs(collection(db, "employees"));
      return querySnapshot.size;
    } catch (error) {
      console.error("Error getting employee count:", error);
      throw new Error("Failed to get employee count");
    }
  },
};
