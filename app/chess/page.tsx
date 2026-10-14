'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chess, Square } from 'chess.js';
import Link from 'next/link';

// ─── Theme definitions (Orange, Black, White) ───────────────────────────────
const LIGHT_THEME = {
  bg: '#FFFFFF',
  surface: '#F4F4F5',
  text: '#0A0A0A',
  textSub: '#52525B',
  orange: '#FF6500',
  border: 'rgba(0,0,0,0.1)',
  sqLight: '#F5F5F7',
  sqDark: '#D4D4D8',
  pieceLight: '#0A0A0A',
  pieceDark: '#FF6500',
};

type Theme = typeof LIGHT_THEME;

// ─── Chess piece unicode symbols ─────────────────────────────────────────────
const PIECE_SYMBOLS: Record<string, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

// ─── Chess Board Component ────────────────────────────────────────────────────
interface ChessBoardProps {
  theme: Theme;
  game: Chess;
  selected: Square | null;
  legalMoves: string[];
  onSquareClick: (sq: Square) => void;
  lastMove: { from: string; to: string } | null;
}

function ChessBoard({ theme, game, selected, legalMoves, onSquareClick, lastMove }: ChessBoardProps) {
  const files = ['a','b','c','d','e','f','g','h'];
  const ranks = [8,7,6,5,4,3,2,1];

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="grid grid-cols-8 rounded-xl overflow-hidden shadow-2xl"
        style={{
          border: `3px solid ${theme.orange}`,
          boxShadow: `0 0 35px ${theme.orange}33`,
        }}
      >
        {ranks.map(rank => files.map(file => {
          const sq = `${file}${rank}` as Square;
          const piece = game.get(sq);
          const isLight = (files.indexOf(file) + rank) % 2 === 0;
          const isSelected = selected === sq;
          const isLegal = legalMoves.includes(sq);
          const isLastMove = lastMove && (lastMove.from === sq || lastMove.to === sq);

          let bgColor = isLight ? theme.sqLight : theme.sqDark;
          if (isSelected) bgColor = theme.orange;
          else if (isLastMove) bgColor = isLight ? '#FF8833' : '#CC5200';

          return (
            <motion.button
              key={sq}
              onClick={() => onSquareClick(sq)}
              className="relative w-[36px] h-[36px] min-[360px]:w-10 min-[360px]:h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg min-[360px]:text-xl sm:text-2xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6500]"
              style={{ background: bgColor }}
              whileTap={{ scale: 0.95 }}
              aria-label={`${sq}${piece ? ` ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : ''}`}
            >
              {isLegal && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {piece ? (
                    <div className="absolute inset-0 rounded-full border-4 opacity-75" style={{ borderColor: theme.orange }} />
                  ) : (
                    <div className="w-3 h-3 rounded-full opacity-80" style={{ background: theme.orange }} />
                  )}
                </motion.div>
              )}
              {piece && (
                <span
                  style={{
                    color: piece.color === 'w' ? theme.pieceLight : theme.pieceDark,
                    filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))',
                  }}
                >
                  {PIECE_SYMBOLS[piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()]}
                </span>
              )}
            </motion.button>
          );
        }))}
      </div>

      {/* File labels */}
      <div className="grid grid-cols-8 w-full max-w-[288px] min-[360px]:max-w-[320px] sm:max-w-[384px]">
        {files.map(f => (
          <div key={f} className="text-center text-xs font-bold font-rajdhani uppercase" style={{ color: theme.textSub }}>
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Match Info Card ──────────────────────────────────────────────────────────
function InfoCard({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 transition-colors" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
      {children}
    </div>
  );
}

// ─── Chess Arena Page ─────────────────────────────────────────────────────────
export default function ChessArenaPage() {
  const [game, setGame] = useState(() => new Chess());
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [status, setStatus] = useState('White to move');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [promotionPending, setPromotionPending] = useState<{ from: Square; to: Square } | null>(null);
  const [tab, setTab] = useState<'board'|'rules'|'about'>('board');

  const theme = LIGHT_THEME;

  const updateStatus = useCallback((g: Chess) => {
    if (g.isCheckmate()) setStatus(`Checkmate! ${g.turn() === 'w' ? 'Black' : 'White'} wins 🏆`);
    else if (g.isDraw()) setStatus('Draw!');
    else if (g.isCheck()) setStatus(`${g.turn() === 'w' ? 'White' : 'Black'} is in check!`);
    else setStatus(`${g.turn() === 'w' ? 'White' : 'Black'} to move`);
  }, []);

  const handleSquareClick = useCallback((sq: Square) => {
    if (game.isGameOver()) return;
    const piece = game.get(sq);

    if (selected) {
      if (legalMoves.includes(sq)) {
        const movingPiece = game.get(selected);
        if (movingPiece?.type === 'p' && ((movingPiece.color === 'w' && sq[1] === '8') || (movingPiece.color === 'b' && sq[1] === '1'))) {
          setPromotionPending({ from: selected, to: sq });
          return;
        }
        const newGame = new Chess(game.fen());
        const move = newGame.move({ from: selected, to: sq });
        if (move) {
          setGame(newGame);
          setLastMove({ from: selected, to: sq });
          setMoveHistory(prev => [...prev, move.san]);
          updateStatus(newGame);
        }
        setSelected(null);
        setLegalMoves([]);
      } else if (piece && piece.color === game.turn()) {
        setSelected(sq);
        setLegalMoves(game.moves({ square: sq, verbose: true }).map(m => m.to));
      } else {
        setSelected(null);
        setLegalMoves([]);
      }
    } else if (piece && piece.color === game.turn()) {
      setSelected(sq);
      setLegalMoves(game.moves({ square: sq, verbose: true }).map(m => m.to));
    }
  }, [game, selected, legalMoves, updateStatus]);

  const handlePromotion = (piece: 'q' | 'r' | 'b' | 'n') => {
    if (!promotionPending) return;
    const newGame = new Chess(game.fen());
    const move = newGame.move({ from: promotionPending.from, to: promotionPending.to, promotion: piece });
    if (move) {
      setGame(newGame);
      setLastMove({ from: promotionPending.from, to: promotionPending.to });
      setMoveHistory(prev => [...prev, move.san]);
      updateStatus(newGame);
    }
    setPromotionPending(null);
    setSelected(null);
    setLegalMoves([]);
  };

  const resetGame = () => {
    setGame(new Chess());
    setSelected(null);
    setLegalMoves([]);
    setLastMove(null);
    setMoveHistory([]);
    setStatus('White to move');
    setPromotionPending(null);
  };

  return (
    <main className="min-h-screen transition-colors duration-300" style={{ background: theme.bg, color: theme.text }}>
      {/* Top nav */}
      <nav
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 backdrop-blur-md"
        style={{ background: `${theme.bg}ee`, borderBottom: `1px solid ${theme.border}` }}
      >
        <Link
          href="/"
          className="text-xs sm:text-sm font-rajdhani font-bold transition-colors hover:text-[#FF6500]"
          style={{ color: theme.orange }}
        >
          ← HOME
        </Link>

        <div className="text-center">
          <p className="font-bebas text-lg sm:text-xl uppercase tracking-wider" style={{ color: theme.orange }}>
            ♟️ CHESS ARENA
          </p>
          <p className="text-[10px] sm:text-xs font-rajdhani tracking-widest uppercase" style={{ color: theme.textSub }}>
            VIYUGAM 2K26 · CSE
          </p>
        </div>

        <span className="text-xs font-rajdhani font-bold text-[#666666]">LIGHT THEME</span>
      </nav>

      {/* Hero */}
      <div
        className="px-4 py-8 sm:py-12 flex flex-col items-center gap-3 text-center"
        style={{
          background: `linear-gradient(180deg, ${theme.surface} 0%, transparent 100%)`,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <span className="text-7xl sm:text-9xl select-none" style={{ filter: `drop-shadow(0 0 25px ${theme.orange}77)` }}>
            ♛
          </span>
        </motion.div>

        <motion.h1
          className="font-bebas font-black uppercase leading-none tracking-tight text-white"
          style={{
            fontSize: 'clamp(3rem, 9vw, 5.5rem)',
            color: theme.text,
            textShadow: `0 0 35px ${theme.orange}44`,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          CHESS <span style={{ color: theme.orange }}>ARENA</span>
        </motion.h1>

        <p className="font-rajdhani font-bold uppercase tracking-widest text-xs sm:text-sm" style={{ color: theme.orange }}>
          THINK AHEAD. MAKE YOUR MOVE.
        </p>

        <p className="text-xs sm:text-sm max-w-sm font-inter" style={{ color: theme.textSub }}>
          CSE Department · PPG Institute of Technology, Coimbatore · VIYUGAM 2K26
        </p>

        <Link href="/booth?event=chess-arena&theme=light" className="mt-2">
          <motion.button
            className="btn-retro px-6 py-3 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            id="chess-photo-btn"
          >
            📸 TAKE CHESS SELFIE
          </motion.button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: theme.border }}>
        {(['board','rules','about'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-3 text-xs sm:text-sm font-rajdhani font-bold uppercase tracking-widest transition-all"
            style={{
              color: tab === t ? theme.orange : theme.textSub,
              borderBottom: tab === t ? `3px solid ${theme.orange}` : '3px solid transparent',
            }}
            id={`tab-${t}`}
          >
            {t === 'board' ? '🎮 Play' : t === 'rules' ? '📜 Rules' : '🏆 About'}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 gap-6 flex flex-col lg:flex-row">
        {tab === 'board' && (
          <>
            {/* Board */}
            <div className="flex flex-col items-center gap-4 flex-1">
              {/* Status Banner */}
              <motion.div
                className="w-full max-w-sm rounded-lg px-4 py-2 text-center font-rajdhani font-bold text-base"
                style={{
                  background: theme.surface,
                  border: `1px solid ${theme.orange}66`,
                  color: theme.orange,
                }}
                animate={{ scale: status.includes('Checkmate') || status.includes('Draw') ? [1,1.05,1] : 1 }}
              >
                {status}
              </motion.div>

              {/* Promotion modal */}
              <AnimatePresence>
                {promotionPending && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.75)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div
                      className="rounded-2xl p-6 flex flex-col items-center gap-4"
                      style={{ background: theme.surface, border: `3px solid ${theme.orange}` }}
                    >
                      <p className="font-bebas text-2xl tracking-wide" style={{ color: theme.orange }}>
                        PROMOTE PAWN
                      </p>
                      <div className="flex gap-3">
                        {(['q','r','b','n'] as const).map(p => (
                          <motion.button
                            key={p}
                            onClick={() => handlePromotion(p)}
                            className="w-14 h-14 rounded-xl text-3xl flex items-center justify-center font-bold"
                            style={{ background: theme.bg, border: `2px solid ${theme.orange}`, color: theme.pieceLight }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {PIECE_SYMBOLS[game.turn() === 'w' ? p.toUpperCase() : p]}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <ChessBoard
                theme={theme}
                game={game}
                selected={selected}
                legalMoves={legalMoves}
                onSquareClick={handleSquareClick}
                lastMove={lastMove}
              />

              {/* Controls */}
              <div className="flex gap-3 flex-wrap justify-center mt-2">
                <motion.button
                  onClick={resetGame}
                  whileTap={{ scale: 0.97 }}
                  className="btn-retro-outline text-sm px-4 py-2"
                  id="reset-game-btn"
                >
                  🔄 New Game
                </motion.button>
                <motion.button
                  onClick={() => {
                    const g = new Chess(game.fen());
                    if (g.undo() !== null) {
                      const prev = new Chess(g.fen());
                      setGame(prev);
                      setMoveHistory(h => h.slice(0, -1));
                      updateStatus(prev);
                      setSelected(null);
                      setLegalMoves([]);
                    }
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-retro-outline text-sm px-4 py-2"
                  id="undo-btn"
                  style={{ borderColor: theme.border, color: theme.textSub }}
                >
                  ↩ Undo
                </motion.button>
              </div>
            </div>

            {/* Side panel */}
            <div className="flex flex-col gap-4 w-full lg:w-72">
              {/* Players */}
              <InfoCard theme={theme}>
                <h3 className="font-bebas text-lg tracking-wider mb-2" style={{ color: theme.orange }}>
                  PLAYERS
                </h3>
                {[['White','♔ Player 1'],['Black','♚ Player 2']].map(([color, label]) => (
                  <div key={color} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: theme.border }}>
                    <span className="text-2xl">{color === 'White' ? '♔' : '♚'}</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: theme.text }}>{label}</p>
                      <p className="text-xs font-rajdhani font-semibold" style={{ color: theme.textSub }}>{color} pieces</p>
                    </div>
                    {game.turn() === (color === 'White' ? 'w' : 'b') && !game.isGameOver() && (
                      <span className="ml-auto text-[10px] font-rajdhani font-bold px-2 py-0.5 rounded-full bg-[#FF6500]/20 text-[#FF6500]">
                        TURN
                      </span>
                    )}
                  </div>
                ))}
              </InfoCard>

              {/* Move history */}
              <InfoCard theme={theme}>
                <h3 className="font-bebas text-lg tracking-wider mb-2" style={{ color: theme.orange }}>
                  MOVE HISTORY ({moveHistory.length})
                </h3>
                <div className="max-h-48 overflow-y-auto font-mono text-xs flex flex-col gap-1 pr-1">
                  {moveHistory.length === 0 ? (
                    <p className="text-xs" style={{ color: theme.textSub }}>No moves yet</p>
                  ) : (
                    moveHistory.map((m, i) => (
                      <span key={i} style={{ color: i % 2 === 0 ? theme.text : theme.orange }}>
                        {i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : '   '}{m}
                      </span>
                    ))
                  )}
                </div>
              </InfoCard>
            </div>
          </>
        )}

        {tab === 'rules' && (
          <div className="w-full flex flex-col gap-4">
            <InfoCard theme={theme}>
              <h2 className="font-bebas text-2xl tracking-wide mb-3" style={{ color: theme.orange }}>
                VIYUGAM 2K26 CHESS TOURNAMENT RULES
              </h2>
              <ul className="flex flex-col gap-2.5 text-sm font-inter leading-relaxed" style={{ color: theme.textSub }}>
                <li>✦ <strong>Time Control:</strong> Rapid format (10 mins + 5 sec increment).</li>
                <li>✦ <strong>FIDE Standards:</strong> Standard FIDE tournament rules apply. Touch-move rule strictly enforced.</li>
                <li>✦ <strong>Illegal Moves:</strong> First illegal move gives opponent 2 minutes; second illegal move forfeits game.</li>
                <li>✦ <strong>Tie-Breaks:</strong> Armageddon blitz match in case of equal points.</li>
              </ul>
            </InfoCard>
          </div>
        )}

        {tab === 'about' && (
          <div className="w-full flex flex-col gap-4">
            <InfoCard theme={theme}>
              <h2 className="font-bebas text-2xl tracking-wide mb-3" style={{ color: theme.orange }}>
                ABOUT CHESS ARENA · VIYUGAM 2K26
              </h2>
              <p className="text-sm font-inter leading-relaxed" style={{ color: theme.textSub }}>
                Organized by the Department of Computer Science & Engineering at PPG Institute of Technology, Coimbatore.
                Chess Arena brings together the sharpest tactical and strategic minds across engineering colleges in Tamil Nadu.
              </p>
            </InfoCard>
          </div>
        )}
      </div>
    </main>
  );
}
