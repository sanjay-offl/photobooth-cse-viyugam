'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { startCamera, stopCamera, captureFrame, getCameraDevices, getCameraErrorType, CameraDevice, CameraError } from '@/lib/camera';
import CaptureButton from './CaptureButton';
import CountdownOverlay from './CountdownOverlay';

interface CameraViewProps {
  onCapture: (canvas: HTMLCanvasElement) => void;
  accentColor?: string;
}

export default function CameraView({ onCapture, accentColor = '#FFD400' }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [activeDevice, setActiveDevice] = useState<string | undefined>(undefined);
  const [error, setError] = useState<CameraError | null>(null);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [useCountdown, setUseCountdown] = useState(true);
  const [flash, setFlash] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initCamera = useCallback(async (deviceId?: string) => {
    if (!videoRef.current) return;
    setError(null); setReady(false);
    stopCamera(streamRef.current);
    try {
      const stream = await startCamera(videoRef.current, deviceId, true);
      streamRef.current = stream;
      setReady(true);
      const devs = await getCameraDevices();
      setDevices(devs);
    } catch (err) {
      const type = getCameraErrorType(err);
      setError(type);
      if (type === 'permission-denied') setPermissionDenied(true);
    }
  }, []);

  useEffect(() => { initCamera(activeDevice); return () => stopCamera(streamRef.current); }, [activeDevice, initCamera]);

  const doCapture = useCallback(() => {
    if (!videoRef.current) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 400);
    onCapture(captureFrame(videoRef.current, true));
  }, [onCapture]);

  const handleCapture = useCallback(() => {
    if (!videoRef.current) return;
    if (useCountdown) {
      let count = 3; setCountdown(count);
      const interval = setInterval(() => {
        count -= 1;
        if (count <= 0) { clearInterval(interval); setCountdown(null); doCapture(); }
        else setCountdown(count);
      }, 1000);
    } else { doCapture(); }
  }, [useCountdown, doCapture]);

  const switchCamera = () => {
    const idx = devices.findIndex((d) => d.deviceId === activeDevice);
    setActiveDevice(devices[(idx + 1) % devices.length]?.deviceId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      onCapture(canvas);
    };
    img.src = URL.createObjectURL(file);
  };

  if (permissionDenied || error === 'not-supported') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-full p-8">
        <div className="text-6xl">📷</div>
        <h2 className="text-2xl font-black text-center" style={{ fontFamily: "'Anton', sans-serif", color: accentColor }}>
          {error === 'permission-denied' ? 'Camera Access Denied' : 'Camera Not Available'}
        </h2>
        <p className="text-gray-300 text-center max-w-sm text-sm">
          {error === 'permission-denied' ? 'Allow camera access in browser settings.' : 'Your browser does not support camera access.'}
        </p>
        <div className="flex flex-col items-center gap-3">
          <button onClick={() => initCamera()} className="btn-retro">Try Again</button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-retro-outline">📁 Upload a Photo</button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col items-center gap-3 sm:gap-4">
      {/* Video preview with retro photo-booth aspect ratio */}
      <div
        className="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-black mx-auto transition-all"
        style={{ border: `4px solid ${accentColor}`, boxShadow: `0 0 40px ${accentColor}33` }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
          aria-label="Camera preview"
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <motion.div
              className="flex flex-col items-center gap-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="text-5xl">📸</div>
              <p className="font-bold text-base sm:text-lg" style={{ color: accentColor }}>
                Starting camera…
              </p>
            </motion.div>
          </div>
        )}
        <CountdownOverlay count={countdown} accentColor={accentColor} />
        <AnimatePresence>
          {flash && (
            <motion.div
              className="absolute inset-0 bg-white pointer-events-none z-30"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
        </AnimatePresence>
        {/* Corner indicators */}
        {[
          'top-0 left-0 border-t-4 border-l-4',
          'top-0 right-0 border-t-4 border-r-4',
          'bottom-0 left-0 border-b-4 border-l-4',
          'bottom-0 right-0 border-b-4 border-r-4',
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute ${cls} w-7 h-7 sm:w-8 sm:h-8 pointer-events-none`}
            style={{ borderColor: accentColor }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 sm:gap-4 w-full justify-center flex-wrap">
        {devices.length > 1 && (
          <motion.button onClick={switchCamera} whileTap={{ scale: 0.95 }}
            className="btn-retro-sm" aria-label="Switch camera" id="switch-camera-btn"
            style={{ borderColor: accentColor, color: accentColor }}>
            🔄 Switch Cam
          </motion.button>
        )}
        <CaptureButton onClick={handleCapture} disabled={!ready || countdown !== null} accentColor={accentColor} />
        <motion.button onClick={() => setUseCountdown(v => !v)} whileTap={{ scale: 0.95 }}
          className="btn-retro-sm" id="toggle-countdown-btn"
          style={{ borderColor: accentColor, color: accentColor, opacity: useCountdown ? 1 : 0.5 }}>
          ⏱ {useCountdown ? '3s ON' : '3s OFF'}
        </motion.button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>No camera?</span>
        <button onClick={() => fileInputRef.current?.click()} className="underline underline-offset-2 transition-colors hover:opacity-80"
          style={{ color: accentColor }}>Upload a photo</button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      </div>
    </div>
  );
}
