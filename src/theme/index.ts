// Editorial design tokens — warm ivory / ink palette
export const Colors = {
  // Backgrounds
  background: '#F6F1E8',
  surface: '#FFFFFF',
  surfaceWarm: '#EDE8DC',

  // Text
  ink: '#292722',
  inkMuted: '#5A5550',
  inkSubtle: '#9A948C',

  // Accents
  olive: '#7D8064',
  terracotta: '#B56D50',
  terracottaLight: '#D4907A',

  // Borders / Dividers
  border: '#D8D2C6',
  borderStrong: '#B0A898',

  // Feedback
  error: '#C0392B',
  errorBg: '#FDECEA',
  success: '#4A7C59',

  // Cards / overlays
  card: '#FFFDF8',
  scrim: 'rgba(41, 39, 34, 0.45)',
  highlight: 'rgba(181, 109, 80, 0.12)',

  // Ratings
  star: '#D4A017',
  starEmpty: '#D8D2C6',
};

export const Typography = {
  // Serif – editorial headings
  serif: {
    fontFamily: 'serif' as const,
    letterSpacing: 0.2,
  },
  // Sans – body and UI
  sans: {
    fontFamily: 'System' as const,
    letterSpacing: 0,
  },

  // Scale
  h1: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const },
  h2: { fontSize: 22, lineHeight: 30, fontWeight: '600' as const },
  h3: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  small: { fontSize: 13, lineHeight: 19, fontWeight: '400' as const },
  tiny: { fontSize: 11, lineHeight: 16, fontWeight: '400' as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '400' as const },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const Shadows = {
  card: {
    shadowColor: '#292722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  modal: {
    shadowColor: '#292722',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
};
