import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebaseconfig';
import type { BankAccount, CreateBankAccountData } from '../types/bankAccount';

const COLLECTION_NAME = 'bankAccounts';

export const bankAccountService = {
    // Criar nova conta bancária
    async createBankAccount(data: CreateBankAccountData): Promise<BankAccount> {
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
            console.error('Error creating bank account:', error);
            throw new Error('Failed to create bank account');
        }
    },

    // Buscar todas as contas bancárias
    async getAllBankAccounts(): Promise<BankAccount[]> {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as BankAccount[];
        } catch (error) {
            console.error('Error fetching bank accounts:', error);
            throw new Error('Failed to fetch bank accounts');
        }
    },

    // Buscar conta bancária por ID
    async getBankAccountById(id: string): Promise<BankAccount | null> {
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
            } as BankAccount;
        } catch (error) {
            console.error('Error fetching bank account:', error);
            throw new Error('Failed to fetch bank account');
        }
    },

    // Atualizar conta bancária
    async updateBankAccount(id: string, data: Partial<CreateBankAccountData>): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Error updating bank account:', error);
            throw new Error('Failed to update bank account');
        }
    },

    // Deletar conta bancária
    async deleteBankAccount(id: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting bank account:', error);
            throw new Error('Failed to delete bank account');
        }
    },

    // Buscar contas ativas
    async getActiveBankAccounts(): Promise<BankAccount[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('isActive', '==', true),
                orderBy('accountName', 'asc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as BankAccount[];
        } catch (error) {
            console.error('Error fetching active bank accounts:', error);
            throw new Error('Failed to fetch active bank accounts');
        }
    },
};
