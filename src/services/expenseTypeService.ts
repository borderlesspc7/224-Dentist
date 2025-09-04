import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebaseconfig';
import type { ExpenseType, CreateExpenseTypeData } from '../types/expenseType';

const COLLECTION_NAME = 'expenseTypes';

export const expenseTypeService = {
    // Criar novo tipo de despesa
    async createExpenseType(data: CreateExpenseTypeData): Promise<ExpenseType> {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return {
                id: docRef.id,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        } catch (error) {
            console.error('Error creating expense type:', error);
            throw new Error('Failed to create expense type');
        }
    },

    // Buscar todos os tipos de despesa
    async getAllExpenseTypes(): Promise<ExpenseType[]> {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as ExpenseType[];
        } catch (error) {
            console.error('Error fetching expense types:', error);
            throw new Error('Failed to fetch expense types');
        }
    },

    // Buscar tipo de despesa por ID
    async getExpenseTypeById(id: string): Promise<ExpenseType | null> {
        try {
            const q = query(collection(db, COLLECTION_NAME), where('__name__', '==', id));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            } as ExpenseType;
        } catch (error) {
            console.error('Error fetching expense type:', error);
            throw new Error('Failed to fetch expense type');
        }
    },

    // Atualizar tipo de despesa
    async updateExpenseType(id: string, data: Partial<CreateExpenseTypeData>): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Error updating expense type:', error);
            throw new Error('Failed to update expense type');
        }
    },

    // Deletar tipo de despesa
    async deleteExpenseType(id: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting expense type:', error);
            throw new Error('Failed to delete expense type');
        }
    },

    // Buscar tipos ativos
    async getActiveExpenseTypes(): Promise<ExpenseType[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('isActive', '==', true),
                orderBy('name', 'asc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as ExpenseType[];
        } catch (error) {
            console.error('Error fetching active expense types:', error);
            throw new Error('Failed to fetch active expense types');
        }
    },

    // Buscar tipos por categoria
    async getExpenseTypesByCategory(category: string): Promise<ExpenseType[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('category', '==', category),
                where('isActive', '==', true),
                orderBy('name', 'asc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as ExpenseType[];
        } catch (error) {
            console.error('Error fetching expense types by category:', error);
            throw new Error('Failed to fetch expense types by category');
        }
    },
};
