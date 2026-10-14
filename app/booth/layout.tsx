import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photo Booth – Digital Retro Selfie Booth',
  description:
    'Step into the VIYUGAM 2K26 retro digital selfie booth. Pick a CSE event, capture your photo in a custom dark or light theme frame, then download instantly via QR code.',
  alternates: {
    canonical: '/booth',
  },
  openGraph: {
    title: 'VIYUGAM 2K26 Photo Booth – Digital Retro Selfie Booth',
    description:
      'Pick a CSE event, snap a selfie in a custom retro frame and download it instantly via QR code.',
    url: '/booth',
  },
};

export default function BoothLayout({ children }: { children: React.ReactNode }) {
  return children;
}
