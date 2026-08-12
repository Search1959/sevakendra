import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Citizen, 
  SevaApplication, 
  QueueToken, 
  PaymentRecord, 
  UserAccount, 
  SevaKendra, 
  ServiceItem, 
  GovernmentScheme, 
  Appointment, 
  NotificationLog, 
  AuditLogItem 
} from '../types';
import { 
  INITIAL_CITIZENS, 
  INITIAL_APPLICATIONS, 
  INITIAL_TOKENS, 
  INITIAL_PAYMENTS, 
  INITIAL_ACCOUNTS, 
  INITIAL_KENDRAS, 
  INITIAL_SERVICES, 
  INITIAL_SCHEMES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data/initialData';

// Firestore collection names
export const COLLECTIONS = {
  CITIZENS: 'citizens',
  APPLICATIONS: 'applications',
  TOKENS: 'tokens',
  PAYMENTS: 'payments',
  ACCOUNTS: 'accounts',
  KENDRAS: 'kendras',
  SERVICES: 'services',
  SCHEMES: 'schemes',
  APPOINTMENTS: 'appointments',
  NOTIFICATIONS: 'notifications',
  AUDIT_LOGS: 'auditLogs'
};

// Generic helper to sanitize undefined values for Firestore
function sanitizeData<T extends object>(data: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        clean[key] = sanitizeData(value as object);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

/**
 * Save or update a document in Firestore
 */
export async function saveToFirestore<T extends { id?: string }>(
  collectionName: string, 
  item: T, 
  customId?: string
): Promise<void> {
  try {
    const docId = customId || item.id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, collectionName, docId);
    const sanitized = sanitizeData({ ...item, id: docId });
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.error(`Firestore save error [${collectionName}]:`, error);
  }
}

/**
 * Delete a document from Firestore
 */
export async function deleteFromFirestore(collectionName: string, docId: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Firestore delete error [${collectionName} / ${docId}]:`, error);
  }
}

/**
 * Subscribe to a collection in real time
 */
export function subscribeToCollection<T>(
  collectionName: string, 
  onData: (data: T[]) => void
): () => void {
  const q = query(collection(db, collectionName));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: T[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as unknown as T));
      onData(items);
    },
    (error) => {
      console.warn(`Firestore subscription listener warning [${collectionName}]:`, error);
    }
  );
}

/**
 * Seed initial dataset if database collections are empty
 */
export async function seedInitialFirestoreData(): Promise<void> {
  try {
    const citizensSnap = await getDocs(collection(db, COLLECTIONS.CITIZENS));
    if (citizensSnap.empty) {
      console.log('Seeding initial citizens to Firestore...');
      for (const item of INITIAL_CITIZENS) {
        await saveToFirestore(COLLECTIONS.CITIZENS, item, item.id);
      }
    }

    const appsSnap = await getDocs(collection(db, COLLECTIONS.APPLICATIONS));
    if (appsSnap.empty) {
      console.log('Seeding initial applications to Firestore...');
      for (const item of INITIAL_APPLICATIONS) {
        await saveToFirestore(COLLECTIONS.APPLICATIONS, item, item.id);
      }
    }

    const tokensSnap = await getDocs(collection(db, COLLECTIONS.TOKENS));
    if (tokensSnap.empty) {
      console.log('Seeding initial tokens to Firestore...');
      for (const item of INITIAL_TOKENS) {
        await saveToFirestore(COLLECTIONS.TOKENS, item, item.id);
      }
    }

    const paymentsSnap = await getDocs(collection(db, COLLECTIONS.PAYMENTS));
    if (paymentsSnap.empty) {
      console.log('Seeding initial payments to Firestore...');
      for (const item of INITIAL_PAYMENTS) {
        await saveToFirestore(COLLECTIONS.PAYMENTS, item, item.id);
      }
    }

    const accountsSnap = await getDocs(collection(db, COLLECTIONS.ACCOUNTS));
    if (accountsSnap.empty) {
      console.log('Seeding initial user accounts to Firestore...');
      for (const item of INITIAL_ACCOUNTS) {
        await saveToFirestore(COLLECTIONS.ACCOUNTS, item, item.id);
      }
    }

    const kendrasSnap = await getDocs(collection(db, COLLECTIONS.KENDRAS));
    if (kendrasSnap.empty) {
      console.log('Seeding initial kendras to Firestore...');
      for (const item of INITIAL_KENDRAS) {
        await saveToFirestore(COLLECTIONS.KENDRAS, item, item.id);
      }
    }

    const servicesSnap = await getDocs(collection(db, COLLECTIONS.SERVICES));
    if (servicesSnap.empty) {
      console.log('Seeding initial services to Firestore...');
      for (const item of INITIAL_SERVICES) {
        await saveToFirestore(COLLECTIONS.SERVICES, item, item.id);
      }
    }

    const schemesSnap = await getDocs(collection(db, COLLECTIONS.SCHEMES));
    if (schemesSnap.empty) {
      console.log('Seeding initial schemes to Firestore...');
      for (const item of INITIAL_SCHEMES) {
        await saveToFirestore(COLLECTIONS.SCHEMES, item, item.id);
      }
    }
  } catch (err) {
    console.error('Error seeding initial Firestore dataset:', err);
  }
}
