'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import LoadingState from '@/components/LoadingState';

interface PhotoData {
  id: string;
  downloadUrl: string;
  createdAt: string;
  expiresAt: string;
  format: string;
  width: number;
  height: number;
}

interface Props { id: string; }

type Status = 'loading' | 'found' | 'not-found' | 'expired' | 'error' | 'local-mode';

export default function PhotoDownloadClient({ id }: Props) {
  const [status, setStatus] = useState<Status>('loading');
  const [photo, setPhoto] = useState<PhotoData | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await fetch(`/api/photos/${id}`);
        if (res.status === 501) { setStatus('local-mode'); return; }
        if (res.status === 404) { setStatus('not-found'); return; }
        if (res.status === 410) { setStatus('expired'); return; }
        if (!res.ok) { setStatus('error'); return; }
        const data = await res.json();
        setPhoto(data);
        setStatus('found');
      } catch {
        setStatus('error');
      }
    };
    fetchPhoto();
  }, [id]);

  const handleDownload = () => {
    if (!photo) return;
    const a = document.createElement('a');
    a.href = photo.downloadUrl;
    a.download = `viyugam-selfie-${id.slice(0, 8)}.${photo.format}`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!photo) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My VIBE CODING Selfie',
          text: 'Check out my VIBE CODING photo booth selfie! 📸',
          url: window.location.href,
        });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const expiresIn = photo ? Math.max(0, Math.floor((new Date(photo.expiresAt).getTime() - Date.now()) / 3600_000)) : 0;

  return (
    <main className="min-h-screen bg-black halftone-bg flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <motion.div className="text-center mb-6 sm:mb-8" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <p className="text-yellow-400 font-bold tracking-[0.3em] text-[10px] sm:text-xs uppercase mb-1"
          style={{ fontFamily: "'Anton', sans-serif" }}>✦ VIBESNAP ✦</p>
        <h1 className="retro-heading text-4xl sm:text-6xl">VIYUGAM 2K26</h1>
        <p className="text-orange-400 text-xs sm:text-sm font-bold tracking-wider mt-1">DIGITAL EVENT MEMORY</p>
      </motion.div>

      {status === 'loading' && <LoadingState message="Fetching your selfie…" />}

      {(status === 'not-found' || status === 'expired' || status === 'error' || status === 'local-mode') && (
        <motion.div className="retro-card p-8 max-w-sm w-full text-center flex flex-col items-center gap-5"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className="text-5xl">
            {status === 'expired' ? '⏰' : status === 'local-mode' ? '🔧' : '🔍'}
          </span>
          <h2 className="text-xl font-black text-yellow-400" style={{ fontFamily: "'Anton', sans-serif" }}>
            {status === 'expired' ? 'Photo Expired' :
             status === 'local-mode' ? 'Local Mode Active' :
             status === 'not-found' ? 'Photo Not Found' : 'Something Went Wrong'}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {status === 'expired' && 'This photo has expired and been deleted after 24 hours.'}
            {status === 'local-mode' && 'This booth is running without cloud storage. Cross-device QR sharing is unavailable. Please download directly on the booth device.'}
            {status === 'not-found' && 'This photo doesn\'t exist or may have already been deleted.'}
            {status === 'error' && 'Unable to load photo. Please try again or visit the booth.'}
          </p>
          <Link href="/" className="btn-retro">📸 Visit the Booth</Link>
        </motion.div>
      )}

      {status === 'found' && photo && (
        <motion.div className="flex flex-col items-center gap-6 w-full max-w-sm"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring' }}>

          {/* Photo */}
          <div className="frame-border w-full rounded-xl overflow-hidden">
            <Image
              src={photo.downloadUrl}
              alt="Your VIBE CODING selfie"
              width={photo.width}
              height={photo.height}
              className="w-full h-auto block"
              priority
              unoptimized
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <motion.button onClick={handleDownload} whileTap={{ scale: 0.97 }}
              className="btn-retro w-full text-lg py-4" id="download-photo-btn">
              ⬇️ DOWNLOAD MY PHOTO
            </motion.button>
            <motion.button onClick={handleShare} whileTap={{ scale: 0.97 }}
              className="btn-retro-outline w-full" id="share-photo-btn">
              📤 Share
            </motion.button>
            <Link href="/booth" className="btn-retro-outline w-full text-center text-sm text-gray-400 border-gray-700 hover:border-yellow-400 hover:text-yellow-400">
              📸 Take Your Own Selfie
            </Link>
          </div>

          {/* Expiry & privacy */}
          <div className="text-center">
            <p className="text-xs text-gray-600">
              ⏳ This photo will be deleted in ~{expiresIn}h
            </p>
            <p className="text-xs text-gray-700 mt-1">
              Anyone with this link can access this photo.
            </p>
          </div>
        </motion.div>
      )}
    </main>
  );
}
