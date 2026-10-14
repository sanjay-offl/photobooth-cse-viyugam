'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { renderFrame, canvasToDataURL } from '@/lib/canvas-frame';
import { EventConfig, FrameTheme, getEventThemeColors } from '@/lib/events';
import QRCodePanel from './QRCodePanel';
import LoadingState from './LoadingState';

interface PhotoReviewProps {
  capturedCanvas: HTMLCanvasElement | null;
  eventConfig: EventConfig;
  initialTheme?: FrameTheme;
  onRetake: () => void;
  onStartAgain: () => void;
}

interface SaveResult {
  id: string;
  shareUrl: string;
  downloadUrl: string;
  isLocal: boolean;
}

export default function PhotoReview({
  capturedCanvas,
  eventConfig,
  initialTheme = 'dark',
  onRetake,
  onStartAgain,
}: PhotoReviewProps) {
  const [frameTheme, setFrameTheme] = useState<FrameTheme>(initialTheme);
  const [framedDataUrl, setFramedDataUrl] = useState<string | null>(null);
  const [renderedKey, setRenderedKey] = useState<string | null>(null);
  const [renderError, setRenderError] = useState('');
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null);
  const [saveResultKey, setSaveResultKey] = useState<string | null>(null);
  const [saveError, setSaveError] = useState('');
  const [savingQR, setSavingQR] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const pal = getEventThemeColors(eventConfig, frameTheme);
  const accent = pal.primaryColor;

  // Identifies the current render inputs. State that belongs to a previous
  // render (frame, QR result) is ignored by comparing these keys, which lets us
  // derive the current step during render instead of resetting state in effects.
  const renderKey = `${eventConfig.id}:${frameTheme}`;

  // Re-render the frame whenever the captured canvas, event or theme changes.
  useEffect(() => {
    if (!capturedCanvas) return;
    let cancelled = false;

    renderFrame(capturedCanvas, eventConfig, frameTheme)
      .then((framedCanvas) => {
        if (cancelled) return;
        setFramedDataUrl(canvasToDataURL(framedCanvas, 'jpeg', 0.92));
        setRenderError('');
        setRenderedKey(renderKey);
      })
      .catch((err) => {
        console.error(err);
        if (cancelled) return;
        setRenderError('Failed to render the photo frame.');
        setRenderedKey(renderKey);
      });

    return () => {
      cancelled = true;
    };
  }, [capturedCanvas, eventConfig, frameTheme, renderKey]);

  const isRendering = !!capturedCanvas && renderedKey !== renderKey;
  const hasRenderError = !!renderError && renderedKey === renderKey;
  const hasQr = !!saveResult && saveResultKey === renderKey;
  const step: 'rendering' | 'preview' | 'qr' | 'error' = hasRenderError
    ? 'error'
    : isRendering
      ? 'rendering'
      : hasQr
        ? 'qr'
        : 'preview';

  const changeTheme = (theme: FrameTheme) => {
    setSaveError('');
    setFrameTheme(theme);
  };

  const handleGetQR = async () => {
    if (!framedDataUrl) return;
    if (!consentGiven) {
      alert('Please check the box to consent to cloud storage for QR code sharing.');
      return;
    }
    setSavingQR(true);
    setSaveError('');
    try {
      const { savePhoto } = await import('@/lib/photo-service');
      const result = await savePhoto(framedDataUrl, {
        format: 'jpeg',
        width: 1080,
        height: 1350,
        retentionHours: 24,
        consentGiven: true,
      });
      setSaveResult(result);
      setSaveResultKey(renderKey);
    } catch (err) {
      console.error(err);
      setSaveError('Failed to save photo to cloud. You can still download directly below.');
    } finally {
      setSavingQR(false);
    }
  };

  const handleDownload = () => {
    if (!framedDataUrl) return;
    const a = document.createElement('a');
    a.href = framedDataUrl;
    a.download = `${eventConfig.id}-${frameTheme}-selfie.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <AnimatePresence mode="wait">
        {step === 'rendering' && (
          <motion.div
            key="rendering"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12"
          >
            <LoadingState
              message={`Rendering ${frameTheme.toUpperCase()} theme frame…`}
              accentColor={accent}
            />
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div
            key="error"
            className="flex flex-col items-center gap-4 p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-5xl">❌</span>
            <p className="text-red-400 font-bold">{renderError}</p>
            <button onClick={onRetake} className="btn-retro" style={{ background: accent }}>
              Retake Photo
            </button>
          </motion.div>
        )}

        {step === 'preview' && framedDataUrl && (
          <motion.div
            key="preview"
            className="w-full flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, type: 'spring' }}
          >
            {/* Theme Toggle Bar */}
            <div
              className="flex items-center gap-2 p-1.5 rounded-full border shadow-lg"
              style={{
                background: 'rgba(0,0,0,0.6)',
                borderColor: accent,
              }}
            >
              <button
                type="button"
                onClick={() => changeTheme('dark')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  frameTheme === 'dark'
                    ? 'text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  background: frameTheme === 'dark' ? accent : 'transparent',
                }}
              >
                <span>🌙</span> Dark Frame
              </button>
              <button
                type="button"
                onClick={() => changeTheme('light')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  frameTheme === 'light'
                    ? 'text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  background: frameTheme === 'light' ? accent : 'transparent',
                }}
              >
                <span>☀️</span> Light Frame
              </button>
            </div>

            {/* Framed Image Preview Container */}
            <div
              className="relative rounded-2xl overflow-hidden w-full max-w-xs sm:max-w-sm transition-all duration-300"
              style={{
                border: `4px solid ${accent}`,
                boxShadow: `0 0 45px ${accent}33`,
              }}
            >
              <Image
                src={framedDataUrl}
                alt={`Your ${eventConfig.title} ${frameTheme} theme selfie`}
                width={540}
                height={675}
                className="w-full h-auto block"
                unoptimized
              />
              <div
                className="absolute top-3 right-3 text-black text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"
                style={{ background: accent }}
              >
                <span>{frameTheme === 'dark' ? '🌙' : '☀️'}</span>
                <span>{frameTheme.toUpperCase()}</span>
              </div>
            </div>

            {/* Privacy Consent Checkbox */}
            <label className="flex items-start gap-3 max-w-sm w-full px-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 w-4 h-4 flex-shrink-0 cursor-pointer"
                style={{ accentColor: accent }}
                id="consent-checkbox"
              />
              <span className="text-xs text-gray-300 leading-relaxed">
                I consent to temporarily store my photo for 24 hours to generate a QR download link.
                Auto-deleted afterwards.
              </span>
            </label>

            {saveError && (
              <p className="text-red-400 text-xs text-center max-w-sm">{saveError}</p>
            )}

            {/* Action Buttons - Fully Mobile Responsive Grid */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <button
                onClick={onRetake}
                className="btn-retro-outline py-3 text-sm flex items-center justify-center gap-2"
                style={{ borderColor: accent, color: accent }}
                id="retake-btn"
              >
                <span>🔄</span> RETAKE
              </button>

              <button
                onClick={handleDownload}
                className="btn-retro py-3 text-sm flex items-center justify-center gap-2 text-black font-black"
                style={{ background: accent }}
                id="download-btn"
              >
                <span>⬇️</span> DOWNLOAD
              </button>

              <button
                onClick={handleGetQR}
                disabled={savingQR}
                className="btn-retro col-span-2 py-3.5 text-base flex items-center justify-center gap-2 text-black font-black shadow-lg disabled:opacity-60"
                id="get-qr-btn"
                style={{
                  background:
                    eventConfig.secondaryColor || '#FF9F1C',
                }}
              >
                <span>📱</span> {savingQR ? 'SAVING…' : 'GET MY QR CODE'}
              </button>

              <button
                onClick={onStartAgain}
                className="btn-retro-outline col-span-2 py-2.5 text-xs text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
                id="start-again-btn"
              >
                🏠 Choose Another Event
              </button>
            </div>
          </motion.div>
        )}

        {step === 'qr' && saveResult && (
          <motion.div
            key="qr-panel"
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-xl">
              {framedDataUrl && (
                <div
                  className="rounded-xl overflow-hidden max-w-[200px] w-full flex-shrink-0 shadow-lg"
                  style={{ border: `3px solid ${accent}` }}
                >
                  <Image
                    src={framedDataUrl}
                    alt="Framed selfie"
                    width={200}
                    height={250}
                    className="w-full h-auto block"
                    unoptimized
                  />
                </div>
              )}
              <div className="w-full flex-1 min-w-0">
                <QRCodePanel
                  shareUrl={saveResult.shareUrl}
                  downloadUrl={saveResult.downloadUrl}
                  isLocal={saveResult.isLocal}
                  onNewSession={onStartAgain}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
