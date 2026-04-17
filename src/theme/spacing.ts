import { ViewStyle } from 'react-native';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const borderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 } as ViewStyle['shadowOffset'],
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  } as ViewStyle,
} as const;

export const layout = {
  screenPadding: spacing.lg,
  cardPadding: spacing.lg,
  inputPadding: spacing.md,
  buttonMinHeight: 48,
} as const;