import { v4 as uuidv4 } from 'uuid';
import {
  isFirebaseConfigured,
  uploadPhotoToStorage,
  savePhotoMetadata,
  getPhotoMetadata,
  deletePhoto,
  PhotoRecord,
} from './storage';

export { isFirebaseConfigured };

const LOCAL_PHOTO_MAP = new Map<string, { dataUrl: string; expiresAt: Date; record: PhotoRecord }>();

function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

export interface SavePhotoResult {
  id: string;
  downloadUrl: string;
  shareUrl: string;
  isLocal: boolean;
}

export async function savePhoto(
  dataUrl: string,
  options: {
    format?: 'jpeg' | 'png';
    width?: number;
    height?: number;
    retentionHours?: number;
    consentGiven?: boolean;
  } = {}
): Promise<SavePhotoResult> {
  const {
    format = 'jpeg',
    width = 1080,
    height = 1350,
    retentionHours = 24,
    consentGiven = true,
  } = options;

  if (!consentGiven) throw new Error('Consent is required to save photo');

  const id = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + retentionHours * 60 * 60 * 1000);

  if (isFirebaseConfigured()) {
    const { downloadUrl, storagePath } = await uploadPhotoToStorage(id, dataUrl, format);
    const record: PhotoRecord = {
      id,
      storagePath,
      downloadUrl,
      createdAt: now,
      expiresAt,
      format,
      width,
      height,
      uploadStatus: 'complete',
    };
    await savePhotoMetadata(record);
    const shareUrl = `${getBaseUrl()}/photo/${id}`;
    return { id, downloadUrl, shareUrl, isLocal: false };
  }

  // Local fallback (QR code will be disabled)
  LOCAL_PHOTO_MAP.set(id, { dataUrl, expiresAt, record: {
    id, storagePath: '', downloadUrl: dataUrl, createdAt: now, expiresAt,
    format, width, height, uploadStatus: 'complete',
  }});
  const shareUrl = `${getBaseUrl()}/photo/${id}`;
  return { id, downloadUrl: dataUrl, shareUrl, isLocal: true };
}

export async function getPhoto(id: string): Promise<PhotoRecord | null> {
  if (isFirebaseConfigured()) {
    return getPhotoMetadata(id);
  }
  const local = LOCAL_PHOTO_MAP.get(id);
  if (!local) return null;
  if (new Date() > local.expiresAt) {
    LOCAL_PHOTO_MAP.delete(id);
    return null;
  }
  return local.record;
}

export async function removePhoto(id: string): Promise<void> {
  if (isFirebaseConfigured()) {
    const record = await getPhotoMetadata(id);
    if (record) await deletePhoto(record);
  } else {
    LOCAL_PHOTO_MAP.delete(id);
  }
}

export function getLocalPhotoDataUrl(id: string): string | null {
  return LOCAL_PHOTO_MAP.get(id)?.dataUrl ?? null;
}
