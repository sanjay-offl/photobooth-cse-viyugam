import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_SETTINGS = {
  eventTitle: 'VIBE CODING',
  institutionName: 'CSE Department',
  eventDate: '2026',
  tagline: 'BUILD SOMETHING. CAPTURE THE MOMENT.',
  primaryColor: '#FFD400',
  secondaryColor: '#FF9F1C',
  retentionHours: 24,
  maxPhotoSizeMb: 10,
};

// In production, store settings in Firestore instead
let currentSettings = { ...DEFAULT_SETTINGS };

export async function GET() {
  return NextResponse.json(currentSettings);
}

export async function PUT(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { EventSettingsSchema } = await import('@/lib/validation');
  const parsed = EventSettingsSchema.safeParse({ ...currentSettings, ...(body as object) });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid settings', details: parsed.error.format() }, { status: 400 });
  }

  currentSettings = parsed.data;
  return NextResponse.json(currentSettings);
}
