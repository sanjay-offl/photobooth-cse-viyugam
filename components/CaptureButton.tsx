'use client';
import { motion } from 'framer-motion';

interface CaptureButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  accentColor?: string;
}

export default function CaptureButton({ onClick, disabled, label = 'CAPTURE', accentColor = '#FFD400' }: CaptureButtonProps) {
  return (
    <motion.button onClick={onClick} disabled={disabled} aria-label={label} id="capture-btn"
      className="relative flex items-center justify-center focus:outline-none rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ '--ring-color': accentColor } as React.CSSProperties}
      whileTap={{ scale: 0.93 }} whileHover={{ scale: disabled ? 1 : 1.07 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
      <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
        style={{ border: `4px solid ${accentColor}`, boxShadow: `0 0 20px ${accentColor}44` }}>
        <motion.div className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
          style={{ background: accentColor }}
          animate={disabled ? {} : { boxShadow: [`0 0 0 0 ${accentColor}88`, `0 0 0 16px ${accentColor}00`] }}
          transition={{ repeat: Infinity, duration: 1.8 }}>
          <svg viewBox="0 0 36 30" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-7">
            <rect x="1" y="7" width="34" height="21" rx="3" />
            <rect x="12" y="2" width="12" height="7" rx="2" />
            <circle cx="18" cy="18" r="6" />
          </svg>
        </motion.div>
      </div>
    </motion.button>
  );
}
