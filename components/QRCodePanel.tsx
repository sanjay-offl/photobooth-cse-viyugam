'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { generateQRCodeDataURL } from '@/lib/qr-code';

interface QRCodePanelProps {
  shareUrl: string;
  downloadUrl: string;
  isLocal: boolean;
  onNewSession: () => void;
  accentColor?: string;
}

export default function QRCodePanel({ shareUrl, downloadUrl, isLocal, onNewSession, accentColor = '#FFD400' }: QRCodePanelProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrError, setQrError] = useState(false);

  const generateQR = useCallback(async () => {
    if (isLocal) { setQrError(true); return; }
    try { setQrDataUrl(await generateQRCodeDataURL(shareUrl)); }
    catch { setQrError(true); }
  }, [shareUrl, isLocal]);

  useState(() => { generateQR(); });

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* ignore */ }
  };

  const downloadDirect = () => {
    const a = document.createElement('a');
    a.href = downloadUrl; a.download = 'event-selfie.jpg'; a.target = '_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, type: 'spring' }}
      className="w-full rounded-2xl bg-black p-6 flex flex-col items-center gap-5"
      style={{ border: `4px solid ${accentColor}`, boxShadow: `0 0 40px ${accentColor}33` }}>
      <div className="flex gap-2 text-xl">{'⭐'.repeat(5)}</div>
      <h2 className="text-3xl font-black text-white text-center tracking-wide"
        style={{ fontFamily: "'Anton', sans-serif", textShadow: `3px 3px 0 ${accentColor}` }}>
        YOUR MEMORY IS READY!
      </h2>
      <p className="text-gray-300 text-center text-sm max-w-xs">
        Scan this QR code with your phone to download your selfie.
      </p>
      <AnimatePresence mode="wait">
        {isLocal || qrError ? (
          <motion.div key="no-qr" className="flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-xl w-full text-center"
            style={{ borderColor: `${accentColor}44` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-4xl">⚠️</span>
            <p className="font-bold text-sm" style={{ color: accentColor }}>QR requires cloud storage</p>
            <p className="text-gray-400 text-xs max-w-[200px]">Configure Firebase in .env.local to enable QR sharing. Use download below.</p>
          </motion.div>
        ) : qrDataUrl ? (
          <motion.div key="qr" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-3 rounded-xl" style={{ border: `4px solid ${accentColor}` }}>
            <Image src={qrDataUrl} alt="QR code to download photo" width={200} height={200} className="block" />
          </motion.div>
        ) : (
          <motion.div key="loading" className="w-[216px] h-[216px] rounded-xl flex items-center justify-center"
            style={{ border: `4px solid ${accentColor}44` }}
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.2 }}>
            <span className="font-bold" style={{ color: accentColor }}>Generating QR…</span>
          </motion.div>
        )}
      </AnimatePresence>
      {!isLocal && !qrError && <p className="text-xs text-gray-500 text-center">Scan to Download</p>}
      <div className="flex flex-col w-full gap-3">
        {!isLocal && !qrError && (
          <motion.button onClick={copyLink} whileTap={{ scale: 0.97 }}
            className="btn-retro-outline w-full text-sm" id="copy-link-btn" style={{ borderColor: accentColor, color: accentColor }}>
            {copied ? '✅ Copied!' : '📋 Copy Link'}
          </motion.button>
        )}
        <motion.button onClick={downloadDirect} whileTap={{ scale: 0.97 }}
          className="btn-retro w-full" id="download-device-btn" style={{ background: accentColor }}>
          ⬇️ Download on This Device
        </motion.button>
        <motion.button onClick={onNewSession} whileTap={{ scale: 0.97 }}
          className="btn-retro-outline w-full text-sm text-gray-300 border-gray-600 hover:border-yellow-400 hover:text-yellow-400" id="new-session-btn">
          🏠 Start New Session
        </motion.button>
      </div>
      <p className="text-xs text-gray-600 text-center max-w-xs">
        Anyone with this link can access your photo. Photos are deleted after 24 hours.
      </p>
    </motion.div>
  );
}
