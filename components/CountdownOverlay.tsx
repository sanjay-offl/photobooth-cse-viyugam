'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  count: number | null;
  accentColor?: string;
}

export default function CountdownOverlay({ count, accentColor = '#FFD400' }: CountdownOverlayProps) {
  return (
    <AnimatePresence>
      {count !== null && (
        <motion.div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40 rounded-xl" />
          <AnimatePresence mode="wait">
            <motion.div key={count}
              initial={{ scale: 2.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
              className="relative z-10 flex flex-col items-center gap-2">
              <span className="text-[140px] font-black leading-none select-none"
                style={{ color: accentColor, textShadow: `0 0 40px ${accentColor}cc, 4px 4px 0 #000`, fontFamily: "'Bebas Neue', Impact, sans-serif" }}>
                {count}
              </span>
              <span className="text-white text-2xl font-bold tracking-widest uppercase" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>
                Get Ready!
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
