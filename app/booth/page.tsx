'use client';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import CameraView from '@/components/CameraView';
import PhotoReview from '@/components/PhotoReview';
import RetroDecorations from '@/components/RetroDecorations';
import { getEvent, EventConfig, EVENTS, FrameTheme, getEventThemeColors } from '@/lib/events';

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

  const pal = getEventThemeColors(event, theme);

  const handleCapture = useCallback((canvas: HTMLCanvasElement) => {
    setCapturedCanvas(canvas);
    setStep('review');
  }, []);

  const handleRetake = useCallback(() => {
    setCapturedCanvas(null);
    setStep('camera');
  }, []);

  const handleStartAgain = useCallback(() => {
    setCapturedCanvas(null);
    router.push('/');
  }, [router]);

  return (
    <main
      className="relative min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300"
      style={{ background: theme === 'dark' ? event.bgColor : '#111827' }}
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
              className="text-xs sm:text-sm font-black transition-opacity hover:opacity-80 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border"
              style={{
                color: pal.primaryColor,
                borderColor: `${pal.primaryColor}55`,
                background: 'rgba(0,0,0,0.5)',
              }}
              aria-label="Back to home"
            >
              ← HOME
            </button>
          </div>

          <div className="text-center justify-self-center min-w-0">
            <p
              className="font-black text-sm sm:text-base uppercase tracking-wider truncate"
              style={{ fontFamily: "'Anton', sans-serif", color: pal.primaryColor }}
            >
              {event.emoji} {event.title}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
              VIYUGAM 2K26
            </p>
          </div>

          <div className="justify-self-end">
            <button
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-full border transition-all"
              style={{
                borderColor: `${pal.primaryColor}66`,
                color: pal.primaryColor,
                background: 'rgba(0,0,0,0.5)',
              }}
              title="Toggle theme"
            >
              <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
              <span className="hidden sm:inline uppercase text-[10px]">
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
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300"
                style={{
                  background: step === s ? pal.primaryColor : 'transparent',
                  color: step === s ? '#000' : pal.primaryColor,
                  border: `2px solid ${step === s ? pal.primaryColor : 'rgba(255,255,255,0.2)'}`,
                }}
              >
                {i + 1}
              </div>
              <span
                className="text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors"
                style={{ color: step === s ? pal.primaryColor : '#71717A' }}
              >
                {s === 'camera' ? 'SNAP' : 'REVIEW'}
              </span>
              {i < 1 && <div className="w-8 h-px bg-gray-800 mx-1" />}
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
                className="font-black text-lg sm:text-xl uppercase tracking-wider"
                style={{ fontFamily: "'Anton', sans-serif", color: pal.primaryColor }}
              >
                READY FOR YOUR CLOSEUP?
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{event.tagline}</p>
            </div>

            <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-center">
              <CameraView onCapture={handleCapture} accentColor={pal.primaryColor} />
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
                className="font-black text-lg sm:text-xl uppercase tracking-wider"
                style={{ fontFamily: "'Anton', sans-serif", color: pal.primaryColor }}
              >
                YOUR {event.title} SELFIE
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                Choose your theme, download, or scan QR code
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
        <div className="min-h-screen bg-black flex items-center justify-center">
          <p className="text-yellow-400 font-bold animate-pulse text-sm">
            Loading booth…
          </p>
        </div>
      }
    >
      <BoothContent />
    </Suspense>
  );
}
