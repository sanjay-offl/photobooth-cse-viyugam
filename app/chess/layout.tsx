import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chess Arena – Play Live & Compete',
  description:
    'Enter the VIYUGAM 2K26 Chess Arena. Play a full legal-move chess match in a dark or light gold theme, undo moves, track SAN notation and download a chess selfie frame.',
  alternates: {
    canonical: '/chess',
  },
  openGraph: {
    title: 'VIYUGAM 2K26 Chess Arena – Think Ahead. Make Your Move.',
    description:
      'Play a live chess match in the VIYUGAM 2K26 Chess Arena with dark/light themes and full move history.',
    url: '/chess',
  },
};

export default function ChessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
