import type { Metadata } from 'next';
import PhotoDownloadClient from './PhotoDownloadClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Download Your Selfie',
  description:
    'Download your VIYUGAM 2K26 photo booth selfie. Shared photos are auto-deleted after 24 hours.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PhotoDownloadClient id={id} />;
}
