'use client';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';

interface NavbarProps {
  onThemeToggle?: () => void;
}

const THEME_EVENT = 'viyugam-theme';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark');
}

function getServerSnapshot() {
  return false;
}

export default function Navbar({ onThemeToggle }: NavbarProps) {
  // useSyncExternalStore keeps the toggle in sync with the <html> class without
  // setting state from an effect, and is hydration-safe via the server snapshot.
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('viyugam-theme', next ? 'dark' : 'light');
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(THEME_EVENT));
    onThemeToggle?.();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1A1A1A] border-b border-[#E8DDD6] dark:border-[#2E2E2E] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo Left */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#E05C1A] text-white flex items-center justify-center font-bebas text-lg shadow-sm group-hover:scale-105 transition-transform">
            V
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-2xl tracking-wider text-[#1A1A1A] dark:text-white leading-none">
              VIYUGAM <span className="text-[#E05C1A]">2K26</span>
            </span>
            <span className="font-rajdhani text-[10px] font-bold tracking-[0.2em] text-[#E05C1A] uppercase">
              CSE SYMPOSIUM
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#events"
            className="text-sm font-semibold text-[#333333] dark:text-neutral-300 hover:text-[#E05C1A] dark:hover:text-[#E05C1A] transition-colors"
          >
            Events
          </a>
          <Link
            href="/booth?event=vibe-coding"
            className="text-sm font-semibold text-[#333333] dark:text-neutral-300 hover:text-[#E05C1A] dark:hover:text-[#E05C1A] transition-colors"
          >
            Selfie Booth
          </Link>
          <Link
            href="/chess"
            className="text-sm font-semibold text-[#333333] dark:text-neutral-300 hover:text-[#E05C1A] dark:hover:text-[#E05C1A] transition-colors flex items-center gap-1"
          >
            <span>♟️</span> Chess Arena
          </Link>
          <a
            href="https://viyugam2k26.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#E05C1A] hover:underline flex items-center gap-1"
          >
            Portal ↗
          </a>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            id="theme-toggle-btn"
            aria-label="Toggle dark/light theme"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[#E8DDD6] dark:border-[#333333] bg-[#F8F6F2] dark:bg-[#242424] text-[#1A1A1A] dark:text-neutral-200 hover:border-[#E05C1A] hover:text-[#E05C1A] transition-all"
          >
            <span className="text-base" title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {dark ? '☀️' : '🌙'}
            </span>
          </button>

          {/* Quick CTA */}
          <Link
            href="/booth?event=vibe-coding"
            id="nav-booth-cta"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#E05C1A] hover:bg-[#C84E13] text-white font-rajdhani font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-sm hover:shadow-md"
          >
            <span>📸</span>
            <span className="hidden xs:inline">Selfie</span> Booth
          </Link>
        </div>
      </div>
    </header>
  );
}
