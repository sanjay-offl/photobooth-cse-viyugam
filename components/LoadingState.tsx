'use client';
import { motion } from 'framer-motion';

interface LoadingStateProps { message?: string; accentColor?: string; }

export default function LoadingState({ message = 'Loading…', accentColor = '#FF6500' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center gap-5 py-12">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="text-5xl select-none">
        📸
      </motion.div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="w-3 h-3 rounded-full"
            style={{ background: accentColor }}
            animate={{ y: [0, -10, 0], opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }} />
        ))}
      </div>
      <p className="font-bold text-xl text-center tracking-wide" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", color: accentColor }}>{message}</p>
    </div>
  );
}
