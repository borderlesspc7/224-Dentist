import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebaseconfig';
import type { Document, CreateDocumentData, DocumentCategory } from '../types/document';

const COLLECTION_NAME = 'documents';

export const documentService = {
    // Criar novo documento
    async createDocument(data: CreateDocumentData): Promise<Document> {
        try {
            // Upload do arquivo para o Firebase Storage
            const fileRef = ref(storage, `documents/${data.entityType}/${data.entityId}/${Date.now()}_${data.file.name}`);
            const uploadResult = await uploadBytes(fileRef, data.file);
            const fileUrl = await getDownloadURL(uploadResult.ref);

            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                name: data.name,
                category: data.category,
                entityType: data.entityType,
                entityId: data.entityId,
                fileUrl: fileUrl,
                fileName: data.file.name,
                fileSize: data.file.size,
                mimeType: data.file.type,
                expiryDate: data.expiryDate,
                isActive: data.isActive,
                description: data.description,
                uploadedBy: data.uploadedBy,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return {
                id: docRef.id,
                name: data.name,
                category: data.category,
                entityType: data.entityType,
                entityId: data.entityId,
                fileUrl: fileUrl,
                fileName: data.file.name,
                fileSize: data.file.size,
                mimeType: data.file.type,
                expiryDate: data.expiryDate,
                isActive: data.isActive,
                description: data.description,
                uploadedBy: data.uploadedBy,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        } catch (error) {
            console.error('Error creating document:', error);
            throw new Error('Failed to create document');
        }
    },

    // Buscar todos os documentos
    async getAllDocuments(): Promise<Document[]> {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Document[];
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw new Error('Failed to fetch documents');
        }
    },

    // Buscar documento por ID
    async getDocumentById(id: string): Promise<Document | null> {
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
            } as Document;
        } catch (error) {
            console.error('Error fetching document:', error);
            throw new Error('Failed to fetch document');
        }
    },

    // Buscar documentos por entidade
    async getDocumentsByEntity(entityType: string, entityId: string): Promise<Document[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('entityType', '==', entityType),
                where('entityId', '==', entityId),
                where('isActive', '==', true),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Document[];
        } catch (error) {
            console.error('Error fetching documents by entity:', error);
            throw new Error('Failed to fetch documents by entity');
        }
    },

    // Buscar documentos por categoria
    async getDocumentsByCategory(category: string): Promise<Document[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('category', '==', category),
                where('isActive', '==', true),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Document[];
        } catch (error) {
            console.error('Error fetching documents by category:', error);
            throw new Error('Failed to fetch documents by category');
        }
    },

    // Atualizar documento
    async updateDocument(id: string, data: Partial<Omit<CreateDocumentData, 'file'>>): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Error updating document:', error);
            throw new Error('Failed to update document');
        }
    },

    // Deletar documento
    async deleteDocument(id: string): Promise<void> {
        try {
            // Primeiro, buscar o documento para obter a URL do arquivo
            const document = await this.getDocumentById(id);
            if (!document) {
                throw new Error('Document not found');
            }

            // Deletar o arquivo do Storage
            const fileRef = ref(storage, document.fileUrl);
            await deleteObject(fileRef);

            // Deletar o documento do Firestore
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw new Error('Failed to delete document');
        }
    },

    // Buscar documentos próximos do vencimento
    async getDocumentsNearExpiry(days: number = 30): Promise<Document[]> {
        try {
            const today = new Date();
            const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));

            const q = query(
                collection(db, COLLECTION_NAME),
                where('expiryDate', '>=', today.toISOString().split('T')[0]),
                where('expiryDate', '<=', futureDate.toISOString().split('T')[0]),
                where('isActive', '==', true),
                orderBy('expiryDate', 'asc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Document[];
        } catch (error) {
            console.error('Error fetching documents near expiry:', error);
            throw new Error('Failed to fetch documents near expiry');
        }
    },

    // Obter categorias de documentos
    getDocumentCategories(): DocumentCategory[] {
        return [
            {
                id: 'insurance',
                name: 'Insurance',
                description: 'Insurance documents and policies',
                icon: '🛡️',
                color: '#3b82f6'
            },
            {
                id: 'license',
                name: 'License',
                description: 'Licenses and permits',
                icon: '📋',
                color: '#10b981'
            },
            {
                id: 'certification',
                name: 'Certification',
                description: 'Certifications and qualifications',
                icon: '🏆',
                color: '#f59e0b'
            },
            {
                id: 'contract',
                name: 'Contract',
                description: 'Contracts and agreements',
                icon: '📄',
                color: '#8b5cf6'
            },
            {
                id: 'invoice',
                name: 'Invoice',
                description: 'Invoices and receipts',
                icon: '🧾',
                color: '#ef4444'
            },
            {
                id: 'other',
                name: 'Other',
                description: 'Other documents',
                icon: '📁',
                color: '#6b7280'
            }
        ];
    },
};
