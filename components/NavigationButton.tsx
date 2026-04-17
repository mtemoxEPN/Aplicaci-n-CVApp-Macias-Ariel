import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle
} from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, layout } from '../src/theme';

interface NavigationButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    style?: ViewStyle;
};

export const NavigationButton = ({
    title,
    onPress,
    variant = "primary",
    style
}: NavigationButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.button, styles[variant], style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing['2xl'],
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.sm,
        minHeight: layout.buttonMinHeight,
    },
    primary: {
        backgroundColor: colors.primary.red,
    },
    secondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary.blue,
    },
    danger: {
        backgroundColor: colors.primary.red,
    },
    text: {
        color: colors.ui.surface,
        fontSize: fontSize.body,
        fontWeight: fontWeight.semibold,
    },
    textSecondary: {
        color: colors.primary.blue,
    },
});