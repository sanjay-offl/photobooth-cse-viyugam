'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ALL_EVENTS, EventConfig } from '@/lib/events';
import RetroDecorations from '@/components/RetroDecorations';

function EventCard({ event, index }: { event: EventConfig; index: number }) {
  const href = event.id === 'chess-arena' ? '/chess' : `/booth?event=${event.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 120 }}
      whileHover={{ scale: 1.02, y: -3 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
      style={{
        border: `3px solid ${event.cardBorder}`,
        boxShadow: `0 0 24px ${event.cardBorder}22`,
      }}
    >
      <Link href={href} id={`event-card-${event.id}`} className="block">
        {/* Gradient background */}
        <div
          className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20"
          style={{ background: event.gradient }}
        />

        <div className="relative p-4 sm:p-5 flex flex-col gap-2.5 sm:gap-3 bg-black/85">
          {/* Header Row: Emoji + Title + Theme Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl select-none">{event.emoji}</span>
              <div>
                <h2
                  className="text-xl sm:text-2xl font-black leading-tight tracking-wide uppercase"
                  style={{
                    fontFamily: "'Anton', 'Impact', sans-serif",
                    color: event.primaryColor,
                    textShadow: '2px 2px 0 #000',
                  }}
                >
                  {event.title}
                </h2>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {event.subtitle}
                </p>
              </div>
            </div>

            {/* Theme Badge */}
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full border border-gray-700 bg-gray-900/90 text-gray-300 flex items-center gap-1 flex-shrink-0"
              title="Supports both Dark and Light theme frames"
            >
              <span>🌙</span>
              <span>☀️</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            {event.description}
          </p>

          {/* Tagline */}
          <p
            className="text-[11px] sm:text-xs font-bold uppercase tracking-wider line-clamp-1"
            style={{ color: event.secondaryColor }}
          >
            {event.tagline}
          </p>

          {/* CTA Button */}
          <motion.div
            className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider text-black transition-transform"
            style={{
              background: event.primaryColor,
              fontFamily: "'Anton', sans-serif",
              boxShadow: '3px 3px 0 #000',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {event.id === 'chess-arena' ? '♟️ Enter Arena' : '📸 Open Booth'}
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden px-3 sm:px-4 py-6 sm:py-10">
      <RetroDecorations />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6 sm:gap-8">
        {/* Hero Section */}
        <motion.div
          className="text-center flex flex-col items-center gap-2 w-full"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <motion.p
            className="text-[10px] sm:text-xs font-bold tracking-widest sm:tracking-[0.3em] uppercase text-center px-2"
            style={{ color: '#FF9F1C', fontFamily: "'Anton', sans-serif" }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            ✦ VIYUGAM 2K26 · CSE DEPT · PPG INSTITUTE OF TECHNOLOGY ✦
          </motion.p>

          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-none tracking-tight my-1"
            style={{
              fontFamily: "'Anton', 'Impact', sans-serif",
              color: '#FFFFFF',
              WebkitTextStroke: '3px #FFD400',
              paintOrder: 'stroke fill',
              textShadow:
                '5px 5px 0 rgba(0,0,0,0.9), 0 0 35px rgba(255,212,0,0.3)',
            }}
          >
            VIBE<br />SNAP
          </h1>

          <p
            className="text-orange-400 font-black tracking-widest text-xs sm:text-sm uppercase"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            DIGITAL RETRO SELFIE BOOTH
          </p>

          <p className="text-gray-400 text-xs sm:text-sm max-w-sm text-center leading-relaxed mt-0.5">
            5 bespoke event frame designs with custom logos, dark & light themes, and instant mobile QR downloads.
          </p>
        </motion.div>

        {/* Event Selection Grid */}
        <div className="w-full flex flex-col gap-3 sm:gap-4">
          <motion.div
            className="flex items-center justify-center gap-2 text-yellow-400 font-black text-xs tracking-[0.3em] uppercase text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span>✦</span>
            <span>SELECT YOUR EVENT</span>
            <span>✦</span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {ALL_EVENTS.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>

        {/* Privacy notice */}
        <motion.div
          className="w-full max-w-sm rounded-xl border border-gray-800 bg-black/70 p-3.5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
            <span className="text-yellow-400 font-bold">🔒 Privacy First:</span>{' '}
            Camera runs locally in your browser. Cloud photos are auto-deleted after 24 hours. No personal data collected.
          </p>
        </motion.div>

        {/* Footer Admin Link */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <Link
            href="/admin"
            className="hover:text-gray-400 transition-colors"
          >
            Admin Settings
          </Link>
          <span>·</span>
          <span>VIYUGAM 2K26</span>
        </div>
      </div>
    </main>
  );
}
