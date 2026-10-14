'use client';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chess, Square } from 'chess.js';
import Link from 'next/link';

// ─── Theme definitions ───────────────────────────────────────────────────────
const DARK_THEME = {
  bg: '#0A0A0A', surface: '#171717', text: '#FFFFFF', textSub: '#A3A3A3',
  gold: '#FFD700', border: '#383838', sqLight: '#3D2B1F', sqDark: '#1A1A1A', pieceLight: '#FFFFF0', pieceDark: '#FFD700',
};
const LIGHT_THEME = {
  bg: '#FFFDF5', surface: '#FFFFFF', text: '#171717', textSub: '#666666',
  gold: '#D4A900', border: '#E5E0D2', sqLight: '#F0D9B5', sqDark: '#B58863', pieceLight: '#1A1A1A', pieceDark: '#D4A900',
};
type Theme = typeof DARK_THEME;

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
      <div className="grid grid-cols-8 rounded-lg overflow-hidden" style={{ border: `3px solid ${theme.gold}`, boxShadow: `0 0 30px ${theme.gold}33` }}>
        {ranks.map(rank => files.map(file => {
          const sq = `${file}${rank}` as Square;
          const piece = game.get(sq);
          const isLight = (files.indexOf(file) + rank) % 2 === 0;
          const isSelected = selected === sq;
          const isLegal = legalMoves.includes(sq);
          const isLastMove = lastMove && (lastMove.from === sq || lastMove.to === sq);

          let bgColor = isLight ? theme.sqLight : theme.sqDark;
          if (isSelected) bgColor = theme.gold;
          else if (isLastMove) bgColor = isLight ? '#cdd16f' : '#aaa23a';

          return (
            <motion.button
              key={sq}
              onClick={() => onSquareClick(sq)}
              className="relative w-[36px] h-[36px] min-[360px]:w-10 min-[360px]:h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg min-[360px]:text-xl sm:text-2xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{ background: bgColor }}
              whileTap={{ scale: 0.95 }}
              aria-label={`${sq}${piece ? ` ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : ''}`}
            >
              {isLegal && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                  {piece ? (
                    <div className="absolute inset-0 rounded-full border-4 opacity-60" style={{ borderColor: theme.gold }} />
                  ) : (
                    <div className="w-3 h-3 rounded-full opacity-60" style={{ background: theme.gold }} />
                  )}
                </motion.div>
              )}
              {piece && (
                <span style={{ color: piece.color === 'w' ? theme.pieceLight : theme.pieceDark, filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))' }}>
                  {PIECE_SYMBOLS[piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()]}
                </span>
              )}
            </motion.button>
          );
        }))}
      </div>
      {/* File labels */}
      <div className="grid grid-cols-8 w-full" style={{ maxWidth: '384px' }}>
        {files.map(f => (
          <div key={f} className="text-center text-xs font-bold" style={{ color: theme.textSub }}>{f}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Match Info Card ──────────────────────────────────────────────────────────
function InfoCard({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
      {children}
    </div>
  );
}

// ─── Chess Arena Page ─────────────────────────────────────────────────────────
export default function ChessArenaPage() {
  const [isDark, setIsDark] = useState(true);
  const [game, setGame] = useState(() => new Chess());
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [status, setStatus] = useState('White to move');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [promotionPending, setPromotionPending] = useState<{ from: Square; to: Square } | null>(null);
  const [tab, setTab] = useState<'board'|'rules'|'about'>('board');

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  // Persist theme preference
  useEffect(() => {
    const saved = localStorage.getItem('chess-theme');
    if (saved === 'light') setIsDark(false);
  }, []);
  useEffect(() => { localStorage.setItem('chess-theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const updateStatus = useCallback((g: Chess) => {
    if (g.isCheckmate()) setStatus(`Checkmate! ${g.turn() === 'w' ? 'Black' : 'White'} wins 🏆`);
    else if (g.isDraw()) setStatus('Draw!');
    else if (g.isCheck()) setStatus(`${g.turn() === 'w' ? 'White' : 'Black'} is in check!`);
    else setStatus(`${g.turn() === 'w' ? 'White' : 'Black'} to move`);
  }, []);

  const handleSquareClick = useCallback((sq: Square) => {
    if (game.isGameOver()) return;
    const piece = game.get(sq);

    // If a square is already selected
    if (selected) {
      if (legalMoves.includes(sq)) {
        // Check pawn promotion
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
        setSelected(null); setLegalMoves([]);
      } else if (piece && piece.color === game.turn()) {
        setSelected(sq);
        setLegalMoves(game.moves({ square: sq, verbose: true }).map(m => m.to));
      } else {
        setSelected(null); setLegalMoves([]);
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
    setPromotionPending(null); setSelected(null); setLegalMoves([]);
  };

  const resetGame = () => {
    setGame(new Chess()); setSelected(null); setLegalMoves([]);
    setLastMove(null); setMoveHistory([]); setStatus('White to move'); setPromotionPending(null);
  };

  return (
    <main className="min-h-screen transition-colors duration-300" style={{ background: theme.bg, color: theme.text }}>
      {/* Top nav */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 backdrop-blur-sm"
        style={{ background: `${theme.bg}ee`, borderBottom: `1px solid ${theme.border}` }}>
        <Link href="/" className="text-sm font-bold transition-colors hover:opacity-70" style={{ color: theme.gold }}>
          ← HOME
        </Link>
        <div className="text-center">
          <p className="font-black text-base uppercase tracking-widest" style={{ fontFamily: "'Anton', sans-serif", color: theme.gold }}>
            ♟️ CHESS ARENA
          </p>
          <p className="text-xs" style={{ color: theme.textSub }}>VIYUGAM 2K26</p>
        </div>
        {/* Theme toggle */}
        <motion.button
          onClick={() => setIsDark(d => !d)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm transition-all"
          style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
          whileTap={{ scale: 0.95 }}
          id="theme-toggle-btn"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <motion.span animate={{ rotate: isDark ? 0 : 180 }} transition={{ duration: 0.4 }}>
            {isDark ? '🌙' : '☀️'}
          </motion.span>
          {isDark ? 'Dark' : 'Light'}
        </motion.button>
      </nav>

      {/* Hero */}
      <div className="px-4 py-8 flex flex-col items-center gap-4 text-center"
        style={{ background: `linear-gradient(180deg, ${theme.surface} 0%, transparent 100%)`, borderBottom: `1px solid ${theme.border}` }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <span className="text-8xl sm:text-9xl select-none" style={{ filter: `drop-shadow(0 0 20px ${theme.gold}88)` }}>♛</span>
        </motion.div>
        <motion.h1
          className="font-black uppercase leading-none"
          style={{ fontFamily: "'Anton', 'Impact', sans-serif", fontSize: 'clamp(3rem,10vw,5rem)', color: theme.text,
            WebkitTextStroke: `3px ${theme.gold}`, paintOrder: 'stroke fill',
            textShadow: isDark ? `4px 4px 0 rgba(0,0,0,0.8)` : `2px 2px 0 rgba(0,0,0,0.15)` }}
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          CHESS ARENA
        </motion.h1>
        <p className="font-bold uppercase tracking-widest text-sm" style={{ color: theme.gold }}>
          THINK AHEAD. MAKE YOUR MOVE.
        </p>
        <p className="text-sm max-w-xs" style={{ color: theme.textSub }}>
          CSE Department · PPG Institute of Technology · VIYUGAM 2K26
        </p>
        <Link href={`/booth?event=chess-arena&theme=${isDark ? 'dark' : 'light'}`}>
          <motion.button className="btn-retro px-6 py-3 text-lg" style={{ background: theme.gold, borderColor: theme.border }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} id="chess-photo-btn">
            📸 Take Chess Selfie
          </motion.button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: theme.border }}>
        {(['board','rules','about'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all"
            style={{ color: tab === t ? theme.gold : theme.textSub, borderBottom: tab === t ? `3px solid ${theme.gold}` : '3px solid transparent' }}
            id={`tab-${t}`}>
            {t === 'board' ? '🎮 Play' : t === 'rules' ? '📜 Rules' : '🏆 About'}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 gap-6 flex flex-col lg:flex-row">
        {tab === 'board' && (
          <>
            {/* Board */}
            <div className="flex flex-col items-center gap-4 flex-1">
              {/* Status */}
              <motion.div className="w-full max-w-sm rounded-lg px-4 py-2 text-center font-bold"
                style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.gold }}
                animate={{ scale: status.includes('Checkmate') || status.includes('Draw') ? [1,1.05,1] : 1 }}>
                {status}
              </motion.div>

              {/* Promotion modal */}
              <AnimatePresence>
                {promotionPending && (
                  <motion.div className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.7)' }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="rounded-2xl p-6 flex flex-col items-center gap-4"
                      style={{ background: theme.surface, border: `3px solid ${theme.gold}` }}>
                      <p className="font-black text-lg" style={{ fontFamily: "'Anton',sans-serif", color: theme.gold }}>
                        PROMOTE PAWN
                      </p>
                      <div className="flex gap-3">
                        {(['q','r','b','n'] as const).map(p => (
                          <motion.button key={p} onClick={() => handlePromotion(p)}
                            className="w-14 h-14 rounded-xl text-3xl flex items-center justify-center font-bold"
                            style={{ background: theme.bg, border: `2px solid ${theme.gold}`, color: theme.pieceLight }}
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            {PIECE_SYMBOLS[game.turn() === 'w' ? p.toUpperCase() : p]}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <ChessBoard theme={theme} game={game} selected={selected} legalMoves={legalMoves}
                onSquareClick={handleSquareClick} lastMove={lastMove} />

              {/* Controls */}
              <div className="flex gap-3 flex-wrap justify-center">
                <motion.button onClick={resetGame} whileTap={{ scale: 0.97 }}
                  className="btn-retro-outline text-sm px-4 py-2" id="reset-game-btn"
                  style={{ borderColor: theme.gold, color: theme.gold }}>
                  🔄 New Game
                </motion.button>
                <motion.button onClick={() => { const g = new Chess(game.fen()); if(g.undo() !== null) { const prev = new Chess(g.fen()); setGame(prev); setMoveHistory(h=>h.slice(0,-1)); updateStatus(prev); setSelected(null); setLegalMoves([]); } }}
                  whileTap={{ scale: 0.97 }} className="btn-retro-outline text-sm px-4 py-2" id="undo-btn"
                  style={{ borderColor: theme.border, color: theme.textSub }}>
                  ↩ Undo
                </motion.button>
              </div>
            </div>

            {/* Side panel */}
            <div className="flex flex-col gap-4 w-full lg:w-72">
              {/* Players */}
              <InfoCard theme={theme}>
                <h3 className="font-black text-sm uppercase tracking-widest mb-3" style={{ color: theme.gold }}>PLAYERS</h3>
                {[['White','♔ Player 1'],['Black','♚ Player 2']].map(([color, label]) => (
                  <div key={color} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: theme.border }}>
                    <span className="text-2xl">{color === 'White' ? '♔' : '♚'}</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: theme.text }}>{label}</p>
                      <p className="text-xs" style={{ color: theme.textSub }}>{color} pieces</p>
                    </div>
                    {game.turn() === (color === 'White' ? 'w' : 'b') && !game.isGameOver() && (
                      <motion.div className="ml-auto w-2.5 h-2.5 rounded-full" style={{ background: theme.gold }}
                        animate={{ opacity: [1,0.3,1] }} transition={{ repeat: Infinity, duration: 1 }} />
                    )}
                  </div>
                ))}
              </InfoCard>

              {/* Move history */}
              <InfoCard theme={theme}>
                <h3 className="font-black text-sm uppercase tracking-widest mb-3" style={{ color: theme.gold }}>MOVE HISTORY</h3>
                <div className="max-h-48 overflow-y-auto grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-sm">
                  {moveHistory.length === 0
                    ? <p className="col-span-2 text-xs" style={{ color: theme.textSub }}>No moves yet. Click a piece to start.</p>
                    : moveHistory.map((m, i) => (
                      <span key={i} style={{ color: i % 2 === 0 ? theme.text : theme.textSub }}>
                        {i % 2 === 0 && <span className="text-xs mr-1" style={{ color: theme.textSub }}>{Math.floor(i/2)+1}.</span>}
                        {m}
                      </span>
                    ))}
                </div>
              </InfoCard>

              {/* Game stats */}
              <InfoCard theme={theme}>
                <h3 className="font-black text-sm uppercase tracking-widest mb-3" style={{ color: theme.gold }}>GAME INFO</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {[['Moves', moveHistory.length], ['Turn', game.turn() === 'w' ? 'White' : 'Black'], ['In Check', game.isCheck() ? 'Yes' : 'No']].map(([k,v]) => (
                    <div key={String(k)} className="flex justify-between">
                      <span style={{ color: theme.textSub }}>{k}</span>
                      <span className="font-bold" style={{ color: theme.text }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </InfoCard>
            </div>
          </>
        )}

        {tab === 'rules' && (
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
            {[
              { title: 'Objective', content: 'Checkmate the opponent\'s king — put it in a position where it cannot escape capture.' },
              { title: 'Pieces & Movement', content: '♔ King: one square any direction\n♕ Queen: any direction, any distance\n♖ Rook: horizontal/vertical\n♗ Bishop: diagonals\n♘ Knight: L-shape (can jump)\n♙ Pawn: forward one square (two from start); capture diagonally' },
              { title: 'Special Moves', content: 'Castling: King moves two squares toward rook.\nEn Passant: Pawn captures passing opponent pawn.\nPromotion: Pawn reaching the last rank promotes to any piece.' },
              { title: 'End of Game', content: 'Checkmate: King is in check with no legal moves — opponent wins.\nStalemate: No legal moves but not in check — draw.\nDraw: By repetition, 50-move rule, or agreement.' },
              { title: 'VIYUGAM 2K26 Rules', content: 'Standard FIDE rules apply. Time controls set by the organizer. No phone use during matches. Report illegal move attempts to the arbiter.' },
            ].map(({ title, content }) => (
              <InfoCard key={title} theme={theme}>
                <h3 className="font-black text-sm uppercase tracking-widest mb-2" style={{ color: theme.gold }}>{title}</h3>
                <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: theme.textSub }}>{content}</p>
              </InfoCard>
            ))}
          </div>
        )}

        {tab === 'about' && (
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
            <InfoCard theme={theme}>
              <div className="flex flex-col items-center gap-4 text-center py-4">
                <span className="text-6xl">♛</span>
                <h2 className="font-black text-2xl" style={{ fontFamily: "'Anton',sans-serif", color: theme.gold }}>CHESS ARENA</h2>
                <p className="text-sm leading-relaxed" style={{ color: theme.textSub }}>
                  A strategic minds tournament at VIYUGAM 2K26, organized by the CSE Department, PPG Institute of Technology.
                  Compete with the best, make bold moves, and prove your strategic superiority.
                </p>
                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                  {[['Event','VIYUGAM 2K26'],['Department','CSE Dept'],['Institute','PPG Institute of Technology'],['Format','Swiss System']].map(([k,v]) => (
                    <div key={k} className="rounded-lg p-3 text-center" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
                      <p className="text-xs mb-1" style={{ color: theme.textSub }}>{k}</p>
                      <p className="font-bold text-sm" style={{ color: theme.text }}>{v}</p>
                    </div>
                  ))}
                </div>
                <Link href="/booth?event=chess-arena">
                  <motion.button className="btn-retro px-8 py-3 mt-2" style={{ background: theme.gold }} whileTap={{ scale: 0.97 }}>
                    📸 Get Your Chess Selfie
                  </motion.button>
                </Link>
              </div>
            </InfoCard>
          </div>
        )}
      </div>

      {/* Subtle chessboard bg pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5" style={{ zIndex: 0 }}>
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-conic-gradient(${theme.gold} 0% 25%, transparent 0% 50%)`,
          backgroundSize: '80px 80px',
        }} />
      </div>
    </main>
  );
}
