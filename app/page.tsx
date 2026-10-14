'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ALL_EVENTS, EventConfig } from '@/lib/events';
import RetroDecorations from '@/components/RetroDecorations';

function EventCard({ event, index }: { event: EventConfig; index: number }) {
  const href = event.id === 'chess-arena' ? '/chess' : `/booth?event=${event.id}`;
  const isTechnical = ['vibe-coding', 'prompt-war', 'output-hunt'].includes(event.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 120 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group transition-all"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E8DDD6',
        boxShadow: '0 8px 32px rgba(60, 35, 20, 0.1)',
      }}
    >
      <Link href={href} id={`event-card-${event.id}`} className="block">
        {/* Subtle orange hover glow overlay */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #FF6500 0%, #000000 100%)' }}
        />

        <div className="relative p-5 sm:p-6 flex flex-col gap-3">
          {/* Header row: Dept category pill + Theme badge */}
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-[11px] font-bold font-rajdhani tracking-[0.16em] uppercase px-2.5 py-0.5 rounded-full"
              style={{
                color: '#FF6500',
                background: 'rgba(255, 101, 0, 0.12)',
                border: '1px solid rgba(255, 101, 0, 0.3)',
              }}
            >
              CSE {isTechnical ? 'TECHNICAL' : 'NON-TECHNICAL'}
            </span>

            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E8DDD6] bg-[#FFF8F4] text-[#666666] flex items-center gap-1"
              title="Supports both Dark & Light theme frames"
            >
              <span>🌙</span>
              <span>☀️</span>
            </span>
          </div>

          {/* Title & Emoji row */}
          <div className="flex items-center gap-3 mt-1">
            <span className="text-3xl sm:text-4xl select-none flex-shrink-0">{event.emoji}</span>
            <div>
              <h2
                className="text-2xl sm:text-3xl font-black font-bebas tracking-wide uppercase leading-tight text-[#1A1A1A] group-hover:text-[#FF6500] transition-colors"
              >
                {event.title}
              </h2>
              <p className="text-xs font-rajdhani font-semibold text-[#A3A3A3] tracking-widest uppercase">
                {event.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#555555] text-xs sm:text-sm font-inter leading-relaxed">
            {event.description}
          </p>

          {/* Tagline */}
          <p className="text-xs font-bold font-rajdhani tracking-wider text-[#FF6500] uppercase">
            ✦ {event.tagline}
          </p>

          {/* CTA Button */}
          <motion.div
            className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-black font-bebas text-lg tracking-wider transition-all"
            style={{
              background: '#FF6500',
              boxShadow: '0 4px 16px rgba(255, 101, 0, 0.3)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {event.id === 'chess-arena' ? '♟️ ENTER CHESS ARENA' : '📸 OPEN PHOTO BOOTH'}
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#F8F6F2] text-[#1A1A1A] overflow-x-hidden px-4 py-8 sm:py-12">
      <RetroDecorations />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8 sm:gap-10">
        {/* Hero Section */}
        <motion.div
          className="text-center flex flex-col items-center gap-3 w-full"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,101,0,0.35)] bg-[rgba(255,101,0,0.1)]">
            <span className="w-2 h-2 rounded-full bg-[#FF6500] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold font-rajdhani tracking-[0.2em] uppercase text-[#E05C1A]">
              NATIONAL LEVEL TECHNICAL SYMPOSIUM · CSE DEPT
            </span>
          </div>

          {/* Viyugam Main Title Lockup */}
          <h1
          className="text-6xl sm:text-8xl md:text-9xl font-bebas font-black tracking-tight leading-none my-1 text-[#1A1A1A]"
            style={{
              textShadow: '0 0 45px rgba(255, 101, 0, 0.45)',
            }}
          >
            VIYU<span className="text-[#FF6500]">GAM</span> <span className="text-[#1A1A1A]">2K26</span>
          </h1>

          {/* Subheading */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-xl sm:text-2xl font-bebas tracking-widest text-[#FF6500] uppercase">
              DIGITAL RETRO SELFIE BOOTH & CHESS ARENA
            </p>
            <p className="text-xs sm:text-sm font-rajdhani text-[#666666] font-semibold tracking-wider uppercase">
              PPG INSTITUTE OF TECHNOLOGY, COIMBATORE · 15 OCTOBER 2026
            </p>
          </div>

          <p className="text-[#555555] text-xs sm:text-sm max-w-md text-center leading-relaxed font-inter mt-1">
            Pick your event, snap a selfie in our custom retro event frames, choose a dark or light frame, and scan the QR code to download instantly to your phone.
          </p>

          {/* Highlights / Badges Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2">
            {[
              '40+ EVENTS',
              '8 DEPARTMENTS',
              'CASH PRIZES',
              'INSTANT QR DOWNLOAD',
            ].map((badge) => (
              <span
                key={badge}
                className="text-[10px] sm:text-xs font-rajdhani font-bold px-3 py-1 rounded-md bg-white border border-[#E8DDD6] text-[#666666] tracking-wider"
              >
                ✦ {badge}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Event Selection Grid */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#FF6500]/40" />
            <h2 className="text-xs sm:text-sm font-rajdhani font-bold tracking-[0.25em] text-[#FF6500] uppercase">
              CHOOSE YOUR CSE EVENT
            </h2>
            <div className="h-px w-12 bg-[#FF6500]/40" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ALL_EVENTS.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>

        {/* Privacy & Info Card */}
        <motion.div
          className="w-full max-w-md rounded-xl p-4 text-center retro-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-[#666666] leading-relaxed font-inter">
            <span className="text-[#FF6500] font-bold">🔒 Privacy Notice:</span>{' '}
            Your camera is accessed only with your permission. Cloud photos are temporary and automatically deleted after 24 hours.
          </p>
        </motion.div>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-center gap-3 text-xs text-neutral-500 font-rajdhani tracking-wider">
          <Link href="/admin" className="hover:text-[#FF6500] transition-colors">
            Admin Settings
          </Link>
          <span className="hidden sm:inline">·</span>
          <span>PPG INSTITUTE OF TECHNOLOGY, COIMBATORE</span>
          <span className="hidden sm:inline">·</span>
          <a
            href="https://viyugam2k26.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF6500] hover:underline"
          >
            viyugam2k26.vercel.app ↗
          </a>
        </footer>
      </div>
    </main>
  );
}
