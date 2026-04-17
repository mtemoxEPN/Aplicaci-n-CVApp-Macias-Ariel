import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../src/theme';

interface InputFiieldProps extends TextInputProps {
    label: string;
    error?: string;
};

export const InputField = ({ label, error, ...props }: InputFiieldProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholderTextColor={colors.ui.textSecondary}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: fontSize.subhead,
        fontWeight: fontWeight.semibold,
        color: colors.ui.textMuted,
        marginBottom: spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.ui.border,
        borderRadius: borderRadius.small,
        padding: spacing.md,
        fontSize: fontSize.body,
        backgroundColor: colors.ui.surface,
        color: colors.ui.textPrimary,
    },
    inputError: {
        borderColor: colors.ui.error,
    },
    errorText: {
        color: colors.ui.error,
        fontSize: fontSize.caption,
        marginTop: spacing.xs,
    },
});