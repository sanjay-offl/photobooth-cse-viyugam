// Firebase Storage & Firestore integration
// Set these environment variables in .env.local for production:
//   NEXT_PUBLIC_FIREBASE_API_KEY
//   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
//   NEXT_PUBLIC_FIREBASE_PROJECT_ID
//   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
//   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
//   NEXT_PUBLIC_FIREBASE_APP_ID

import { initializeApp, getApps } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
}

function getApp() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
}

export async function uploadPhotoToStorage(
  photoId: string,
  dataUrl: string,
  format: 'jpeg' | 'png' = 'jpeg'
): Promise<UploadResult> {
  const app = getApp();
  const storage = getStorage(app);
  const storagePath = `photos/${photoId}.${format}`;
  const storageRef = ref(storage, storagePath);

  const base64Data = dataUrl.split(',')[1];
  await uploadString(storageRef, base64Data, 'base64', {
    contentType: `image/${format}`,
  });

  const downloadUrl = await getDownloadURL(storageRef);
  return { downloadUrl, storagePath };
}

export interface PhotoRecord {
  id: string;
  storagePath: string;
  downloadUrl: string;
  createdAt: Date;
  expiresAt: Date;
  format: string;
  width: number;
  height: number;
  uploadStatus: 'pending' | 'complete' | 'failed';
  eventId?: string;
}

export async function savePhotoMetadata(record: PhotoRecord): Promise<void> {
  const app = getApp();
  const db = getFirestore(app);
  await setDoc(doc(db, 'photos', record.id), {
    ...record,
    createdAt: Timestamp.fromDate(record.createdAt),
    expiresAt: Timestamp.fromDate(record.expiresAt),
  });
}

export async function getPhotoMetadata(id: string): Promise<PhotoRecord | null> {
  const app = getApp();
  const db = getFirestore(app);
  const snap = await getDoc(doc(db, 'photos', id));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    ...d,
    id: snap.id,
    createdAt: (d.createdAt as Timestamp).toDate(),
    expiresAt: (d.expiresAt as Timestamp).toDate(),
  } as PhotoRecord;
}

export async function deletePhoto(record: PhotoRecord): Promise<void> {
  const app = getApp();
  const storage = getStorage(app);
  const db = getFirestore(app);
  await deleteObject(ref(storage, record.storagePath));
  await deleteDoc(doc(db, 'photos', record.id));
}

export async function cleanupExpiredPhotos(): Promise<number> {
  const app = getApp();
  const db = getFirestore(app);
  const now = Timestamp.now();
  const q = query(
    collection(db, 'photos'),
    where('expiresAt', '<=', now)
  );
  const snap = await getDocs(q);
  let deleted = 0;
  for (const docSnap of snap.docs) {
    const record = docSnap.data() as PhotoRecord;
    try {
      await deletePhoto({ ...record, id: docSnap.id } as PhotoRecord);
      deleted++;
    } catch {
      // continue on error
    }
  }
  return deleted;
}
