'use client';
import { motion } from 'framer-motion';

/**
 * Clean, thin-line geometric 8-point asterisk replacing retro starbursts
 */
export function ThinAsteriskSVG({
  size = 24,
  color = '#E05C1A',
  strokeWidth = 1.6,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const r = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      {/* 4 crossed thin lines creating an 8-pointed geometric asterisk */}
      <line x1={r} y1="2" x2={r} y2={size - 2} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="2" y1={r} x2={size - 2} y2={r} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="4" y1="4" x2={size - 4} y2={size - 4} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1={size - 4} y1="4" x2="4" y2={size - 4} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Tiny clean center dot */}
      <circle cx={r} cy={r} r={strokeWidth * 0.9} fill={color} />
    </svg>
  );
}

/**
 * Clean floating background asterisks used sparingly
 */
export default function CleanGeometricDecorations() {
  const asterisks = [
    { x: '3%', y: '6%', size: 36, delay: 0, opacity: 0.35, rotate: 15 },
    { x: '94%', y: '8%', size: 42, delay: 0.2, opacity: 0.35, rotate: -25 },
    { x: '6%', y: '35%', size: 28, delay: 0.4, opacity: 0.25, rotate: 45 },
    { x: '93%', y: '38%', size: 30, delay: 0.6, opacity: 0.25, rotate: -15 },
    { x: '4%', y: '68%', size: 32, delay: 0.3, opacity: 0.2, rotate: 30 },
    { x: '95%', y: '72%', size: 36, delay: 0.5, opacity: 0.22, rotate: -35 },
    { x: '8%', y: '92%', size: 26, delay: 0.7, opacity: 0.25, rotate: 10 },
    { x: '92%', y: '94%', size: 28, delay: 0.8, opacity: 0.25, rotate: -20 },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {asterisks.map((ast, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: ast.x,
            top: ast.y,
            opacity: ast.opacity,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: ast.opacity, scale: 1, rotate: [ast.rotate, ast.rotate + 180] }}
          transition={{
            opacity: { duration: 0.6, delay: ast.delay },
            scale: { duration: 0.6, delay: ast.delay },
            rotate: { duration: 40 + i * 5, repeat: Infinity, ease: 'linear' },
          }}
        >
          <ThinAsteriskSVG size={ast.size} color="#E05C1A" strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
}
