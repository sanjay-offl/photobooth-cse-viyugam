'use client';
import { motion } from 'framer-motion';

interface Star {
  x: number; y: number; r: number; points: number; color: string; delay: number;
}

const STARS: Star[] = [
  { x: 4, y: 5, r: 24, points: 12, color: '#FFD400', delay: 0 },
  { x: 92, y: 5, r: 24, points: 12, color: '#FFD400', delay: 0.3 },
  { x: 8, y: 22, r: 16, points: 8, color: '#FF9F1C', delay: 0.6 },
  { x: 88, y: 22, r: 16, points: 8, color: '#FF9F1C', delay: 0.9 },
  { x: 5, y: 50, r: 14, points: 6, color: '#FFD400', delay: 1.2 },
  { x: 93, y: 50, r: 14, points: 6, color: '#FFD400', delay: 1.5 },
  { x: 5, y: 78, r: 18, points: 10, color: '#FF9F1C', delay: 0.4 },
  { x: 93, y: 78, r: 18, points: 10, color: '#FF9F1C', delay: 0.7 },
  { x: 5, y: 93, r: 24, points: 16, color: '#FFD400', delay: 0.2 },
  { x: 93, y: 93, r: 24, points: 16, color: '#FFD400', delay: 0.5 },
  { x: 50, y: 2, r: 14, points: 8, color: '#FF9F1C', delay: 0.8 },
  { x: 20, y: 10, r: 10, points: 6, color: '#FFFFFF', delay: 1.0 },
  { x: 80, y: 10, r: 10, points: 6, color: '#FFFFFF', delay: 1.3 },
];

function StarburstSVG({ r, points, color }: { r: number; points: number; color: string }) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.38;
    pts.push(`${Math.cos(angle) * radius},${Math.sin(angle) * radius}`);
  }
  return (
    <polygon points={pts.join(' ')} fill={color} />
  );
}

function CameraIconSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 50" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="2" y="12" width="56" height="34" rx="5" />
      <rect x="20" y="4" width="20" height="12" rx="3" />
      <circle cx="30" cy="30" r="10" />
      <circle cx="9" cy="19" r="3" fill={color} stroke="none" />
    </svg>
  );
}

function FilmStripSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 30" fill={color} className="w-full h-full">
      <rect x="0" y="0" width="80" height="30" rx="2" />
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <rect x={8 + i * 18} y="3" width="12" height="10" rx="1" fill="#000" />
          <rect x={8 + i * 18} y="17" width="12" height="10" rx="1" fill="#000" />
        </g>
      ))}
    </svg>
  );
}

function SmileySVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <circle cx="30" cy="30" r="28" fill={color} />
      <circle cx="20" cy="25" r="4" fill="#000" />
      <circle cx="40" cy="25" r="4" fill="#000" />
      <path d="M 16 38 Q 30 52 44 38" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PixelGridSVG({ color }: { color: string }) {
  const cells = [[0,0],[1,0],[0,1],[2,1],[1,2],[0,2],[2,2]];
  return (
    <svg viewBox="0 0 36 36" className="w-full h-full">
      {cells.map(([gx, gy], i) => (
        <rect key={i} x={gx * 12 + 1} y={gy * 12 + 1} width="10" height="10" fill={color} />
      ))}
    </svg>
  );
}

function SpeechBubbleSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 70 55" className="w-full h-full">
      <rect x="2" y="2" width="58" height="38" rx="8" fill={color} />
      <polygon points="12,38 5,52 28,38" fill={color} />
      <text x="31" y="26" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#000">&lt;/&gt;</text>
    </svg>
  );
}

export default function RetroDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Starbursts */}
      {STARS.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2, transform: 'translate(-50%,-50%)' }}
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: s.delay, duration: 0.5, type: 'spring' }}
        >
          <svg viewBox={`${-s.r} ${-s.r} ${s.r * 2} ${s.r * 2}`} className="w-full h-full">
            <StarburstSVG r={s.r} points={s.points} color={s.color} />
          </svg>
        </motion.div>
      ))}

      {/* Camera icons */}
      {[
        { left: '4%', top: '15%', size: 50 },
        { left: '92%', top: '15%', size: 50 },
        { left: '4%', top: '70%', size: 45 },
        { left: '92%', top: '70%', size: 45 },
      ].map((pos, i) => (
        <motion.div key={`cam-${i}`} className="absolute" style={{ left: pos.left, top: pos.top, width: pos.size, height: pos.size * 0.83, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}>
          <CameraIconSVG color={i % 2 === 0 ? '#FFD400' : '#FF9F1C'} />
        </motion.div>
      ))}

      {/* Film strips */}
      {[
        { left: '5%', top: '38%', w: 60, h: 24 },
        { left: '93%', top: '38%', w: 60, h: 24 },
      ].map((pos, i) => (
        <motion.div key={`film-${i}`} className="absolute" style={{ left: pos.left, top: pos.top, width: pos.w, height: pos.h, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + i * 0.3 }}>
          <FilmStripSVG color="#FFD400" />
        </motion.div>
      ))}

      {/* Smileys */}
      {[
        { left: '6%', top: '83%', size: 38 },
        { left: '92%', top: '83%', size: 38 },
      ].map((pos, i) => (
        <motion.div key={`smiley-${i}`} className="absolute" style={{ left: pos.left, top: pos.top, width: pos.size, height: pos.size, transform: 'translate(-50%, -50%)' }}
          animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3, delay: i }}>
          <SmileySVG color="#FFD400" />
        </motion.div>
      ))}

      {/* Pixel grids */}
      {[
        { left: '12%', top: '9%', size: 32 },
        { left: '88%', top: '9%', size: 32 },
      ].map((pos, i) => (
        <motion.div key={`pixel-${i}`} className="absolute" style={{ left: pos.left, top: pos.top, width: pos.size, height: pos.size, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 1.5 }}>
          <PixelGridSVG color="#FF9F1C" />
        </motion.div>
      ))}

      {/* Speech bubble with code */}
      {[
        { left: '6%', top: '55%', size: 50 },
        { left: '92%', top: '55%', size: 50 },
      ].map((pos, i) => (
        <motion.div key={`speech-${i}`} className="absolute" style={{ left: pos.left, top: pos.top, width: pos.size, height: pos.size * 0.8, transform: 'translate(-50%, -50%)' }}
          animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.7 }}>
          <SpeechBubbleSVG color={i % 2 === 0 ? '#FFD400' : '#FF9F1C'} />
        </motion.div>
      ))}

      {/* Halftone dots (decorative rows) */}
      <div className="absolute inset-x-0 bottom-16 flex justify-around opacity-10 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-yellow-400" />
        ))}
      </div>
    </div>
  );
}
