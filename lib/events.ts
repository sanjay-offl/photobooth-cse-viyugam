// ─────────────────────────────────────────────────────────────────────────────
// VIYUGAM 2K26 — Event Configuration Registry
// CSE Department · PPG Institute of Technology
// ─────────────────────────────────────────────────────────────────────────────

export type EventId = 'vibe-coding' | 'prompt-war' | 'output-hunt' | 'movie-mania' | 'chess-arena';
export type FrameTheme = 'dark' | 'light';

export interface PhotoPlacement {
  x: number; // pixels from left on 1080-wide canvas
  y: number;
  w: number;
  h: number;
}

export interface ThemeColors {
  bgColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  subTextColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

export interface EventConfig {
  id: EventId;
  title: string;
  subtitle: string;
  tagline: string;
  footerText: string;
  secondaryFooter: string;
  institutionName: string;
  eventYear: string;
  emoji: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  photoPlacement: PhotoPlacement;
  gradient: string; // CSS gradient for card backgrounds
  cardBorder: string;
  themes: {
    dark: ThemeColors;
    light: ThemeColors;
  };
}

export const INSTITUTION = 'CSE Dept · PPG Institute of Technology';
export const EVENT_YEAR = 'VIYUGAM 2K26';

// Symmetric 90px left/right margins, 330px top header, 340px bottom footer
export const STANDARD_PHOTO_PLACEMENT: PhotoPlacement = { x: 90, y: 330, w: 900, h: 680 };

export const EVENTS: Record<EventId, EventConfig> = {
  'vibe-coding': {
    id: 'vibe-coding',
    title: 'VIBE CODING',
    subtitle: 'DIGITAL SELFIE BOOTH',
    tagline: 'BUILD SOMETHING. CAPTURE THE MOMENT.',
    footerText: 'BUILD SOMETHING. CAPTURE THE MOMENT.',
    secondaryFooter: 'YOUR CODE. YOUR CREATION. YOUR MEMORY.',
    institutionName: INSTITUTION,
    eventYear: EVENT_YEAR,
    emoji: '💻',
    description: 'Code, Create & Celebrate the Developer in You',
    primaryColor: '#FFD400',
    secondaryColor: '#FF9F1C',
    accentColor: '#FFFFFF',
    bgColor: '#000000',
    textColor: '#FFFFFF',
    photoPlacement: STANDARD_PHOTO_PLACEMENT,
    gradient: 'linear-gradient(135deg, #FFD400 0%, #FF9F1C 100%)',
    cardBorder: '#FFD400',
    themes: {
      dark: {
        bgColor: '#000000',
        primaryColor: '#FFD400',
        secondaryColor: '#FF9F1C',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        subTextColor: 'rgba(245,235,221,0.75)',
        borderColor: '#FFD400',
        badgeBg: '#FFD400',
        badgeText: '#000000',
      },
      light: {
        bgColor: '#FBF7EE',
        primaryColor: '#D97706',
        secondaryColor: '#EA580C',
        accentColor: '#18181B',
        textColor: '#18181B',
        subTextColor: '#4B5563',
        borderColor: '#D97706',
        badgeBg: '#18181B',
        badgeText: '#FBF7EE',
      },
    },
  },
  'prompt-war': {
    id: 'prompt-war',
    title: 'PROMPT WAR',
    subtitle: 'AI PROMPT BATTLE',
    tagline: 'PROMPT. CREATE. COMPETE.',
    footerText: 'I WON THE PROMPT BATTLE.',
    secondaryFooter: 'ONE PROMPT. INFINITE POSSIBILITIES.',
    institutionName: INSTITUTION,
    eventYear: EVENT_YEAR,
    emoji: '⚡',
    description: 'The Ultimate AI Prompting Championship',
    primaryColor: '#FFD400',
    secondaryColor: '#FF7A00',
    accentColor: '#FFFFFF',
    bgColor: '#080808',
    textColor: '#FFFFFF',
    photoPlacement: STANDARD_PHOTO_PLACEMENT,
    gradient: 'linear-gradient(135deg, #FF7A00 0%, #FFD400 100%)',
    cardBorder: '#FF7A00',
    themes: {
      dark: {
        bgColor: '#080808',
        primaryColor: '#FFD400',
        secondaryColor: '#FF7A00',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        subTextColor: 'rgba(255,255,255,0.75)',
        borderColor: '#FF7A00',
        badgeBg: '#FF7A00',
        badgeText: '#000000',
      },
      light: {
        bgColor: '#FFF8F0',
        primaryColor: '#DC2626',
        secondaryColor: '#EA580C',
        accentColor: '#0F172A',
        textColor: '#0F172A',
        subTextColor: '#475569',
        borderColor: '#DC2626',
        badgeBg: '#0F172A',
        badgeText: '#FFF8F0',
      },
    },
  },
  'output-hunt': {
    id: 'output-hunt',
    title: 'OUTPUT HUNT',
    subtitle: '> CHALLENGE_ACCEPTED',
    tagline: 'TRACE THE CODE. FIND THE OUTPUT.',
    footerText: 'I FOUND THE OUTPUT.',
    secondaryFooter: 'DEBUG YOUR THINKING.',
    institutionName: INSTITUTION,
    eventYear: EVENT_YEAR,
    emoji: '🔍',
    description: 'Debug, Decode & Discover the Correct Output',
    primaryColor: '#FFD400',
    secondaryColor: '#A3E635',
    accentColor: '#FFFFFF',
    bgColor: '#050505',
    textColor: '#FFFFFF',
    photoPlacement: STANDARD_PHOTO_PLACEMENT,
    gradient: 'linear-gradient(135deg, #A3E635 0%, #FFD400 100%)',
    cardBorder: '#A3E635',
    themes: {
      dark: {
        bgColor: '#050505',
        primaryColor: '#FFD400',
        secondaryColor: '#A3E635',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        subTextColor: 'rgba(163,230,53,0.75)',
        borderColor: '#A3E635',
        badgeBg: '#A3E635',
        badgeText: '#050505',
      },
      light: {
        bgColor: '#F0FDF4',
        primaryColor: '#15803D',
        secondaryColor: '#854D0E',
        accentColor: '#052E16',
        textColor: '#052E16',
        subTextColor: '#374151',
        borderColor: '#15803D',
        badgeBg: '#052E16',
        badgeText: '#F0FDF4',
      },
    },
  },
  'movie-mania': {
    id: 'movie-mania',
    title: 'MOVIE MANIA',
    subtitle: 'LIGHTS. CAMERA. ACTION!',
    tagline: 'THE STAR OF YOUR OWN SCENE.',
    footerText: 'THE STAR OF YOUR OWN SCENE.',
    secondaryFooter: 'LIGHTS. CAMERA. ACTION!',
    institutionName: INSTITUTION,
    eventYear: EVENT_YEAR,
    emoji: '🎬',
    description: 'Cinema Trivia, Iconic Scenes & Movie Magic',
    primaryColor: '#FFD400',
    secondaryColor: '#FF9F1C',
    accentColor: '#FFF1D6',
    bgColor: '#080808',
    textColor: '#FFFFFF',
    photoPlacement: STANDARD_PHOTO_PLACEMENT,
    gradient: 'linear-gradient(135deg, #FF9F1C 0%, #FFD400 80%, #FFF1D6 100%)',
    cardBorder: '#FFD400',
    themes: {
      dark: {
        bgColor: '#080808',
        primaryColor: '#FFD400',
        secondaryColor: '#FF9F1C',
        accentColor: '#FFF1D6',
        textColor: '#FFFFFF',
        subTextColor: 'rgba(255,241,214,0.75)',
        borderColor: '#FFD400',
        badgeBg: '#FFD400',
        badgeText: '#000000',
      },
      light: {
        bgColor: '#FFFBEB',
        primaryColor: '#B45309',
        secondaryColor: '#991B1B',
        accentColor: '#1C1917',
        textColor: '#1C1917',
        subTextColor: '#57534E',
        borderColor: '#B45309',
        badgeBg: '#1C1917',
        badgeText: '#FFFBEB',
      },
    },
  },
  'chess-arena': {
    id: 'chess-arena',
    title: 'CHESS ARENA',
    subtitle: 'THINK AHEAD. MAKE YOUR MOVE.',
    tagline: 'THINK AHEAD. MAKE YOUR MOVE.',
    footerText: 'THINK AHEAD. MAKE YOUR MOVE.',
    secondaryFooter: 'EVERY MOVE TELLS A STORY.',
    institutionName: INSTITUTION,
    eventYear: EVENT_YEAR,
    emoji: '♟️',
    description: 'Strategic Minds, Bold Moves & Elite Chess',
    primaryColor: '#FFD700',
    secondaryColor: '#C9A84C',
    accentColor: '#FFFFF0',
    bgColor: '#0A0A0A',
    textColor: '#FFFFFF',
    photoPlacement: STANDARD_PHOTO_PLACEMENT,
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #FFD700 100%)',
    cardBorder: '#FFD700',
    themes: {
      dark: {
        bgColor: '#0A0A0A',
        primaryColor: '#FFD700',
        secondaryColor: '#C9A84C',
        accentColor: '#FFFFF0',
        textColor: '#FFFFFF',
        subTextColor: 'rgba(255,255,240,0.75)',
        borderColor: '#FFD700',
        badgeBg: '#FFD700',
        badgeText: '#0A0A0A',
      },
      light: {
        bgColor: '#FFFDF5',
        primaryColor: '#92400E',
        secondaryColor: '#78350F',
        accentColor: '#171717',
        textColor: '#171717',
        subTextColor: '#525252',
        borderColor: '#92400E',
        badgeBg: '#171717',
        badgeText: '#FFFDF5',
      },
    },
  },
};

export function getEvent(id: EventId): EventConfig {
  return EVENTS[id] ?? EVENTS['vibe-coding'];
}

export function getEventThemeColors(cfg: EventConfig, theme: FrameTheme = 'dark'): ThemeColors {
  return cfg.themes?.[theme] ?? cfg.themes?.dark ?? {
    bgColor: cfg.bgColor,
    primaryColor: cfg.primaryColor,
    secondaryColor: cfg.secondaryColor,
    accentColor: cfg.accentColor,
    textColor: cfg.textColor,
    subTextColor: 'rgba(255,255,255,0.7)',
    borderColor: cfg.primaryColor,
    badgeBg: cfg.primaryColor,
    badgeText: '#000000',
  };
}

export const ALL_EVENTS = Object.values(EVENTS);
