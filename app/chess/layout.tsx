import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';

const OG_IMAGE = `${siteUrl}/og-image.jpg`;
const OG_IMAGE_ALT = 'VIYUGAM 2K26 — Technical Symposium & Photo Booth by the Department of CSE.';
const TITLE = 'VIYUGAM 2K26 Chess Arena – Think Ahead. Make Your Move.';
const DESCRIPTION =
  'Play a live chess match in the VIYUGAM 2K26 Chess Arena with full move history.';

export const metadata: Metadata = {
  title: 'Chess Arena – Play Live & Compete',
  description:
    'Enter the VIYUGAM 2K26 Chess Arena. Play a full legal-move chess match in a clean light theme, undo moves, track SAN notation and download a chess selfie frame.',
  alternates: {
    canonical: '/chess',
  },
  openGraph: {
    type: 'website',
    siteName: 'VIYUGAM 2K26',
    locale: 'en_IN',
    title: TITLE,
    description: DESCRIPTION,
    url: '/chess',
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

export default function ChessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
