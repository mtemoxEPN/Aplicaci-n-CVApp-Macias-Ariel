export const colors = {
  primary: {
    red: '#C8102E',
    blue: '#003087',
    black: '#0A0A0A',
    white: '#F5F5F7',
    yellow: '#FFD100',
  },
  neutral: {
    gray100: '#F5F5F7',
    gray200: '#E8E8ED',
    gray300: '#D1D1D6',
    gray500: '#8E8E93',
    gray700: '#3A3A3C',
    gray900: '#1C1C1E',
  },
  ui: {
    background: '#F5F5F7',
    surface: '#FFFFFF',
    border: '#D1D1D6',
    divider: '#E8E8ED',
    textPrimary: '#1C1C1E',
    textSecondary: '#8E8E93',
    textMuted: '#3A3A3C',
    error: '#C8102E',
    success: '#34C759',
    warning: '#FFD100',
  },
  header: {
    background: '#C8102E',
    tint: '#FFFFFF',
  },
  levels: {
    basic: '#8E8E93',
    intermediate: '#003087',
    advanced: '#FFD100',
    expert: '#C8102E',
  },
} as const;

export type Colors = typeof colors;