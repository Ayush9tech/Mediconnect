import { collection, doc, query, where } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { useUser } from '@/firebase/provider';

let firebaseServices: ReturnType<typeof initializeFirebase> | null = null;

function getFirebaseServices() {
  if (!firebaseServices) {
    firebaseServices = initializeFirebase();
  }
  return firebaseServices;
}

export function useUserScopedCollection(collectionName: string) {
  const { user } = useUser();
  if (!user) return null;
  const { firestore } = getFirebaseServices();
  return collection(firestore, 'users', user.uid, collectionName);
}

export function useUserScopedDoc(collectionName: string, docId: string) {
  const { user } = useUser();
  if (!user) return null;
  const { firestore } = getFirebaseServices();
  return doc(firestore, 'users', user.uid, collectionName, docId);
}

export function getUserScopedCollection(userId: string, collectionName: string) {
  const { firestore } = getFirebaseServices();
  return collection(firestore, 'users', userId, collectionName);
}

export function getUserScopedDoc(userId: string, collectionName: string, docId: string) {
  const { firestore } = getFirebaseServices();
  return doc(firestore, 'users', userId, collectionName, docId);
}