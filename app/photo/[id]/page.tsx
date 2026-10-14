import type { Metadata } from 'next';
import PhotoDownloadClient from './PhotoDownloadClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Download Your VIBE CODING Selfie',
  description: 'Download your VIBE CODING photo booth selfie.',
};

export default async function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PhotoDownloadClient id={id} />;
}
