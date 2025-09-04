import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebaseconfig';
import type { CreditCard, CreateCreditCardData } from '../types/creditCard';

const COLLECTION_NAME = 'creditCards';

export const creditCardService = {
    // Criar novo cartão de crédito
    async createCreditCard(data: CreateCreditCardData): Promise<CreditCard> {
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
            console.error('Error creating credit card:', error);
            throw new Error('Failed to create credit card');
        }
    },

    // Buscar todos os cartões de crédito
    async getAllCreditCards(): Promise<CreditCard[]> {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as CreditCard[];
        } catch (error) {
            console.error('Error fetching credit cards:', error);
            throw new Error('Failed to fetch credit cards');
        }
    },

    // Buscar cartão por ID
    async getCreditCardById(id: string): Promise<CreditCard | null> {
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
            } as CreditCard;
        } catch (error) {
            console.error('Error fetching credit card:', error);
            throw new Error('Failed to fetch credit card');
        }
    },

    // Atualizar cartão de crédito
    async updateCreditCard(id: string, data: Partial<CreateCreditCardData>): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Error updating credit card:', error);
            throw new Error('Failed to update credit card');
        }
    },

    // Deletar cartão de crédito
    async deleteCreditCard(id: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting credit card:', error);
            throw new Error('Failed to delete credit card');
        }
    },

    // Buscar cartões ativos
    async getActiveCreditCards(): Promise<CreditCard[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('isActive', '==', true),
                orderBy('cardName', 'asc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as CreditCard[];
        } catch (error) {
            console.error('Error fetching active credit cards:', error);
            throw new Error('Failed to fetch active credit cards');
        }
    },

    // Buscar cartões por equipe
    async getCreditCardsByTeam(assignedTo: string): Promise<CreditCard[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('assignedTo', '==', assignedTo),
                where('isActive', '==', true),
                orderBy('cardName', 'asc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as CreditCard[];
        } catch (error) {
            console.error('Error fetching credit cards by team:', error);
            throw new Error('Failed to fetch credit cards by team');
        }
    },
};
