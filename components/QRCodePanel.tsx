'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { generateQRCodeDataURL } from '@/lib/qr-code';
import { ThinAsteriskSVG } from './GeometricAsterisk';

interface QRCodePanelProps {
  shareUrl: string;
  downloadUrl: string;
  isLocal: boolean;
  onNewSession: () => void;
}

export default function QRCodePanel({
  shareUrl,
  downloadUrl,
  isLocal,
  onNewSession,
}: QRCodePanelProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (isLocal) return;
    let cancelled = false;
    generateQRCodeDataURL(shareUrl)
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [shareUrl, isLocal]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const downloadDirect = () => {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'viyugam-2k26-selfie.jpg';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="w-full rounded-2xl bg-white dark:bg-[#1A1A1A] border border-[#E8DDD6] dark:border-[#2E2E2E] p-6 sm:p-8 flex flex-col items-center gap-5 shadow-lg shadow-[rgba(0,0,0,0.04)]"
      style={{
        boxShadow: `0 12px 36px rgba(224, 92, 26, 0.08), 0 2px 10px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Decorative clean asterisks badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EB] dark:bg-[rgba(224,92,26,0.15)] border border-[#E05C1A]/30">
        <ThinAsteriskSVG size={14} color="#E05C1A" />
        <span className="font-rajdhani text-xs font-bold tracking-[0.2em] text-[#E05C1A] uppercase">
          PHOTO READY
        </span>
        <ThinAsteriskSVG size={14} color="#E05C1A" />
      </div>

      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bebas tracking-wide text-[#1A1A1A] dark:text-white uppercase">
          YOUR MEMORY IS READY!
        </h2>
        <p className="text-xs sm:text-sm font-inter text-[#333333] dark:text-neutral-300 mt-1 max-w-xs">
          Scan the QR code with your phone camera to download your framed photo instantly.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isLocal || qrError ? (
          <motion.div
            key="no-qr"
            className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-[#E8DDD6] dark:border-[#333333] bg-[#FFF8F4] dark:bg-[#242424] rounded-xl w-full text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-3xl select-none">📱</span>
            <p className="font-bold font-rajdhani text-sm text-[#E05C1A] uppercase tracking-wider">
              Local Mode: Direct Download Ready
            </p>
            <p className="text-[#666666] dark:text-neutral-400 text-xs max-w-[240px]">
              Tap the solid orange button below to save directly to this device.
            </p>
          </motion.div>
        ) : qrDataUrl ? (
          <motion.div
            key="qr"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-3.5 rounded-2xl border-2 border-[#E05C1A] shadow-md"
          >
            <Image
              src={qrDataUrl}
              alt="QR code to download photo"
              width={200}
              height={200}
              className="block rounded-lg"
            />
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            className="w-[216px] h-[216px] rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-[#E05C1A]/30 bg-[#FFF8F4] dark:bg-[#242424]"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <ThinAsteriskSVG size={28} color="#E05C1A" />
            <span className="font-rajdhani font-bold text-xs uppercase tracking-widest text-[#E05C1A]">
              Generating QR…
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLocal && !qrError && (
        <p className="text-xs font-rajdhani font-bold uppercase tracking-wider text-[#666666] dark:text-neutral-400 text-center">
          ⚡ Point your phone camera at the screen
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col w-full gap-3 mt-1">
        {/* QR Download Button: Solid Orange, White Text, Full Rounded */}
        <motion.button
          onClick={downloadDirect}
          whileTap={{ scale: 0.98 }}
          id="download-device-btn"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#E05C1A] hover:bg-[#C84E13] text-white font-rajdhani font-bold text-base uppercase tracking-wider shadow-md shadow-[rgba(224,92,26,0.3)] transition-all cursor-pointer"
        >
          <span>⬇️</span> Download to Device
        </motion.button>

        {!isLocal && !qrError && (
          <motion.button
            onClick={copyLink}
            whileTap={{ scale: 0.98 }}
            id="copy-link-btn"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-full border border-[#E8DDD6] dark:border-[#333333] hover:border-[#E05C1A] text-[#1A1A1A] dark:text-neutral-200 hover:text-[#E05C1A] font-rajdhani font-bold text-sm uppercase tracking-wider bg-[#F8F6F2] dark:bg-[#242424] transition-all cursor-pointer"
          >
            {copied ? '✅ Link Copied to Clipboard!' : '📋 Copy Shareable Link'}
          </motion.button>
        )}

        <motion.button
          onClick={onNewSession}
          whileTap={{ scale: 0.98 }}
          id="new-session-btn"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-full border border-transparent hover:border-[#E8DDD6] dark:hover:border-[#333333] text-[#666666] dark:text-neutral-400 hover:text-[#1A1A1A] dark:hover:text-white font-rajdhani font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          <span>🏠</span> Take Another Photo / Switch Event
        </motion.button>
      </div>

      <p className="text-[11px] font-inter text-[#666666] dark:text-neutral-500 text-center max-w-xs leading-normal">
        🔒 Temporary cloud storage automatically cleans up your photo after 24 hours.
      </p>
    </motion.div>
  );
}
