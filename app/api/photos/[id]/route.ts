import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return NextResponse.json({ error: 'Invalid photo ID' }, { status: 400 });
  }

  const { isFirebaseConfigured } = await import('@/lib/storage');
  if (!isFirebaseConfigured()) {
    return NextResponse.json({
      error: 'Cloud storage not configured',
      message: 'This instance is running in local mode. Photos cannot be retrieved by ID.',
    }, { status: 501 });
  }

  const { getPhotoMetadata } = await import('@/lib/storage');
  const record = await getPhotoMetadata(id);

  if (!record) {
    return NextResponse.json({ error: 'Photo not found or expired' }, { status: 404 });
  }

  if (new Date() > record.expiresAt) {
    // Attempt cleanup
    try {
      const { deletePhoto } = await import('@/lib/storage');
      await deletePhoto(record);
    } catch { /* ignore */ }
    return NextResponse.json({ error: 'Photo has expired' }, { status: 410 });
  }

  return NextResponse.json({
    id: record.id,
    downloadUrl: record.downloadUrl,
    createdAt: record.createdAt,
    expiresAt: record.expiresAt,
    format: record.format,
    width: record.width,
    height: record.height,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simple auth check — in production use proper auth
  const authHeader = req.headers.get('authorization');
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { isFirebaseConfigured, getPhotoMetadata, deletePhoto } = await import('@/lib/storage');
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: 'Cloud storage not configured' }, { status: 501 });
  }

  const record = await getPhotoMetadata(id);
  if (!record) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
  }

  await deletePhoto(record);
  return NextResponse.json({ success: true });
}
