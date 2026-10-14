import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Rate limiting (simple in-memory, replace with Redis for production)
const uploadCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_UPLOADS_PER_HOUR = 20;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function getRateLimitKey(req: NextRequest): string {
  return req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = uploadCounts.get(key);
  if (!entry || entry.resetAt < now) {
    uploadCounts.set(key, { count: 1, resetAt: now + 3600_000 });
    return true;
  }
  if (entry.count >= MAX_UPLOADS_PER_HOUR) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const rateLimitKey = getRateLimitKey(req);
  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { UploadPhotoSchema } = await import('@/lib/validation');
  const parsed = UploadPhotoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.format() }, { status: 400 });
  }

  const { imageData, format, width, height } = parsed.data;

  // Validate base64 size
  const base64 = imageData.split(',')[1] ?? imageData;
  const sizeBytes = Math.ceil((base64.length * 3) / 4);
  if (sizeBytes > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'Image too large. Maximum 10MB.' }, { status: 413 });
  }

  // Validate image MIME
  if (!imageData.startsWith('data:image/')) {
    return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
  }

  const { isFirebaseConfigured } = await import('@/lib/storage');
  const id = uuidv4();

  if (!isFirebaseConfigured()) {
    // Local mode: return ID without cloud storage
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${req.headers.get('host')}`;
    return NextResponse.json({
      id,
      shareUrl: `${baseUrl}/photo/${id}`,
      downloadUrl: imageData,
      isLocal: true,
      message: 'Firebase not configured. QR sharing unavailable in local mode.',
    }, { status: 201 });
  }

  try {
    const { uploadPhotoToStorage, savePhotoMetadata } = await import('@/lib/storage');
    const storageFormat: 'jpeg' | 'png' = format === 'png' ? 'png' : 'jpeg';
    const { downloadUrl, storagePath } = await uploadPhotoToStorage(id, imageData, storageFormat);
    const now = new Date();
    const retentionHours = parseInt(process.env.RETENTION_HOURS ?? '24', 10);
    await savePhotoMetadata({
      id,
      storagePath,
      downloadUrl,
      createdAt: now,
      expiresAt: new Date(now.getTime() + retentionHours * 3600_000),
      format,
      width,
      height,
      uploadStatus: 'complete',
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${req.headers.get('host')}`;
    return NextResponse.json({
      id,
      shareUrl: `${baseUrl}/photo/${id}`,
      downloadUrl,
      isLocal: false,
    }, { status: 201 });
  } catch (err) {
    console.error('Photo save error:', err);
    return NextResponse.json({ error: 'Failed to save photo. Please try again.' }, { status: 500 });
  }
}
