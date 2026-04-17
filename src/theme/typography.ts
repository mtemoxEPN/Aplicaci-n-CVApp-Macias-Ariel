import { StyleSheet, TextStyle } from 'react-native';
import { colors } from './colors';

export const fontSize = {
  largeTitle: 34,
  title1: 28,
  title2: 22,
  body: 17,
  subhead: 15,
  caption: 13,
} as const;

export const fontWeight = {
  light: '300' as TextStyle['fontWeight'],
  regular: '400' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const typography = StyleSheet.create({
  largeTitle: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.ui.textPrimary,
    letterSpacing: 0.37,
  },
  title1: {
    fontSize: fontSize.title1,
    fontWeight: fontWeight.bold,
    color: colors.ui.textPrimary,
    letterSpacing: 0.36,
  },
  title2: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textPrimary,
    letterSpacing: 0.35,
  },
  body: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.regular,
    color: colors.ui.textPrimary,
    letterSpacing: -0.41,
  },
  bodyBold: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textPrimary,
    letterSpacing: -0.41,
  },
  subhead: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.regular,
    color: colors.ui.textSecondary,
    letterSpacing: -0.24,
  },
  subheadBold: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textPrimary,
    letterSpacing: -0.24,
  },
  caption: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.regular,
    color: colors.ui.textSecondary,
    letterSpacing: -0.08,
  },
  captionBold: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textMuted,
    letterSpacing: -0.08,
  },
  label: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});