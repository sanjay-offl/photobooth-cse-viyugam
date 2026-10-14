import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VIBESNAP – VIBE CODING Digital Selfie Booth',
  description: 'Strike a pose, snap a selfie, and take home a beautifully framed VIBE CODING memory. Retro photo booth experience for the CSE event.',
  keywords: ['photo booth', 'selfie', 'VIBE CODING', 'CSE', 'retro', 'event'],
  openGraph: {
    title: 'VIBESNAP – VIBE CODING Digital Selfie Booth',
    description: 'Take your VIBE CODING selfie and download it instantly!',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="halftone-bg">
        {children}
      </body>
    </html>
  );
}
