import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';

const OG_IMAGE = `${siteUrl}/og-image.jpg`;
const OG_IMAGE_ALT = 'VIYUGAM 2K26 — Technical Symposium & Photo Booth by the Department of CSE.';
const TITLE = 'VIYUGAM 2K26 Photo Booth – Digital Retro Selfie Booth';
const DESCRIPTION =
  'Pick a CSE event, snap a selfie in a custom retro frame and download it instantly via QR code.';

export const metadata: Metadata = {
  title: 'Photo Booth – Digital Retro Selfie Booth',
  description:
    'Step into the VIYUGAM 2K26 retro digital selfie booth. Pick a CSE event, capture your photo in a custom dark or light frame, then download instantly via QR code.',
  alternates: {
    canonical: '/booth',
  },
  openGraph: {
    type: 'website',
    siteName: 'VIYUGAM 2K26',
    locale: 'en_IN',
    title: TITLE,
    description: DESCRIPTION,
    url: '/booth',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
        type: 'image/jpeg',
      },
    ],
  },
};

export default function BoothLayout({ children }: { children: React.ReactNode }) {
  return children;
}
