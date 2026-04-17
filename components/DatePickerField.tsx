// components/DatePickerField.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../src/theme';

interface DatePickerFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    placeholder?: string;
}

export const DatePickerField = ({ label, value, onChangeText, error, placeholder }: DatePickerFieldProps) => {
    const [show, setShow] = useState(false);

    const onChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
        }
        
        if (selectedDate) {
            const dateString = selectedDate.toLocaleDateString('es-ES');
            onChangeText(dateString);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            
            <TouchableOpacity 
                style={[styles.input, error && styles.inputError]} 
                onPress={() => setShow(true)}
                activeOpacity={0.7}
            >
                <Text style={{ color: value ? colors.ui.textPrimary : colors.ui.textSecondary }}>
                    {value ? value : placeholder}
                </Text>
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: spacing.lg },
    label: { fontSize: fontSize.subhead, fontWeight: fontWeight.semibold, color: colors.ui.textMuted, marginBottom: spacing.sm },
    input: {
        borderWidth: 1, borderColor: colors.ui.border, borderRadius: borderRadius.small,
        padding: spacing.lg,
        backgroundColor: colors.ui.surface,
    },
    inputError: { borderColor: colors.ui.error },
    errorText: { color: colors.ui.error, fontSize: fontSize.caption, marginTop: spacing.xs },
});