'use client';
import { EventConfig, FrameTheme, getEventThemeColors, ThemeColors } from './events';

// ─── Shared Canvas Drawing Utilities ──────────────────────────────────────────

function coverFit(iw: number, ih: number, bw: number, bh: number) {
  const ir = iw / ih, br = bw / bh;
  let sw: number, sh: number, sx: number, sy: number;
  if (ir > br) {
    sh = ih;
    sw = ih * br;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    sw = iw;
    sh = iw / br;
    sx = 0;
    sy = (ih - sh) / 2;
  }
  return { sx, sy, sw, sh };
}

function textLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  color: string,
  align: CanvasTextAlign = 'center',
  strokeColor?: string,
  strokeWidth = 6
) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function pillBadge(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  bgColor: string,
  textColor: string,
  borderColor?: string
) {
  ctx.save();
  ctx.font = "bold 15px 'Rajdhani', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const tw = ctx.measureText(text).width;
  const pw = tw + 28;
  const ph = 30;

  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(x - pw / 2, y - ph / 2, pw, ph, 15);
  ctx.fill();

  if (borderColor) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.fillStyle = textColor;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawHalftoneRow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  spacing: number,
  color: string,
  alpha = 0.08
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  const count = Math.floor(w / spacing);
  for (let c = 0; c < count; c++) {
    ctx.beginPath();
    ctx.arc(x + c * spacing, y, spacing * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPhotoSlot(
  ctx: CanvasRenderingContext2D,
  photo: HTMLCanvasElement,
  x: number,
  y: number,
  w: number,
  h: number,
  borderColor: string,
  cornerColor: string,
  isLight = false
) {
  ctx.save();

  // Shadow / back glow
  ctx.shadowColor = isLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,101,0,0.35)';
  ctx.shadowBlur = isLight ? 12 : 26;

  // Outer border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 8;
  ctx.strokeRect(x - 4, y - 4, w + 8, h + 8);
  ctx.shadowColor = 'transparent';

  // Inner border
  ctx.strokeStyle = isLight ? '#0A0A0A' : 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 8, y - 8, w + 16, h + 16);

  // Retro photo corner mount brackets
  const cs = 36;
  const corners: [number, number, number, number][] = [
    [x - 2, y - 2, 1, 1],
    [x + w + 2, y - 2, -1, 1],
    [x - 2, y + h + 2, 1, -1],
    [x + w + 2, y + h + 2, -1, -1],
  ];

  ctx.strokeStyle = cornerColor;
  ctx.lineWidth = 10;
  ctx.lineCap = 'square';
  corners.forEach(([cx, cy, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy + sy * cs);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + sx * cs, cy);
    ctx.stroke();
  });

  // Clip and draw photo with cover-fit
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const { sx, sy, sw, sh } = coverFit(photo.width, photo.height, w, h);
  ctx.drawImage(photo, sx, sy, sw, sh, x, y, w, h);

  ctx.restore();
}

function renderCommonFooter(
  ctx: CanvasRenderingContext2D,
  cfg: EventConfig,
  pal: ThemeColors,
  isLight: boolean
) {
  const W = 1080;
  const py = cfg.photoPlacement.y + cfg.photoPlacement.h; // 1010

  // 1. Tagline / Punchline
  textLine(
    ctx,
    cfg.footerText,
    W / 2,
    py + 44,
    "bold 32px 'Rajdhani', sans-serif",
    pal.primaryColor,
    'center'
  );

  // 2. Main Event Title (Bottom)
  textLine(
    ctx,
    cfg.title,
    W / 2,
    py + 104,
    "bold 58px 'Bebas Neue', Impact, sans-serif",
    isLight ? pal.textColor : '#FFFFFF',
    'center',
    pal.primaryColor,
    isLight ? 4 : 5
  );

  // 3. Institution Footer
  textLine(
    ctx,
    `${cfg.eventYear} · ${cfg.institutionName}`,
    W / 2,
    py + 162,
    "bold 22px 'Rajdhani', sans-serif",
    pal.subTextColor,
    'center'
  );

  // 4. Secondary Footer
  textLine(
    ctx,
    cfg.secondaryFooter,
    W / 2,
    py + 200,
    "500 18px 'Inter', sans-serif",
    isLight ? '#71717A' : 'rgba(255,255,255,0.7)',
    'center'
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FRAME 1: VIBE CODING (CRT Terminal, Code Brackets, Floppy Disk, Tech Matrix)
// ═════════════════════════════════════════════════════════════════════════════

function drawVibeCRT(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Monitor outer body
  ctx.fillStyle = pal.primaryColor;
  ctx.strokeStyle = pal.accentColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-size * 0.5, -size * 0.45, size, size * 0.75, 10);
  ctx.fill();
  ctx.stroke();

  // Screen bezel
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(-size * 0.4, -size * 0.38, size * 0.8, size * 0.58, 6);
  ctx.fill();

  // Screen content: >_ prompt
  ctx.fillStyle = pal.primaryColor;
  ctx.font = `bold ${Math.round(size * 0.28)}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('>_', -size * 0.3, -size * 0.1);

  // Power LED
  ctx.fillStyle = '#22C55E';
  ctx.beginPath();
  ctx.arc(size * 0.3, size * 0.22, size * 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Stand
  ctx.fillStyle = pal.secondaryColor;
  ctx.beginPath();
  ctx.moveTo(-size * 0.15, size * 0.3);
  ctx.lineTo(size * 0.15, size * 0.3);
  ctx.lineTo(size * 0.25, size * 0.48);
  ctx.lineTo(-size * 0.25, size * 0.48);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawVibeCodeBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Octagon Badge
  const r = size * 0.45;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + Math.PI / 8;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = pal.secondaryColor;
  ctx.fill();
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Inner code brackets < / >
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `900 ${Math.round(size * 0.36)}px 'Bebas Neue', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('</>', 0, 0);

  ctx.restore();
}

function drawVibeFloppy(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Floppy body
  ctx.fillStyle = pal.primaryColor;
  ctx.strokeStyle = pal.accentColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(-size * 0.5, -size * 0.5, size, size, 5);
  ctx.fill();
  ctx.stroke();

  // Slanted top-right corner notch
  ctx.fillStyle = pal.bgColor;
  ctx.beginPath();
  ctx.moveTo(size * 0.35, -size * 0.5);
  ctx.lineTo(size * 0.5, -size * 0.35);
  ctx.lineTo(size * 0.5, -size * 0.5);
  ctx.closePath();
  ctx.fill();

  // Metal shutter
  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(-size * 0.3, -size * 0.48, size * 0.6, size * 0.35);
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(-size * 0.12, -size * 0.42, size * 0.24, size * 0.2);

  // Label area
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-size * 0.38, size * 0.05, size * 0.76, size * 0.4);
  ctx.fillStyle = '#0F172A';
  ctx.font = `bold ${Math.round(size * 0.15)}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VIBE.SH', 0, size * 0.25);

  ctx.restore();
}

function renderVibeCoding(
  ctx: CanvasRenderingContext2D,
  photo: HTMLCanvasElement,
  cfg: EventConfig,
  pal: ThemeColors,
  isLight: boolean
) {
  const W = 1080, H = 1350;

  // Background
  ctx.fillStyle = pal.bgColor;
  ctx.fillRect(0, 0, W, H);

  // Halftone rows
  for (let r = 0; r < 16; r++) {
    drawHalftoneRow(ctx, 20, 60 + r * 78, W - 40, 26, pal.primaryColor, isLight ? 0.05 : 0.08);
  }

  // Top Badge
  pillBadge(
    ctx,
    `✦ ${cfg.eventYear} · DIGITAL SELFIE BOOTH ✦`,
    W / 2,
    70,
    isLight ? '#F4F4F5' : 'rgba(255,101,0,0.15)',
    pal.primaryColor,
    pal.primaryColor
  );

  // Top Left Logo: Retro CRT Monitor
  drawVibeCRT(ctx, 140, 160, 95, pal);
  pillBadge(ctx, 'DEV://VIBE', 140, 222, pal.badgeBg, pal.badgeText);

  // Top Right Logo: Code Octagon Badge
  drawVibeCodeBadge(ctx, 940, 160, 95, pal);
  pillBadge(ctx, '</CODE>', 940, 222, pal.badgeBg, pal.badgeText);

  // Center Headline
  textLine(
    ctx,
    cfg.title,
    W / 2,
    168,
    "bold 125px 'Bebas Neue', Impact, sans-serif",
    isLight ? pal.textColor : '#FFFFFF',
    'center',
    pal.primaryColor,
    isLight ? 5 : 8
  );

  // Subtitle
  textLine(
    ctx,
    cfg.subtitle,
    W / 2,
    244,
    "bold 32px 'Rajdhani', sans-serif",
    pal.secondaryColor,
    'center'
  );

  // Side decorative code brackets on margins
  ctx.save();
  ctx.font = "bold 32px monospace";
  ctx.fillStyle = pal.primaryColor;
  ctx.textAlign = 'center';
  ctx.fillText('{', 45, 480);
  ctx.fillText(';', 45, 620);
  ctx.fillText('}', 45, 760);

  ctx.fillText('{', W - 45, 480);
  ctx.fillText(';', W - 45, 620);
  ctx.fillText('}', W - 45, 760);
  ctx.restore();

  // Photo
  const { x: px, y: py, w: pw, h: ph } = cfg.photoPlacement;
  drawPhotoSlot(ctx, photo, px, py, pw, ph, pal.borderColor, pal.secondaryColor, isLight);

  // Bottom Center Logo: Retro Floppy Disk
  drawVibeFloppy(ctx, W / 2, 1285, 70, pal);

  // Bottom Left & Right badges
  pillBadge(ctx, '{2K26}', 140, 1285, isLight ? '#F4F4F5' : 'rgba(255,101,0,0.15)', pal.primaryColor);
  pillBadge(ctx, '[RUN]', W - 140, 1285, isLight ? '#F4F4F5' : 'rgba(255,101,0,0.15)', pal.primaryColor);

  // Footer text
  renderCommonFooter(ctx, cfg, pal, isLight);
}

// ═════════════════════════════════════════════════════════════════════════════
// FRAME 2: PROMPT WAR (AI Brain Spark, Crossed Lightning, Comic Action Star)
// ═════════════════════════════════════════════════════════════════════════════

function drawPromptBrainSpark(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Electric energy aura ring
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.44, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Brain hemisphere curves
  ctx.fillStyle = pal.secondaryColor;
  ctx.beginPath();
  ctx.arc(-size * 0.12, -size * 0.08, size * 0.22, 0, Math.PI * 2);
  ctx.arc(size * 0.12, -size * 0.08, size * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Neural nodes & connectors
  const nodes = [
    [-size * 0.2, -size * 0.15],
    [size * 0.2, -size * 0.15],
    [-size * 0.25, size * 0.05],
    [size * 0.25, size * 0.05],
    [0, -size * 0.25],
    [0, size * 0.15],
  ];

  ctx.strokeStyle = pal.accentColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  nodes.forEach(([x, y], i) => {
    if (i > 0) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = pal.primaryColor;
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawPromptCrossedLightning(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  const drawBolt = (rot: number, color: string) => {
    ctx.save();
    ctx.rotate(rot);
    ctx.fillStyle = color;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.45);
    ctx.lineTo(size * 0.16, -size * 0.05);
    ctx.lineTo(size * 0.04, -size * 0.05);
    ctx.lineTo(size * 0.18, size * 0.45);
    ctx.lineTo(-size * 0.12, 0.05);
    ctx.lineTo(0, 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  drawBolt(-0.55, pal.primaryColor);
  drawBolt(0.55, pal.secondaryColor);

  // Central energy spark
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawPromptActionBlast(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // 14-point comic blast
  const pts = 14;
  ctx.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const a = (i * Math.PI) / pts - Math.PI / 2;
    const r = i % 2 === 0 ? size * 0.52 : size * 0.28;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = pal.primaryColor;
  ctx.fill();
  ctx.strokeStyle = pal.secondaryColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Central Text
  ctx.fillStyle = '#000000';
  ctx.font = `bold ${Math.round(size * 0.2)}px 'Bebas Neue', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PROMPT', 0, -size * 0.08);
  ctx.fillText('MASTER', 0, size * 0.1);

  ctx.restore();
}

function renderPromptWar(
  ctx: CanvasRenderingContext2D,
  photo: HTMLCanvasElement,
  cfg: EventConfig,
  pal: ThemeColors,
  isLight: boolean
) {
  const W = 1080, H = 1350;

  // Background
  ctx.fillStyle = pal.bgColor;
  ctx.fillRect(0, 0, W, H);

  // Comic rays from top center
  ctx.save();
  ctx.fillStyle = isLight ? 'rgba(255,84,0,0.04)' : 'rgba(255,84,0,0.08)';
  for (let i = 0; i < 24; i += 2) {
    const a1 = (i * Math.PI) / 12;
    const a2 = ((i + 1) * Math.PI) / 12;
    ctx.beginPath();
    ctx.moveTo(W / 2, 175);
    ctx.lineTo(W / 2 + Math.cos(a1) * 600, 175 + Math.sin(a1) * 600);
    ctx.lineTo(W / 2 + Math.cos(a2) * 600, 175 + Math.sin(a2) * 600);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Top Pill Badge
  pillBadge(
    ctx,
    `⚡ ${cfg.eventYear} · AI PROMPT BATTLE ⚡`,
    W / 2,
    70,
    isLight ? '#F4F4F5' : 'rgba(255,84,0,0.18)',
    pal.primaryColor,
    pal.primaryColor
  );

  // Top Left Logo: AI Brain Spark
  drawPromptBrainSpark(ctx, 140, 160, 95, pal);
  pillBadge(ctx, 'AI://CORE', 140, 222, pal.badgeBg, pal.badgeText);

  // Top Right Logo: Crossed Lightning
  drawPromptCrossedLightning(ctx, 940, 160, 95, pal);
  pillBadge(ctx, 'WAR://ZONE', 940, 222, pal.badgeBg, pal.badgeText);

  // Headline
  textLine(
    ctx,
    cfg.title,
    W / 2,
    168,
    "bold 125px 'Bebas Neue', Impact, sans-serif",
    isLight ? pal.textColor : '#FFFFFF',
    'center',
    pal.primaryColor,
    isLight ? 5 : 8
  );

  // Tagline
  textLine(
    ctx,
    cfg.tagline,
    W / 2,
    244,
    "bold 32px 'Rajdhani', sans-serif",
    pal.secondaryColor,
    'center'
  );

  // Margin badges
  pillBadge(ctx, 'POW!', 45, 520, pal.primaryColor, '#000000');
  pillBadge(ctx, 'GEN>', 45, 700, pal.secondaryColor, '#000000');

  pillBadge(ctx, 'ZAP!', W - 45, 520, pal.primaryColor, '#000000');
  pillBadge(ctx, '100%', W - 45, 700, pal.secondaryColor, '#000000');

  // Photo
  const { x: px, y: py, w: pw, h: ph } = cfg.photoPlacement;
  drawPhotoSlot(ctx, photo, px, py, pw, ph, pal.borderColor, pal.primaryColor, isLight);

  // Bottom Center: Comic Action Blast
  drawPromptActionBlast(ctx, W / 2, 1285, 74, pal);

  // Bottom Left & Right badges
  pillBadge(ctx, '⚡ GPT-4', 140, 1285, isLight ? '#F4F4F5' : 'rgba(255,84,0,0.15)', pal.primaryColor);
  pillBadge(ctx, 'WINNER ⚡', W - 140, 1285, isLight ? '#F4F4F5' : 'rgba(255,84,0,0.15)', pal.primaryColor);

  renderCommonFooter(ctx, cfg, pal, isLight);
}

// ═════════════════════════════════════════════════════════════════════════════
// FRAME 3: OUTPUT HUNT (Bug Radar, Hex Decoder, Terminal Window Seal)
// ═════════════════════════════════════════════════════════════════════════════

function drawOutputRadarScope(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Outer bezel
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.44, 0, Math.PI * 2);
  ctx.stroke();

  // Radar target rings
  ctx.strokeStyle = 'rgba(255,101,0,0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
  ctx.arc(0, 0, size * 0.14, 0, Math.PI * 2);
  ctx.stroke();

  // Crosshairs
  ctx.beginPath();
  ctx.moveTo(-size * 0.44, 0); ctx.lineTo(size * 0.44, 0);
  ctx.moveTo(0, -size * 0.44); ctx.lineTo(0, size * 0.44);
  ctx.stroke();

  // Detected pixel bug target
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(size * 0.16, -size * 0.16, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(size * 0.16, -size * 0.16, 12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawOutputHexMagnifier(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Lens frame
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(-size * 0.08, -size * 0.08, size * 0.32, 0, Math.PI * 2);
  ctx.stroke();

  // Handle
  ctx.strokeStyle = pal.secondaryColor;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(size * 0.15, size * 0.15);
  ctx.lineTo(size * 0.38, size * 0.38);
  ctx.stroke();

  // Inside lens: 0x42
  ctx.fillStyle = pal.primaryColor;
  ctx.font = `bold ${Math.round(size * 0.18)}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('0x42', -size * 0.08, -size * 0.08);

  ctx.restore();
}

function drawOutputTerminalSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Terminal box
  ctx.fillStyle = '#141414';
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(-size * 0.6, -size * 0.35, size * 1.2, size * 0.7, 8);
  ctx.fill();
  ctx.stroke();

  // Title dots (Red, Yellow, Green)
  ['#EF4444', '#F59E0B', '#22C55E'].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(-size * 0.45 + i * 14, -size * 0.2, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Prompt text
  ctx.fillStyle = pal.primaryColor;
  ctx.font = `bold ${Math.round(size * 0.18)}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('> 0 ERRORS', -size * 0.45, size * 0.08);

  ctx.restore();
}

function renderOutputHunt(
  ctx: CanvasRenderingContext2D,
  photo: HTMLCanvasElement,
  cfg: EventConfig,
  pal: ThemeColors,
  isLight: boolean
) {
  const W = 1080, H = 1350;

  ctx.fillStyle = pal.bgColor;
  ctx.fillRect(0, 0, W, H);

  // Terminal grid lines
  ctx.save();
  ctx.strokeStyle = isLight ? 'rgba(255,101,0,0.06)' : 'rgba(255,101,0,0.08)';
  ctx.lineWidth = 1;
  for (let y = 0; y < H; y += 30) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  for (let x = 0; x < W; x += 30) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  ctx.restore();

  // Top Pill Badge
  pillBadge(
    ctx,
    `🔍 ${cfg.eventYear} · DEBUG_CHALLENGE 🔍`,
    W / 2,
    70,
    isLight ? '#F4F4F5' : 'rgba(255,101,0,0.15)',
    pal.primaryColor,
    pal.primaryColor
  );

  // Top Left Logo: Radar Target
  drawOutputRadarScope(ctx, 140, 160, 95, pal);
  pillBadge(ctx, 'BUG://TRACE', 140, 222, pal.badgeBg, pal.badgeText);

  // Top Right Logo: Hex Magnifier
  drawOutputHexMagnifier(ctx, 940, 160, 95, pal);
  pillBadge(ctx, 'OUTPUT://OK', 940, 222, pal.badgeBg, pal.badgeText);

  // Headline
  textLine(
    ctx,
    cfg.title,
    W / 2,
    168,
    "bold 125px 'Bebas Neue', Impact, sans-serif",
    isLight ? pal.textColor : '#FFFFFF',
    'center',
    pal.primaryColor,
    isLight ? 5 : 8
  );

  // Subtitle
  textLine(
    ctx,
    cfg.subtitle,
    W / 2,
    244,
    "bold 30px 'Rajdhani', monospace, sans-serif",
    pal.secondaryColor,
    'center'
  );

  // Margin debug addresses
  ctx.save();
  ctx.font = "bold 13px monospace";
  ctx.fillStyle = pal.primaryColor;
  ctx.textAlign = 'center';
  ctx.fillText('>IN', 45, 520);
  ctx.fillText('>RUN', 45, 620);
  ctx.fillText('>OK', 45, 720);

  ctx.fillText('0x00<', W - 45, 520);
  ctx.fillText('0x2A<', W - 45, 620);
  ctx.fillText('0xFF<', W - 45, 720);
  ctx.restore();

  // Photo
  const { x: px, y: py, w: pw, h: ph } = cfg.photoPlacement;
  drawPhotoSlot(ctx, photo, px, py, pw, ph, pal.borderColor, pal.secondaryColor, isLight);

  // Bottom Center: Terminal Prompt Seal
  drawOutputTerminalSeal(ctx, W / 2, 1285, 72, pal);

  // Bottom Left & Right badges
  pillBadge(ctx, '[PASS]', 140, 1285, isLight ? '#F4F4F5' : 'rgba(255,101,0,0.15)', pal.primaryColor);
  pillBadge(ctx, '100% OK', W - 140, 1285, isLight ? '#F4F4F5' : 'rgba(255,101,0,0.15)', pal.primaryColor);

  renderCommonFooter(ctx, cfg, pal, isLight);
}

// ═════════════════════════════════════════════════════════════════════════════
// FRAME 4: MOVIE MANIA (Cinema 35mm Reel, Clapperboard, Admit One Ticket)
// ═════════════════════════════════════════════════════════════════════════════

function drawMovieCinemaReel(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Film reel outer rim
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.44, 0, Math.PI * 2);
  ctx.stroke();

  // Inner hub
  ctx.fillStyle = pal.secondaryColor;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Spool cutouts (5 circles)
  ctx.fillStyle = pal.bgColor;
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5;
    const px = Math.cos(a) * size * 0.28;
    const py = Math.sin(a) * size * 0.28;
    ctx.beginPath();
    ctx.arc(px, py, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = pal.primaryColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.restore();
}

function drawMovieClapperboard(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Board base
  ctx.fillStyle = '#1C1917';
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(-size * 0.45, -size * 0.1, size * 0.9, size * 0.55, 4);
  ctx.fill();
  ctx.stroke();

  // Angled top slate
  ctx.save();
  ctx.rotate(-0.15);
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.roundRect(-size * 0.48, -size * 0.38, size * 0.96, size * 0.24, 3);
  ctx.fill();

  // Chevron black & white stripes on slate
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = pal.primaryColor;
      ctx.beginPath();
      ctx.moveTo(-size * 0.45 + i * 16, -size * 0.38);
      ctx.lineTo(-size * 0.35 + i * 16, -size * 0.38);
      ctx.lineTo(-size * 0.45 + i * 16, -size * 0.14);
      ctx.lineTo(-size * 0.55 + i * 16, -size * 0.14);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();

  // Scene / Take text
  ctx.fillStyle = pal.primaryColor;
  ctx.font = `bold ${Math.round(size * 0.16)}px 'Bebas Neue', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SCENE 01 · TAKE 01', 0, size * 0.18);

  ctx.restore();
}

function drawMovieTicket(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  const w = size * 1.5;
  const h = size * 0.65;

  // Ticket background
  ctx.fillStyle = pal.primaryColor;
  ctx.strokeStyle = pal.accentColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 6);
  ctx.fill();
  ctx.stroke();

  // Left & right punch notches
  ctx.fillStyle = pal.bgColor;
  ctx.beginPath();
  ctx.arc(-w / 2, 0, 10, 0, Math.PI * 2);
  ctx.arc(w / 2, 0, 10, 0, Math.PI * 2);
  ctx.fill();

  // Ticket text
  ctx.fillStyle = '#000000';
  ctx.font = `900 ${Math.round(size * 0.2)}px 'Bebas Neue', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★ ADMIT ONE · VIP ★', 0, 0);

  ctx.restore();
}

function renderMovieMania(
  ctx: CanvasRenderingContext2D,
  photo: HTMLCanvasElement,
  cfg: EventConfig,
  pal: ThemeColors,
  isLight: boolean
) {
  const W = 1080, H = 1350;

  ctx.fillStyle = pal.bgColor;
  ctx.fillRect(0, 0, W, H);

  // Marquee bulb header border (Y: 282, safely above photo at Y: 330)
  ctx.fillStyle = isLight ? '#F4F4F5' : '#1C1917';
  ctx.fillRect(0, 275, W, 18);
  for (let i = 0; i < 24; i++) {
    ctx.fillStyle = i % 2 === 0 ? pal.primaryColor : pal.secondaryColor;
    ctx.beginPath();
    ctx.arc(25 + i * (W - 50) / 23, 284, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Top Pill Badge
  pillBadge(
    ctx,
    `🎬 ${cfg.eventYear} · HOLLYWOOD PREMIERE 🎬`,
    W / 2,
    70,
    isLight ? '#F4F4F5' : 'rgba(255,122,26,0.18)',
    pal.primaryColor,
    pal.primaryColor
  );

  // Top Left Logo: Cinema Film Reel
  drawMovieCinemaReel(ctx, 140, 160, 95, pal);
  pillBadge(ctx, '35MM//REEL', 140, 222, pal.badgeBg, pal.badgeText);

  // Top Right Logo: Clapperboard
  drawMovieClapperboard(ctx, 940, 160, 95, pal);
  pillBadge(ctx, 'ACTION!', 940, 222, pal.badgeBg, pal.badgeText);

  // Headline
  textLine(
    ctx,
    cfg.title,
    W / 2,
    168,
    "bold 125px 'Bebas Neue', Impact, sans-serif",
    isLight ? pal.textColor : '#FFFFFF',
    'center',
    pal.primaryColor,
    isLight ? 5 : 8
  );

  // Subtitle
  textLine(
    ctx,
    cfg.subtitle,
    W / 2,
    244,
    "bold 32px 'Rajdhani', sans-serif",
    pal.secondaryColor,
    'center'
  );

  // Margin star badges
  pillBadge(ctx, '★ VIP', 45, 520, pal.primaryColor, '#000000');
  pillBadge(ctx, 'CAST', 45, 700, pal.secondaryColor, '#000000');

  pillBadge(ctx, 'STAR ★', W - 45, 520, pal.primaryColor, '#000000');
  pillBadge(ctx, 'SCENE', W - 45, 700, pal.secondaryColor, '#000000');

  // Photo
  const { x: px, y: py, w: pw, h: ph } = cfg.photoPlacement;
  drawPhotoSlot(ctx, photo, px, py, pw, ph, pal.borderColor, pal.secondaryColor, isLight);

  // Bottom Center: Admit One Ticket
  drawMovieTicket(ctx, W / 2, 1285, 70, pal);

  // Bottom Left & Right badges
  pillBadge(ctx, '★ OSCAR', 140, 1285, isLight ? '#F4F4F5' : 'rgba(255,101,0,0.15)', pal.primaryColor);
  pillBadge(ctx, 'DIRECTOR ★', W - 140, 1285, isLight ? '#F4F4F5' : 'rgba(255,101,0,0.15)', pal.primaryColor);

  renderCommonFooter(ctx, cfg, pal, isLight);
}

// ═════════════════════════════════════════════════════════════════════════════
// FRAME 5: CHESS ARENA (Royal Crown, Knight Checkered Shield, Checkmate Seal)
// ═════════════════════════════════════════════════════════════════════════════

function drawChessCrownCrest(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Pedestal base
  ctx.fillStyle = pal.primaryColor;
  ctx.beginPath();
  ctx.roundRect(-size * 0.45, size * 0.28, size * 0.9, size * 0.14, 4);
  ctx.fill();

  // Crown arches
  ctx.fillStyle = pal.secondaryColor;
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, size * 0.28);
  ctx.lineTo(-size * 0.4, -size * 0.15);
  ctx.lineTo(-size * 0.2, size * 0.05);
  ctx.lineTo(0, -size * 0.35); // Center peak
  ctx.lineTo(size * 0.2, size * 0.05);
  ctx.lineTo(size * 0.4, -size * 0.15);
  ctx.lineTo(size * 0.4, size * 0.28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Royal cross atop center peak
  ctx.fillStyle = pal.primaryColor;
  ctx.fillRect(-size * 0.04, -size * 0.48, size * 0.08, size * 0.18);
  ctx.fillRect(-size * 0.1, -size * 0.44, size * 0.2, size * 0.07);

  // Crown jewels
  ['-0.3', '0', '0.3'].forEach((ox) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(Number(ox) * size, size * 0.18, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawChessHeraldicShield(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Shield outline
  ctx.beginPath();
  ctx.moveTo(-size * 0.4, -size * 0.45);
  ctx.lineTo(size * 0.4, -size * 0.45);
  ctx.lineTo(size * 0.4, size * 0.05);
  ctx.quadraticCurveTo(size * 0.4, size * 0.45, 0, size * 0.52);
  ctx.quadraticCurveTo(-size * 0.4, size * 0.45, -size * 0.4, size * 0.05);
  ctx.closePath();

  ctx.fillStyle = pal.secondaryColor;
  ctx.fill();
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Checkered split on shield
  ctx.save();
  ctx.clip();
  ctx.fillStyle = pal.primaryColor;
  ctx.fillRect(0, -size * 0.45, size * 0.4, size * 0.5);
  ctx.fillRect(-size * 0.4, size * 0.05, size * 0.4, size * 0.5);
  ctx.restore();

  // Knight silhouette
  ctx.fillStyle = '#000000';
  ctx.font = `${Math.round(size * 0.52)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('♞', 0, 0);

  ctx.restore();
}

function drawChessCheckmateSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pal: ThemeColors) {
  ctx.save();
  ctx.translate(cx, cy);

  // Medallion outer ring
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = pal.primaryColor;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Queen piece symbol
  ctx.fillStyle = pal.badgeText;
  ctx.font = `${Math.round(size * 0.48)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('♛', 0, -size * 0.02);

  // Banner under seal
  ctx.fillStyle = pal.badgeBg;
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-size * 0.6, size * 0.25, size * 1.2, size * 0.28, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = pal.badgeText;
  ctx.font = `bold ${Math.round(size * 0.18)}px 'Bebas Neue', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CHECKMATE', 0, size * 0.39);

  ctx.restore();
}

function renderChessArena(
  ctx: CanvasRenderingContext2D,
  photo: HTMLCanvasElement,
  cfg: EventConfig,
  pal: ThemeColors,
  isLight: boolean
) {
  const W = 1080, H = 1350;

  ctx.fillStyle = pal.bgColor;
  ctx.fillRect(0, 0, W, H);

  // Checkered outer background watermark pattern in subtle orange
  const sq = 60;
  ctx.fillStyle = isLight ? 'rgba(255,101,0,0.03)' : 'rgba(255,101,0,0.04)';
  for (let r = 0; r < Math.ceil(H / sq); r++) {
    for (let c = 0; c < Math.ceil(W / sq); c++) {
      if ((r + c) % 2 === 0) {
        ctx.fillRect(c * sq, r * sq, sq, sq);
      }
    }
  }

  // Double orange border perimeter
  ctx.strokeStyle = pal.primaryColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  ctx.strokeStyle = pal.secondaryColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  // Top Pill Badge
  pillBadge(
    ctx,
    `♟️ ${cfg.eventYear} · GRANDMASTER DUEL ♟️`,
    W / 2,
    70,
    isLight ? '#F4F4F5' : 'rgba(255,101,0,0.18)',
    pal.primaryColor,
    pal.primaryColor
  );

  // Top Left Logo: Royal Crown Crest
  drawChessCrownCrest(ctx, 140, 160, 95, pal);
  pillBadge(ctx, 'GRANDMASTER', 140, 222, pal.badgeBg, pal.badgeText);

  // Top Right Logo: Knight Checkered Shield
  drawChessHeraldicShield(ctx, 940, 160, 95, pal);
  pillBadge(ctx, '1. e4 RESIGN', 940, 222, pal.badgeBg, pal.badgeText);

  // Headline
  textLine(
    ctx,
    cfg.title,
    W / 2,
    168,
    "bold 125px 'Bebas Neue', Impact, sans-serif",
    isLight ? pal.textColor : '#FFFFFF',
    'center',
    pal.primaryColor,
    isLight ? 5 : 8
  );

  // Tagline
  textLine(
    ctx,
    cfg.tagline,
    W / 2,
    244,
    "bold 32px 'Rajdhani', sans-serif",
    pal.secondaryColor,
    'center'
  );

  // Margin chess piece coordinates
  ctx.save();
  ctx.font = "bold 16px serif";
  ctx.fillStyle = pal.primaryColor;
  ctx.textAlign = 'center';
  ctx.fillText('♜ A8', 48, 520);
  ctx.fillText('♞ B8', 48, 620);
  ctx.fillText('♝ C8', 48, 720);

  ctx.fillText('F1 ♗', W - 48, 520);
  ctx.fillText('G1 ♘', W - 48, 620);
  ctx.fillText('H1 ♖', W - 48, 720);
  ctx.restore();

  // Photo
  const { x: px, y: py, w: pw, h: ph } = cfg.photoPlacement;
  drawPhotoSlot(ctx, photo, px, py, pw, ph, pal.borderColor, pal.secondaryColor, isLight);

  // Bottom Center: Checkmate Royal Seal
  drawChessCheckmateSeal(ctx, W / 2, 1285, 68, pal);

  // Bottom Left & Right badges
  pillBadge(ctx, '🏆 1 - 0', 140, 1285, isLight ? '#F4F4F5' : 'rgba(255,101,0,0.15)', pal.primaryColor);
  pillBadge(ctx, 'VICTORY 🏆', W - 140, 1285, isLight ? '#F4F4F5' : 'rgba(255,101,0,0.15)', pal.primaryColor);

  renderCommonFooter(ctx, cfg, pal, isLight);
}

// ═════════════════════════════════════════════════════════════════════════════
// Public API
// ═════════════════════════════════════════════════════════════════════════════

export async function renderFrame(
  photoCanvas: HTMLCanvasElement,
  eventConfig: EventConfig,
  theme: FrameTheme = 'dark'
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const pal = getEventThemeColors(eventConfig, theme);
  const isLight = theme === 'light';

  switch (eventConfig.id) {
    case 'vibe-coding':
      renderVibeCoding(ctx, photoCanvas, eventConfig, pal, isLight);
      break;
    case 'prompt-war':
      renderPromptWar(ctx, photoCanvas, eventConfig, pal, isLight);
      break;
    case 'output-hunt':
      renderOutputHunt(ctx, photoCanvas, eventConfig, pal, isLight);
      break;
    case 'movie-mania':
      renderMovieMania(ctx, photoCanvas, eventConfig, pal, isLight);
      break;
    case 'chess-arena':
      renderChessArena(ctx, photoCanvas, eventConfig, pal, isLight);
      break;
    default:
      renderVibeCoding(ctx, photoCanvas, eventConfig, pal, isLight);
  }

  return canvas;
}

export function canvasToDataURL(
  canvas: HTMLCanvasElement,
  format: 'jpeg' | 'png' = 'jpeg',
  quality = 0.92
): string {
  return canvas.toDataURL(`image/${format}`, quality);
}

export const DEFAULT_FRAME_CONFIG = {
  width: 1080,
  height: 1350,
  photoX: 90,
  photoY: 330,
  photoW: 900,
  photoH: 680,
  primaryColor: '#FF6500',
  secondaryColor: '#FF8833',
  eventTitle: 'VIBE CODING',
  tagline: 'BUILD SOMETHING. CAPTURE THE MOMENT.',
  institutionName: 'CSE Department · PPG Institute of Technology, Coimbatore',
  eventDate: 'VIYUGAM 2K26',
};
