import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteUrl } from '@/lib/site';

const OG_IMAGE = `${siteUrl}/og-image.jpg`;
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

const SITE_NAME = 'VIYUGAM 2K26';
const SITE_TITLE = 'VIYUGAM 2K26 – Technical Symposium & Photo Booth | CSE PPGIT';
const SITE_DESCRIPTION =
  'Official web app for VIYUGAM 2K26 National Level Technical Symposium at PPG Institute of Technology, Coimbatore. Capture memories in the retro digital selfie booth, play the live Chess Arena and download instantly via QR code.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E05C1A' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'VIYUGAM 2K26',
    'VIYUGAM',
    'PPGIT',
    'PPG Institute of Technology',
    'CSE',
    'Photo Booth',
    'Selfie Booth',
    'Technical Symposium',
    'Chess Arena',
    'Coimbatore',
  ],
  authors: [{ name: 'Department of CSE, PPG Institute of Technology' }],
  creator: 'Department of CSE, PPG Institute of Technology',
  publisher: 'PPG Institute of Technology',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192.png',
    apple: [{ url: '/icons/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: 'VIYUGAM 2K26 — Technical Symposium & Photo Booth by the Department of CSE.',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: 'VIYUGAM 2K26 — Technical Symposium & Photo Booth by the Department of CSE.',
        type: 'image/jpeg',
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
        {/* Fonts are loaded globally for every route (canvas frame rendering also
            references these families by name), so the pages/_document rule is a
            false positive for the App Router. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=Rajdhani:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8F6F2] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F5F5F5] antialiased min-h-screen flex flex-col transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
