'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import CameraView from '@/components/CameraView';
import PhotoReview from '@/components/PhotoReview';
import RetroDecorations from '@/components/RetroDecorations';
import { getEvent, EventConfig, EVENTS, FrameTheme } from '@/lib/events';

type Step = 'camera' | 'review';

function BoothContent() {
  const searchParams = useSearchParams();
  const eventId = (searchParams.get('event') ?? 'vibe-coding') as keyof typeof EVENTS;
  const event: EventConfig = EVENTS[eventId] ?? getEvent('vibe-coding');

  const paramTheme = searchParams.get('theme') as FrameTheme | null;
  const [theme, setTheme] = useState<FrameTheme>(paramTheme === 'light' ? 'light' : 'dark');

  const [step, setStep] = useState<Step>('camera');
  const [capturedCanvas, setCapturedCanvas] = useState<HTMLCanvasElement | null>(null);
  const router = useRouter();

  const handleCapture = (canvas: HTMLCanvasElement) => {
    setCapturedCanvas(canvas);
    setStep('review');
  };

  const handleRetake = () => {
    setCapturedCanvas(null);
    setStep('camera');
  };

  const handleStartAgain = () => {
    setCapturedCanvas(null);
    router.push('/');
  };

  return (
    <main
      className="relative min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300"
      style={{ background: theme === 'dark' ? '#0A0A0A' : '#141414' }}
    >
      <RetroDecorations />

      <div className="relative z-10 flex flex-col flex-1 w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 gap-4 sm:gap-5">
        {/* Header - Balanced 3 Column Mobile Responsive */}
        <motion.header
          className="grid grid-cols-3 items-center w-full"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="justify-self-start">
            <button
              onClick={() => router.push('/')}
              className="text-xs sm:text-sm font-rajdhani font-bold transition-opacity hover:opacity-80 flex items-center gap-1 px-3 py-1.5 rounded-lg border"
              style={{
                color: '#FF6500',
                borderColor: 'rgba(255, 101, 0, 0.35)',
                background: 'rgba(20, 20, 20, 0.85)',
              }}
              aria-label="Back to home"
            >
              ← HOME
            </button>
          </div>

          <div className="text-center justify-self-center min-w-0">
            <p
              className="font-bebas text-lg sm:text-xl uppercase tracking-wider truncate text-white"
            >
              {event.emoji} {event.title}
            </p>
            <p className="text-[10px] sm:text-xs text-[#FF6500] uppercase tracking-widest font-rajdhani font-bold">
              VIYUGAM 2K26 · CSE
            </p>
          </div>

          <div className="justify-self-end">
            <button
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="flex items-center gap-1.5 text-xs font-rajdhani font-bold px-3 py-1.5 rounded-full border transition-all"
              style={{
                borderColor: 'rgba(255, 101, 0, 0.4)',
                color: '#FF6500',
                background: 'rgba(20, 20, 20, 0.85)',
              }}
              title="Toggle frame theme"
            >
              <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
              <span className="hidden sm:inline uppercase text-[11px] font-bold">
                {theme}
              </span>
            </button>
          </div>
        </motion.header>

        {/* Step indicator */}
        <div className="flex items-center gap-2 justify-center">
          {(['camera', 'review'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-rajdhani font-bold text-xs sm:text-sm transition-all duration-300"
                style={{
                  background: step === s ? '#FF6500' : 'transparent',
                  color: step === s ? '#000000' : '#FF6500',
                  border: `2px solid ${step === s ? '#FF6500' : 'rgba(255,255,255,0.2)'}`,
                }}
              >
                {i + 1}
              </div>
              <span
                className="text-xs sm:text-sm font-rajdhani font-bold uppercase tracking-wider transition-colors"
                style={{ color: step === s ? '#FF6500' : '#71717A' }}
              >
                {s === 'camera' ? 'SNAP' : 'REVIEW'}
              </span>
              {i < 1 && <div className="w-8 h-px bg-neutral-800 mx-1" />}
            </div>
          ))}
        </div>

        {/* Camera step */}
        {step === 'camera' && (
          <motion.div
            key="camera"
            className="flex flex-col gap-3 sm:gap-4 flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="text-center">
              <h1
                className="text-2xl sm:text-3xl font-bebas tracking-wide uppercase text-white"
              >
                READY FOR YOUR CLOSEUP?
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm font-rajdhani tracking-wider mt-0.5">
                {event.tagline}
              </p>
            </div>

            <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-center">
              <CameraView onCapture={handleCapture} accentColor="#FF6500" />
            </div>
          </motion.div>
        )}

        {/* Review step */}
        {step === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-3"
          >
            <div className="text-center">
              <h1
                className="text-2xl sm:text-3xl font-bebas tracking-wide uppercase text-white"
              >
                YOUR {event.title} SELFIE
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm font-rajdhani tracking-wider mt-0.5">
                Toggle between Dark & Light themes, download or scan QR code
              </p>
            </div>

            <PhotoReview
              capturedCanvas={capturedCanvas}
              eventConfig={event}
              initialTheme={theme}
              onRetake={handleRetake}
              onStartAgain={handleStartAgain}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function BoothPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <p className="text-[#FF6500] font-bold font-rajdhani animate-pulse text-base tracking-widest">
            LOADING BOOTH…
          </p>
        </div>
      }
    >
      <BoothContent />
    </Suspense>
  );
}
