export const colors = {
  background: '#0f172a',
  backgroundCard: 'rgba(30, 41, 59, 0.60)',
  cardBorder: 'rgba(255, 255, 255, 0.10)',
  cardBorderFocus: 'rgba(139, 92, 246, 0.60)',
  
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#64748B',
  
  accentStart: '#8b5cf6',
  accentEnd: '#6366f1',
  
  cyan: '#67e8f9',
  cyanBg: 'rgba(103, 232, 249, 0.12)',
  cyanBorder: 'rgba(103, 232, 249, 0.35)',
  
  amber: '#fcd34d',
  amberBg: 'rgba(252, 211, 77, 0.12)',
  amberBorder: 'rgba(252, 211, 77, 0.35)',
  
  purpleBg: 'rgba(139, 92, 246, 0.15)',
  purpleBorder: 'rgba(139, 92, 246, 0.40)',
  
  danger: '#f87171',
  dangerBg: 'rgba(239, 68, 68, 0.12)',
  dangerBorder: 'rgba(239, 68, 68, 0.30)',
  
  success: '#34d399',
  successBg: 'rgba(16, 185, 129, 0.12)',
  successBorder: 'rgba(16, 185, 129, 0.30)',
  
  grayBg: 'rgba(148, 163, 184, 0.10)',
  grayBorder: 'rgba(148, 163, 184, 0.20)',

  inputBg: 'rgba(255, 255, 255, 0.04)',
  inputBorder: 'rgba(255, 255, 255, 0.12)',
  inputBorderFocus: '#8b5cf6',

  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  titleMain: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  subtitleMain: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  bodySecondary: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  ticketLarge: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 2,
  },
  ticketMedium: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  glowPurple: {
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  glowAmber: {
    shadowColor: '#fcd34d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
};
