'use client';
import { motion } from 'framer-motion';
import { ThinAsteriskSVG } from './GeometricAsterisk';

export default function RetroDecorations() {
  const decorations = [
    { x: '4%', y: '6%', size: 34, delay: 0, opacity: 0.35, rotate: 15 },
    { x: '94%', y: '7%', size: 38, delay: 0.2, opacity: 0.35, rotate: -25 },
    { x: '5%', y: '32%', size: 26, delay: 0.4, opacity: 0.25, rotate: 40 },
    { x: '93%', y: '36%', size: 28, delay: 0.6, opacity: 0.25, rotate: -15 },
    { x: '4%', y: '65%', size: 30, delay: 0.3, opacity: 0.25, rotate: 20 },
    { x: '94%', y: '68%', size: 32, delay: 0.5, opacity: 0.25, rotate: -30 },
    { x: '8%', y: '90%', size: 26, delay: 0.7, opacity: 0.28, rotate: 10 },
    { x: '92%', y: '92%', size: 28, delay: 0.8, opacity: 0.28, rotate: -20 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
      {decorations.map((d, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: d.x,
            top: d.y,
            opacity: d.opacity,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: d.opacity, scale: 1, rotate: [d.rotate, d.rotate + 180] }}
          transition={{
            opacity: { duration: 0.6, delay: d.delay },
            scale: { duration: 0.6, delay: d.delay },
            rotate: { duration: 35 + i * 5, repeat: Infinity, ease: 'linear' },
          }}
        >
          <ThinAsteriskSVG size={d.size} color="#E05C1A" strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
}
