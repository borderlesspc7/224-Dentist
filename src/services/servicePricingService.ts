import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebaseconfig';
import type { ServicePricing, CreateServicePricingData, PricingHistory, CreatePricingHistoryData } from '../types/servicePricing';

const PRICING_COLLECTION = 'servicePricing';
const HISTORY_COLLECTION = 'pricingHistory';

export const servicePricingService = {
    // Criar novo preço de serviço
    async createServicePricing(data: CreateServicePricingData): Promise<ServicePricing> {
        try {
            const docRef = await addDoc(collection(db, PRICING_COLLECTION), {
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
            console.error('Error creating service pricing:', error);
            throw new Error('Failed to create service pricing');
        }
    },

    // Buscar todos os preços de serviços
    async getAllServicePricing(): Promise<ServicePricing[]> {
        try {
            const q = query(collection(db, PRICING_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as ServicePricing[];
        } catch (error) {
            console.error('Error fetching service pricing:', error);
            throw new Error('Failed to fetch service pricing');
        }
    },

    // Buscar preço por ID
    async getServicePricingById(id: string): Promise<ServicePricing | null> {
        try {
            const q = query(collection(db, PRICING_COLLECTION), where('__name__', '==', id));
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
            } as ServicePricing;
        } catch (error) {
            console.error('Error fetching service pricing:', error);
            throw new Error('Failed to fetch service pricing');
        }
    },

    // Buscar preços por serviço
    async getPricingByService(serviceId: string): Promise<ServicePricing[]> {
        try {
            const q = query(
                collection(db, PRICING_COLLECTION),
                where('serviceId', '==', serviceId),
                where('isActive', '==', true),
                orderBy('effectiveDate', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as ServicePricing[];
        } catch (error) {
            console.error('Error fetching pricing by service:', error);
            throw new Error('Failed to fetch pricing by service');
        }
    },

    // Buscar preços por cliente
    async getPricingByClient(clientId: string): Promise<ServicePricing[]> {
        try {
            const q = query(
                collection(db, PRICING_COLLECTION),
                where('clientId', '==', clientId),
                where('isActive', '==', true),
                orderBy('effectiveDate', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as ServicePricing[];
        } catch (error) {
            console.error('Error fetching pricing by client:', error);
            throw new Error('Failed to fetch pricing by client');
        }
    },

    // Buscar preço específico para serviço e cliente
    async getPricingForServiceAndClient(serviceId: string, clientId: string): Promise<ServicePricing | null> {
        try {
            const q = query(
                collection(db, PRICING_COLLECTION),
                where('serviceId', '==', serviceId),
                where('clientId', '==', clientId),
                where('isActive', '==', true),
                orderBy('effectiveDate', 'desc')
            );
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
            } as ServicePricing;
        } catch (error) {
            console.error('Error fetching pricing for service and client:', error);
            throw new Error('Failed to fetch pricing for service and client');
        }
    },

    // Atualizar preço de serviço
    async updateServicePricing(id: string, data: Partial<CreateServicePricingData>): Promise<void> {
        try {
            const docRef = doc(db, PRICING_COLLECTION, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Error updating service pricing:', error);
            throw new Error('Failed to update service pricing');
        }
    },

    // Deletar preço de serviço
    async deleteServicePricing(id: string): Promise<void> {
        try {
            const docRef = doc(db, PRICING_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting service pricing:', error);
            throw new Error('Failed to delete service pricing');
        }
    },

    // Criar histórico de preços
    async createPricingHistory(data: CreatePricingHistoryData): Promise<PricingHistory> {
        try {
            const docRef = await addDoc(collection(db, HISTORY_COLLECTION), {
                ...data,
                createdAt: new Date(),
            });

            return {
                id: docRef.id,
                ...data,
                createdAt: new Date(),
            };
        } catch (error) {
            console.error('Error creating pricing history:', error);
            throw new Error('Failed to create pricing history');
        }
    },

    // Buscar histórico de preços
    async getPricingHistory(serviceId: string, clientId: string): Promise<PricingHistory[]> {
        try {
            const q = query(
                collection(db, HISTORY_COLLECTION),
                where('serviceId', '==', serviceId),
                where('clientId', '==', clientId),
                orderBy('changeDate', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as PricingHistory[];
        } catch (error) {
            console.error('Error fetching pricing history:', error);
            throw new Error('Failed to fetch pricing history');
        }
    },
};
