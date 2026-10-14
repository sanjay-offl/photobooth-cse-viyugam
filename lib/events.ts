// ─────────────────────────────────────────────────────────────────────────────
// VIYUGAM 2K26 — Event Configuration Registry
// CSE Department · PPG Institute of Technology, Coimbatore
// Brand Theme: Orange (#FF6500), Black (#0A0A0A), White (#FFFFFF)
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
  gradient: string;
  cardBorder: string;
  themes: {
    dark: ThemeColors;
    light: ThemeColors;
  };
}

export const INSTITUTION = 'CSE Dept · PPG Institute of Technology, Coimbatore';
export const EVENT_YEAR = 'VIYUGAM 2K26';

// Symmetric 90px margins, 330px top header, 340px bottom footer
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
    primaryColor: '#E05C1A',
    secondaryColor: '#FF8833',
    accentColor: '#FFFFFF',
    bgColor: '#0A0A0A',
    textColor: '#FFFFFF',
    photoPlacement: STANDARD_PHOTO_PLACEMENT,
    gradient: 'linear-gradient(135deg, #FF6500 0%, #FF8833 100%)',
    cardBorder: '#FF6500',
    themes: {
      dark: {
        bgColor: '#0A0A0A',
        primaryColor: '#E05C1A',
        secondaryColor: '#FF8833',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        subTextColor: 'rgba(255,255,255,0.75)',
        borderColor: '#FF6500',
        badgeBg: '#FF6500',
        badgeText: '#000000',
      },
      light: {
        bgColor: '#FFFFFF',
        primaryColor: '#E05C1A',
        secondaryColor: '#EA580C',
        accentColor: '#0A0A0A',
        textColor: '#0A0A0A',
        subTextColor: '#52525B',
        borderColor: '#FF6500',
        badgeBg: '#0A0A0A',
        badgeText: '#FFFFFF',
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
    primaryColor: '#E05C1A',
    secondaryColor: '#F57835',
    accentColor: '#FFFFFF',
    bgColor: '#0A0A0A',
    textColor: '#FFFFFF',
    photoPlacement: STANDARD_PHOTO_PLACEMENT,
    gradient: 'linear-gradient(135deg, #E05C1A 0%, #F57835 100%)',
    cardBorder: '#E05C1A',
    themes: {
      dark: {
        bgColor: '#0A0A0A',
        primaryColor: '#E05C1A',
        secondaryColor: '#F57835',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        subTextColor: 'rgba(255,255,255,0.75)',
        borderColor: '#E05C1A',
        badgeBg: '#E05C1A',
        badgeText: '#000000',
      },
      light: {
        bgColor: '#FFFFFF',
        primaryColor: '#E05C1A',
        secondaryColor: '#C84E13',
        accentColor: '#0A0A0A',
        textColor: '#0A0A0A',
        subTextColor: '#52525B',
        borderColor: '#E05C1A',
        badgeBg: '#0A0A0A',
        badgeText: '#FFFFFF',
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
    primaryColor: '#E05C1A',
    secondaryColor: '#22C55E',
    accentColor: '#FFFFFF',
    bgColor: '#0A0A0A',
    textColor: '#FFFFFF',
    photoPlacement: STANDARD_PHOTO_PLACEMENT,
    gradient: 'linear-gradient(135deg, #E05C1A 0%, #22C55E 100%)',
    cardBorder: '#E05C1A',
    themes: {
      dark: {
        bgColor: '#0A0A0A',
        primaryColor: '#E05C1A',
        secondaryColor: '#22C55E',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        subTextColor: 'rgba(255,255,255,0.75)',
        borderColor: '#E05C1A',
        badgeBg: '#E05C1A',
        badgeText: '#000000',
      },
      light: {
        bgColor: '#FFFFFF',
        primaryColor: '#E05C1A',
        secondaryColor: '#16A34A',
        accentColor: '#0A0A0A',
        textColor: '#0A0A0A',
        subTextColor: '#52525B',
        borderColor: '#E05C1A',
        badgeBg: '#0A0A0A',
        badgeText: '#FFFFFF',
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
    primaryColor: '#E05C1A',
    secondaryColor: '#F57835',
    accentColor: '#FFFFFF',
    bgColor: '#0A0A0A',
    textColor: '#FFFFFF',
    photoPlacement: STANDARD_PHOTO_PLACEMENT,
    gradient: 'linear-gradient(135deg, #E05C1A 0%, #F57835 100%)',
    cardBorder: '#E05C1A',
    themes: {
      dark: {
        bgColor: '#0A0A0A',
        primaryColor: '#E05C1A',
        secondaryColor: '#F57835',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        subTextColor: 'rgba(255,255,255,0.75)',
        borderColor: '#E05C1A',
        badgeBg: '#E05C1A',
        badgeText: '#000000',
      },
      light: {
        bgColor: '#FFFFFF',
        primaryColor: '#E05C1A',
        secondaryColor: '#C84E13',
        accentColor: '#0A0A0A',
        textColor: '#0A0A0A',
        subTextColor: '#52525B',
        borderColor: '#E05C1A',
        badgeBg: '#0A0A0A',
        badgeText: '#FFFFFF',
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
    primaryColor: '#E05C1A',
    secondaryColor: '#E5E7EB',
    accentColor: '#FFFFFF',
    bgColor: '#0A0A0A',
    textColor: '#FFFFFF',
    photoPlacement: STANDARD_PHOTO_PLACEMENT,
    gradient: 'linear-gradient(135deg, #FF6500 0%, #FFFFFF 100%)',
    cardBorder: '#FF6500',
    themes: {
      dark: {
        bgColor: '#0A0A0A',
        primaryColor: '#E05C1A',
        secondaryColor: '#E5E7EB',
        accentColor: '#FFFFFF',
        textColor: '#FFFFFF',
        subTextColor: 'rgba(255,255,255,0.75)',
        borderColor: '#FF6500',
        badgeBg: '#FF6500',
        badgeText: '#000000',
      },
      light: {
        bgColor: '#FFFFFF',
        primaryColor: '#FF6500',
        secondaryColor: '#71717A',
        accentColor: '#0A0A0A',
        textColor: '#0A0A0A',
        subTextColor: '#52525B',
        borderColor: '#FF6500',
        badgeBg: '#0A0A0A',
        badgeText: '#FFFFFF',
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
    subTextColor: 'rgba(255,255,255,0.75)',
    borderColor: cfg.primaryColor,
    badgeBg: cfg.primaryColor,
    badgeText: '#000000',
  };
}

export const ALL_EVENTS = Object.values(EVENTS);
