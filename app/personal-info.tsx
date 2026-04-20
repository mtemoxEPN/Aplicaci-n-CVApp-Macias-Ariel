import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { InputField } from '../components/InputField';
import { NavigationButton } from '../components/NavigationButton';
import { useCVContext } from '../context/CVContext';
import { PersonalInfo } from '../types/cv.types';
import { colors, spacing } from '../src/theme';

// 🟢 1. Se importa la herramienta principal de TanStack Form en lugar de React Hook Form.
import { useForm } from '@tanstack/react-form';

export default function PersonalInfoScreen() {
    const router = useRouter();
    const { cvData, updatePersonalInfo } = useCVContext();

    // 🟢 2. La función configura el estado inicial del formulario y define las acciones de guardado.
    const form = useForm<PersonalInfo>({
        defaultValues: cvData.personalInfo,
        onSubmit: async ({ value }) => {
            // El sistema registra los datos en el contexto global y confirma la acción al usuario.
            updatePersonalInfo(value);
            Alert.alert("Éxito", "Información guardada correctamente", [
                { text: "OK", onPress: () => router.back() }
            ]);
        },
    });

    // 🟢 3. El componente actualiza los valores en la pantalla si la información del contexto cambia.
    useEffect(() => {
        form.reset(cvData.personalInfo);
    }, [cvData.personalInfo]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>

                {/* 🟢 4. Se reemplaza el componente Controller por la estructura Field de TanStack. */}
                <form.Field
                    name="fullName"
                    // 🟢 5. Las reglas de validación se programan directamente dentro de la propiedad validators.
                    validators={{
                        onChange: ({ value }) => {
                            if (!value) return "El nombre es obligatorio";
                            if (value.length < 3) return "Debe tener al menos 3 letras";
                            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "El nombre no puede contener números ni símbolos raros";
                            return undefined;
                        }
                    }}
                    // 🟢 6. La función children conecta las propiedades visuales del InputField con los datos internos del formulario.
                    children={(field) => (
                        <InputField
                            label="Nombre completo *"
                            placeholder='Tu nombre completo'
                            value={field.state.value}
                            onChangeText={(text) => field.handleChange(text.replace(/[0-9]/g, ''))}
                            // El sistema extrae el primer mensaje de error disponible en la lista de validación.
                            error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
                        />
                    )}
                />

                <form.Field
                    name="email"
                    validators={{
                        onChange: ({ value }) => {
                            if (!value) return "El correo es obligatorio";
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return "Ingresa un correo válido";
                            return undefined;
                        }
                    }}
                    children={(field) => (
                        <InputField
                            label="Email *"
                            placeholder='tu@email.com'
                            value={field.state.value}
                            onChangeText={(text) => field.handleChange(text)}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
                        />
                    )}
                />

                <form.Field
                    name="phone"
                    validators={{
                        onChange: ({ value }) => {
                            if (value && !/^[0-9]{9}$/.test(value)) return "El teléfono debe tener exactamente 9 números";
                            return undefined;
                        }
                    }}
                    children={(field) => (
                        <InputField
                            label="Teléfono"
                            placeholder='Ej: 098698867'
                            value={field.state.value || ''}
                            onChangeText={(text) => field.handleChange(text.replace(/[^0-9]/g, ''))}
                            maxLength={9} 
                            keyboardType='numeric'
                            error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
                        />
                    )}
                />

                <form.Field
                    name="location"
                    children={(field) => (
                        <InputField
                            label="Ubicación"
                            placeholder='Quito, Ecuador'
                            value={field.state.value || ''}
                            onChangeText={(text) => field.handleChange(text)}
                            error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
                        />
                    )}
                />

                <form.Field
                    name="summary"
                    validators={{
                        onChange: ({ value }) => {
                            if (value && value.length > 300) return "El resumen es muy largo (máximo 300 letras)";
                            return undefined;
                        }
                    }}
                    children={(field) => (
                        <InputField
                            label="Resumen Profesional"
                            placeholder='Descripción breve de tu perfil profesional...'
                            value={field.state.value || ''}
                            onChangeText={(text) => field.handleChange(text)}
                            multiline
                            numberOfLines={4}
                            style={{ height: 100, textAlignVertical: 'top' }}
                            error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
                        />
                    )}
                />

                {/* 🟢 7. El botón ejecuta la función de validación general antes de guardar la información final. */}
                <NavigationButton title="Guardar" onPress={form.handleSubmit} />

                <NavigationButton title="Cancelar" onPress={() => router.back()} variant='secondary' />

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.ui.background },
    content: { padding: spacing.lg },
});