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
  const [expiresIn, setExpiresIn] = useState(0);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await fetch(`/api/photos/${id}`);
        if (res.status === 501) { setStatus('local-mode'); return; }
        if (res.status === 404) { setStatus('not-found'); return; }
        if (res.status === 410) { setStatus('expired'); return; }
        if (!res.ok) { setStatus('error'); return; }
        const data: PhotoData = await res.json();
        setPhoto(data);
        setExpiresIn(
          Math.max(0, Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 3600_000)),
        );
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
          title: 'My VIYUGAM 2K26 Selfie',
          text: 'Check out my VIYUGAM 2K26 photo booth selfie! 📸',
          url: window.location.href,
        });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] halftone-bg flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <motion.div className="text-center mb-6 sm:mb-8" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <p className="text-[#FF6500] font-bold font-rajdhani tracking-[0.25em] text-[11px] sm:text-xs uppercase mb-1">
          ✦ PPG INSTITUTE OF TECHNOLOGY, COIMBATORE ✦
        </p>
        <h1 className="text-5xl sm:text-7xl font-bebas font-black tracking-tight text-white leading-none">
          VIYU<span className="text-[#FF6500]">GAM</span> 2K26
        </h1>
        <p className="text-neutral-400 font-rajdhani text-xs sm:text-sm font-bold tracking-widest uppercase mt-1">
          DIGITAL EVENT MEMORY · CSE DEPARTMENT
        </p>
      </motion.div>

      {status === 'loading' && <LoadingState message="Fetching your selfie…" accentColor="#FF6500" />}

      {(status === 'not-found' || status === 'expired' || status === 'error' || status === 'local-mode') && (
        <motion.div className="retro-card p-8 max-w-sm w-full text-center flex flex-col items-center gap-5"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className="text-5xl">
            {status === 'expired' ? '⏰' : status === 'local-mode' ? '🔧' : '🔍'}
          </span>
          <h2 className="text-2xl font-black font-bebas tracking-wide text-[#FF6500]">
            {status === 'expired' ? 'PHOTO EXPIRED' :
             status === 'local-mode' ? 'LOCAL MODE ACTIVE' :
             status === 'not-found' ? 'PHOTO NOT FOUND' : 'SOMETHING WENT WRONG'}
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm font-inter leading-relaxed">
            {status === 'expired' && 'This photo has expired and been deleted after 24 hours.'}
            {status === 'local-mode' && 'This booth is running in local offline mode. Cross-device QR sharing is unavailable. Please download directly on the booth device.'}
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
          <div
            className="w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{
              border: '3px solid #FF6500',
              boxShadow: '0 0 45px rgba(255, 101, 0, 0.35)',
            }}
          >
            <Image
              src={photo.downloadUrl}
              alt="Your VIYUGAM 2K26 selfie"
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
              className="btn-retro w-full text-lg py-3.5" id="download-photo-btn">
              ⬇️ DOWNLOAD MY PHOTO
            </motion.button>
            <motion.button onClick={handleShare} whileTap={{ scale: 0.97 }}
              className="btn-retro-outline w-full text-base py-3" id="share-photo-btn">
              📤 Share Link
            </motion.button>
            <Link href="/booth" className="btn-retro-outline w-full text-center text-xs py-2 text-neutral-400 border-neutral-700 hover:border-[#FF6500] hover:text-white">
              📸 Take Your Own Selfie
            </Link>
          </div>

          {/* Expiry & privacy */}
          <div className="text-center">
            <p className="text-xs text-neutral-500 font-rajdhani tracking-wider">
              ⏳ This photo will be auto-deleted in ~{expiresIn}h
            </p>
            <p className="text-[11px] text-neutral-600 mt-0.5 font-inter">
              Anyone with this link can access this photo.
            </p>
          </div>
        </motion.div>
      )}
    </main>
  );
}
