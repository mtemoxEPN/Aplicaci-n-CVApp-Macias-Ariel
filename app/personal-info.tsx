import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';

import { useRouter } from 'expo-router';
import { InputField } from '../components/InputField';
import { NavigationButton } from '../components/NavigationButton';
import { useCVContext } from '../context/CVContext';
import { PersonalInfo } from '../types/cv.types';
import { colors, spacing } from '../src/theme';

// 🟢 1. IMPORTAR LAS HERRAMIENTAS: 
// 'useForm' crea el formulario y 'Controller' conecta nuestros inputs con ese formulario.
import { useForm, Controller } from 'react-hook-form';

export default function PersonalInfoScreen() {
    const router = useRouter();
    const { cvData, updatePersonalInfo } = useCVContext();


    // const [formData, setFormData] = useState<PersonalInfo>(cvData.personalInfo);
    // 🟢 2. CONFIGURAR EL FORMULARIO:
    // Reemplazamos el antiguo 'useState' por 'useForm'.
    const {
        control, // Controla el estado de los inputs
        handleSubmit, // Revisa que todo esté bien antes de guardar
        formState: { errors }, // Guarda los mensajes de error si nos equivocamos
        reset // Sirve para actualizar los datos iniciales
    } = useForm<PersonalInfo>({
        defaultValues: cvData.personalInfo // Los datos iniciales vienen del contexto
    });

    // 🟢 3. ACTUALIZAR SI EL CONTEXTO CAMBIA:
    // useEffect(() => {
    //     setFormData(cvData.personalInfo);
    // }, [cvData.personalInfo]);
    useEffect(() => {
        reset(cvData.personalInfo);
    }, [cvData.personalInfo, reset]);

    // 🟢 4. FUNCIÓN PARA GUARDAR (Solo se ejecuta si TODO es válido):
    const onSubmit = (data: PersonalInfo) => {
        // Ya no necesitamos el 'if' manual de errores aquí, React Hook Form lo hace por nosotros
        updatePersonalInfo(data);
        Alert.alert("Éxito", "Información guardada correctamente", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>

                {/* 🟢 5. ENVOLVER INPUTS CON EL CONTROLLER */}
                {/* Controller es como un "vigilante" que revisa este input específico */}
                <Controller
                    control={control}
                    name="fullName"
                    rules={{
                        required: "El nombre es obligatorio",
                        minLength: { value: 3, message: "Debe tener al menos 3 letras" },
                        // 🟢 NUEVO: Esta regla revisa que SOLO haya letras mayúsculas, minúsculas, tildes y espacios. ¡Cero números!
                        pattern: {
                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                            message: "El nombre no puede contener números ni símbolos raros"
                        }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <InputField
                            label="Nombre completo *"
                            placeholder='Tu nombre completo'
                            value={value}
                            // 🟢 NUEVO: Borramos los números del texto en tiempo real mientras el usuario escribe
                            onChangeText={(text) => onChange(text.replace(/[0-9]/g, ''))}
                            error={errors.fullName?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: "El correo es obligatorio",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // 🟢 REGLA: Formato de correo válido
                            message: "Ingresa un correo válido"
                        }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <InputField
                            label="Email *"
                            placeholder='tu@email.com'
                            value={value}
                            onChangeText={onChange}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            error={errors.email?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="phone"
                    rules={{
                        // 🟢 NUEVO: Revisamos que sean EXACTAMENTE 9 números
                        pattern: {
                            value: /^[0-9]{9}$/,
                            message: "El teléfono debe tener exactamente 9 números"
                        }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <InputField
                            label="Teléfono"
                            placeholder='Ej: 098698867'
                            value={value}
                            // 🟢 NUEVO: Solo permitimos que se escriban números y máximo 9
                            onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                            maxLength={9} 
                            keyboardType='numeric' // 🟢 NUEVO: Obligamos a que se abra el teclado numérico
                            error={errors.phone?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="location"
                    render={({ field: { onChange, value } }) => (
                        <InputField
                            label="Ubicación"
                            placeholder='Quito, Ecuador'
                            value={value}
                            onChangeText={onChange}
                            error={errors.location?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="summary"
                    rules={{
                        maxLength: { value: 300, message: "El resumen es muy largo (máximo 300 letras)" }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <InputField
                            label="Resumen Profesional"
                            placeholder='Descripción breve de tu perfil profesional...'
                            value={value}
                            onChangeText={onChange}
                            multiline
                            numberOfLines={4}
                            style={{ height: 100, textAlignVertical: 'top' }}
                            error={errors.summary?.message}
                        />
                    )}
                />

                {/* 🟢 6. EJECUTAR VALIDACIÓN AL PRESIONAR: 
                    Al presionar "Guardar", se ejecuta handleSubmit. Este revisa las reglas y, 
                    solo si no hay errores, ejecuta nuestra función onSubmit */}
                <NavigationButton title="Guardar" onPress={handleSubmit(onSubmit)} />

                <NavigationButton title="Cancelar" onPress={() => router.back()} variant='secondary' />

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.ui.background,
    },
    content: {
        padding: spacing.lg,
    },
});