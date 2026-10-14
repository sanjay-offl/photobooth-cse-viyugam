import type { Metadata, Viewport } from 'next';
import './globals.css';

const rawBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  'http://localhost:3000';

const siteUrl = (
  rawBaseUrl.startsWith('http://') || rawBaseUrl.startsWith('https://')
    ? rawBaseUrl
    : `https://${rawBaseUrl}`
).replace(/\/$/, '');

const previewImageUrl = `${siteUrl}/decorations/831b5c09-89e2-405f-824e-cd726eddaf0b.png`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ff6500',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'VibeSnap | Capture the Moment',
    template: '%s | VibeSnap',
  },
  description: 'Capture your event memories with VibeSnap, the Photo Booth by the Department of CSE.',
  keywords: ['VibeSnap', 'Photo Booth', 'VIYUGAM 2K26', 'CSE', 'PPGIT', 'Digital Selfie Booth', 'Chess Arena'],
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      {
        url: '/decorations/favicon.png',
        type: 'image/png',
      },
    ],
    shortcut: '/decorations/favicon.png',
    apple: [
      {
        url: '/decorations/favicon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    title: 'VibeSnap | Capture the Moment',
    description: 'Capture your event memories with VibeSnap, the Photo Booth by the Department of CSE.',
    url: siteUrl,
    siteName: 'VibeSnap',
    type: 'website',
    images: [
      {
        url: previewImageUrl,
        secureUrl: previewImageUrl,
        width: 1730,
        height: 909,
        alt: 'VibeSnap Photo Booth by the Department of CSE.',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeSnap | Capture the Moment',
    description: 'Capture your event memories with VibeSnap, the Photo Booth by the Department of CSE.',
    images: [
      {
        url: previewImageUrl,
        alt: 'VibeSnap Photo Booth by the Department of CSE.',
        width: 1730,
        height: 909,
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=Rajdhani:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
