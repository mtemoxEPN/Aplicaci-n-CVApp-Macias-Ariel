# Contexto Completo del Proyecto CV-CREATOR-APP


================================================
📄 ARCHIVO: .gitignore
================================================

# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

app-example

# generated native folders
/ios
/android


================================================
📄 ARCHIVO: AGENTS.md
================================================

# AGENTS.md - cv-creator-app

## Commands
- `npm start` - Start Expo dev server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run as web app
- `npm run lint` - Run ESLint (expo lint)

## Architecture
- Framework: Expo SDK 54 with expo-router (file-based routing)
- Entry point: `expo-router/entry` - routes defined in `app/` directory
- TypeScript: strict mode enabled, path alias `@/*` maps to root
- New Architecture enabled (`newArchEnabled: true` in app.json)

## Key Files
- `app/_layout.tsx` - Root layout
- `app/(tabs)/` - Tab-based navigation routes
- `app/modal.tsx` - Modal route

## Testing
No test framework configured in package.json. Do not assume jest/vitest is available.

================================================
📄 ARCHIVO: app\education.tsx
================================================

import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "../src/theme";

// 🟢 1. Se importa la herramienta principal de TanStack Form.
import { useForm } from '@tanstack/react-form';

type EducationFormValues = Omit<Education, "id">;

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  // 🟢 2. Se configura el formulario con los valores por defecto y la acción de guardado.
  const form = useForm<EducationFormValues>({
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      graduationYear: ""
    },
    onSubmit: async ({ value }) => {
      const newEducation: Education = {
        id: Date.now().toString(),
        ...value,
      };
      addEducation(newEducation);
      form.reset({ institution: "", degree: "", field: "", graduationYear: "" });
      Alert.alert("Éxito", "Educación agregada correctamente");
    }
  });

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteEducation(id) },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

        {/* 🟢 3. El sistema valida que el campo de institución no esté vacío y solo contenga letras. */}
        <form.Field
          name="institution"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "La institución es obligatoria";
              if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "Solo se permiten letras";
              return undefined;
            }
          }}
          children={(field) => (
            <InputField
              label="Institución *"
              placeholder="Nombre de la universidad/institución"
              value={field.state.value}
              onChangeText={(text) => field.handleChange(text.replace(/[0-9]/g, ''))}
              error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
            />
          )}
        />

        {/* 🟢 4. El sistema valida el título académico bajo las mismas reglas de texto estricto. */}
        <form.Field
          name="degree"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "El título es obligatorio";
              if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "Solo se permiten letras";
              return undefined;
            }
          }}
          children={(field) => (
            <InputField
              label="Título/Grado *"
              placeholder="Ej: Licenciatura, Maestría"
              value={field.state.value}
              onChangeText={(text) => field.handleChange(text.replace(/[0-9]/g, ''))}
              error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
            />
          )}
        />

        {/* 🟢 5. El campo de área de estudio es opcional, pero si tiene texto, el sistema verifica que sean solo letras. */}
        <form.Field
          name="field"
          validators={{
            onChange: ({ value }) => {
              if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "Solo se permiten letras";
              return undefined;
            }
          }}
          children={(field) => (
            <InputField
              label="Área de Estudio"
              placeholder="Ej: Ingeniería en Sistemas"
              value={field.state.value || ""}
              onChangeText={(text) => field.handleChange(text.replace(/[0-9]/g, ''))}
              error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
            />
          )}
        />

        {/* 🟢 6. El sistema evalúa numéricamente el año ingresado para comprobar que cumple con el rango temporal permitido. */}
        <form.Field
          name="graduationYear"
          validators={{
            onChange: ({ value }) => {
              if (value) {
                if (!/^[0-9]{4}$/.test(value)) return "Debe ser un año válido de 4 dígitos";
                const year = parseInt(value, 10);
                if (year < 1950) return "El año no puede ser tan antiguo (mínimo 1950)";
                if (year > 2035) return "Ingresa un año válido";
              }
              return undefined;
            }
          }}
          children={(field) => (
            <InputField
              label="Año de Graduación"
              placeholder="Ej: 2026"
              value={field.state.value || ""}
              onChangeText={(text) => field.handleChange(text.replace(/[^0-9]/g, ''))}
              maxLength={4}
              keyboardType="numeric"
              error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
            />
          )}
        />

        {/* 🟢 7. El botón acciona el evento handleSubmit nativo de TanStack Form. */}
        <NavigationButton title="Agregar Educación" onPress={form.handleSubmit} />

        {/* LISTA DE EDUCACIÓN AGREGADA */}
        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  {edu.field && <Text style={styles.cardSubtitle}>{edu.field}</Text>}
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  {edu.graduationYear && <Text style={styles.cardDate}>{edu.graduationYear}</Text>}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(edu.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ui.background },
  content: { padding: spacing.lg },
  sectionTitle: { fontSize: fontSize.title1, fontWeight: fontWeight.bold, color: colors.ui.textPrimary, marginBottom: spacing.lg },
  listTitle: { fontSize: fontSize.title2, fontWeight: fontWeight.semibold, color: colors.ui.textPrimary, marginTop: spacing['2xl'], marginBottom: spacing.md },
  card: { backgroundColor: colors.ui.surface, borderRadius: borderRadius.large, padding: spacing.lg, marginBottom: spacing.md, flexDirection: "row", ...shadows.card },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: fontSize.body, fontWeight: fontWeight.semibold, color: colors.ui.textPrimary, marginBottom: spacing.xs },
  cardSubtitle: { fontSize: fontSize.subhead, color: colors.ui.textSecondary, marginBottom: spacing.xs },
  cardInstitution: { fontSize: fontSize.subhead, color: colors.ui.textMuted, marginBottom: spacing.xs },
  cardDate: { fontSize: fontSize.caption, color: colors.ui.textSecondary },
  deleteButton: { width: 32, height: 32, borderRadius: borderRadius.pill, backgroundColor: colors.ui.error, justifyContent: "center", alignItems: "center" },
  deleteButtonText: { color: colors.ui.surface, fontSize: 18, fontWeight: fontWeight.bold },
});

================================================
📄 ARCHIVO: app\experience.tsx
================================================

import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "../src/theme";

// 🟢 1. Se importa la herramienta principal de TanStack Form en lugar de React Hook Form.
import { useForm } from "@tanstack/react-form";
import { DatePickerField } from "../components/DatePickerField";

type ExperienceFormValues = Omit<Experience, "id">;

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  // 🟢 2. CONFIGURAMOS EL FORMULARIO con TanStack Form
  const form = useForm<ExperienceFormValues>({
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: ""
    },
    onSubmit: async ({ value }) => {
      const newExperience: Experience = {
        id: Date.now().toString(),
        ...value,
      };
      addExperience(newExperience);
      
      // Limpiamos el formulario para agregar otra
      form.reset({ company: "", position: "", startDate: "", endDate: "", description: "" });
      Alert.alert("Éxito", "Experiencia agregada correctamente");
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteExperience(id) },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        {/* 🟢 INPUT DE EMPRESA con TanStack Form */}
        <form.Field
          name="company"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "La empresa es obligatoria";
              if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "Solo se permiten letras";
              return undefined;
            }
          }}
          children={(field) => (
            <InputField
              label="Empresa *"
              placeholder="Nombre de la empresa"
              value={field.state.value}
              onChangeText={(text) => field.handleChange(text.replace(/[0-9]/g, ''))}
              error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
            />
          )}
        />

        {/* 🟢 INPUT DE CARGO con TanStack Form */}
        <form.Field
          name="position"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "El cargo es obligatorio";
              if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "Solo se permiten letras";
              return undefined;
            }
          }}
          children={(field) => (
            <InputField
              label="Cargo *"
              placeholder="Tu posición"
              value={field.state.value}
              onChangeText={(text) => field.handleChange(text.replace(/[0-9]/g, ''))}
              error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
            />
          )}
        />

        {/* 🟢 CALENDARIO PARA FECHA DE INICIO con TanStack Form */}
        <form.Field
          name="startDate"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "La fecha de inicio es obligatoria";
              return undefined;
            }
          }}
          children={(field) => (
            <DatePickerField
              label="Fecha de Inicio *"
              placeholder="Toca para elegir una fecha"
              value={field.state.value}
              onChangeText={field.handleChange}
              error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
            />
          )}
        />

        {/* 🟢 CALENDARIO PARA FECHA DE FIN (Este no es obligatorio) */}
        <form.Field
          name="endDate"
          children={(field) => (
            <DatePickerField
              label="Fecha de Fin"
              placeholder="Déjalo vacío si es tu trabajo actual"
              value={field.state.value}
              onChangeText={field.handleChange}
            />
          )}
        />

        {/* 🟢 INPUT DE DESCRIPCIÓN con TanStack Form */}
        <form.Field
          name="description"
          children={(field) => (
            <InputField
              label="Descripción"
              placeholder="Describe tus responsabilidades..."
              value={field.state.value}
              onChangeText={field.handleChange}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
            />
          )}
        />

        {/* 🟢 EL BOTÓN EJECUTA handleSubmit DE TANSTACK FORM */}
        <NavigationButton title="Agregar Experiencia" onPress={form.handleSubmit} />

        {/* LISTA DE EXPERIENCIAS YA AGREGADAS */}
        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(exp.id)}>
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
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
  sectionTitle: {
    fontSize: fontSize.title1,
    fontWeight: fontWeight.bold,
    color: colors.ui.textPrimary,
    marginBottom: spacing.lg,
  },
  listTitle: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textPrimary,
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.ui.surface,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: "row",
    ...shadows.card,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textPrimary,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: fontSize.subhead,
    color: colors.ui.textSecondary,
    marginBottom: spacing.xs,
  },
  cardDate: {
    fontSize: fontSize.caption,
    color: colors.ui.textSecondary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.ui.error,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: colors.ui.surface,
    fontSize: 18,
    fontWeight: fontWeight.bold,
  },
});

================================================
📄 ARCHIVO: app\index.tsx
================================================

import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "../src/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { cvData } = useCVContext();

  const isPersonalInfoComplete =
    cvData.personalInfo.fullName && cvData.personalInfo.email;
  const hasExperience = cvData.experiences.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasSkills = cvData.skills.length > 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image
          source={require("../assets/epn-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Crea tu CV</Text>
        <Text style={styles.subtitle}>Completa los pasos para generar tu hoja de vida profesional</Text>
      </View>

      <View style={styles.stepsContainer}>
        <View style={styles.stepCard}>
          <View style={[styles.stepNumber, isPersonalInfoComplete && styles.stepComplete]}>
            <Text style={styles.stepNumberText}>{isPersonalInfoComplete ? "✓" : "1"}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Información Personal</Text>
            <Text style={styles.stepStatus}>
              {isPersonalInfoComplete ? "Completado" : "Pendiente"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.stepButton}
            onPress={() => router.push("/personal-info")}
          >
            <Text style={styles.stepButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stepCard}>
          <View style={[styles.stepNumber, hasExperience && styles.stepComplete]}>
            <Text style={styles.stepNumberText}>{hasExperience ? "✓" : "2"}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Experiencia Laboral</Text>
            <Text style={styles.stepStatus}>
              {hasExperience
                ? `${cvData.experiences.length} registro(s)`
                : "Pendiente"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.stepButton}
            onPress={() => router.push("/experience")}
          >
            <Text style={styles.stepButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stepCard}>
          <View style={[styles.stepNumber, hasEducation && styles.stepComplete]}>
            <Text style={styles.stepNumberText}>{hasEducation ? "✓" : "3"}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Educación</Text>
            <Text style={styles.stepStatus}>
              {hasEducation
                ? `${cvData.education.length} registro(s)`
                : "Pendiente"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.stepButton}
            onPress={() => router.push("/education")}
          >
            <Text style={styles.stepButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stepCard}>
          <View style={[styles.stepNumber, hasSkills && styles.stepComplete]}>
            <Text style={styles.stepNumberText}>{hasSkills ? "✓" : "4"}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Habilidades</Text>
            <Text style={styles.stepStatus}>
              {hasSkills
                ? `${cvData.skills.length} habilidad(es)`
                : "Pendiente"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.stepButton}
            onPress={() => router.push("/skills")}
          >
            <Text style={styles.stepButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.previewContainer}>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => router.push("/preview")}
        >
          <Text style={styles.previewButtonText}>Ver Vista Previa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ui.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.lg,
  },
  logo: {
    width: 500,
    height: 200,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.ui.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.subhead,
    color: colors.ui.textSecondary,
    textAlign: 'center',
  },
  stepsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ui.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.large,
    ...shadows.card,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepComplete: {
    backgroundColor: colors.primary.red,
  },
  stepNumberText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.ui.surface,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textPrimary,
    marginBottom: spacing.xs,
  },
  stepStatus: {
    fontSize: fontSize.caption,
    color: colors.ui.textSecondary,
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepButtonText: {
    fontSize: fontSize.body,
    color: colors.ui.surface,
    fontWeight: fontWeight.bold,
  },
  previewContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
  },
  previewButton: {
    backgroundColor: colors.primary.blue,
    padding: spacing.lg,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
  },
  previewButtonText: {
    color: colors.ui.surface,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
});



================================================
📄 ARCHIVO: app\personal-info.tsx
================================================

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

================================================
📄 ARCHIVO: app\preview.tsx
================================================

import React from 'react';
import { 
    View,
    StyleSheet,
    Alert
 } from 'react-native';
import { useCVContext } from '../context/CVContext';
import { CVPreview } from '@/components/CVPreview';
import { NavigationButton } from '../components/NavigationButton';
// 🟢 2. Se importa la función externa para generar el documento.
import { generateCVHtml } from '../utils/pdfGenerator';

// 🟢 1. Se importan las librerías para la gestión de documentos y el envío de archivos.
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function PreviewScreen() {
    const { cvData } = useCVContext();

    // 🟢 3. El método ejecuta la transformación del contenido visual a un archivo de formato PDF.
    const handleExportPDF = async () => {
        try {
            // 🟢 3. Se utiliza la función externa pasándole los datos actuales del contexto.
            const { uri } = await Print.printToFileAsync({
                html: generateCVHtml(cvData), 
            });

            const isAvailable = await Sharing.isAvailableAsync();

            if (isAvailable) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Compartir mi CV',
                    UTI: 'com.adobe.pdf'
                });
            } else {
                Alert.alert("Error", "La función de compartir no está disponible en este dispositivo");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un problema al generar el PDF");
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <CVPreview cvData={cvData} />
            
            {/* 🟢 5. El componente de botón inicia el proceso de creación y distribución del documento final. */}
            <View style={styles.buttonContainer}>
                <NavigationButton 
                    title="Exportar y Compartir PDF" 
                    onPress={handleExportPDF} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    }
 });

================================================
📄 ARCHIVO: app\skills.tsx
================================================

import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Skill } from "../types/cv.types";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "../src/theme";

// 🟢 1. Se importa la herramienta principal de TanStack Form.
import { useForm } from "@tanstack/react-form";

const LEVELS: Skill['level'][] = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];

type SkillFormValues = {
  name: string;
  level: Skill['level'];
};

export default function SkillsScreen() {
  const router = useRouter();
  const { cvData, addSkill, deleteSkill } = useCVContext();

  // 🟢 2. Se configura el formulario con los valores por defecto y la acción de guardado.
  const form = useForm<SkillFormValues>({
    defaultValues: {
      name: "",
      level: "Básico"
    },
    onSubmit: async ({ value }) => {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: value.name.trim(),
        level: value.level,
      };
      addSkill(newSkill);
      form.reset({ name: "", level: "Básico" });
      Alert.alert("Éxito", "Habilidad agregada correctamente");
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta habilidad?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteSkill(id) },
    ]);
  };

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'Básico': return colors.levels.basic;
      case 'Intermedio': return colors.levels.intermediate;
      case 'Avanzado': return colors.levels.advanced;
      case 'Experto': return colors.levels.expert;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Habilidad</Text>

        {/* 🟢 3. Campo de nombre de habilidad con validación con TanStack Form */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              if (!value || !value.trim()) return "El nombre de la habilidad es obligatorio";
              return undefined;
            }
          }}
          children={(field) => (
            <InputField
              label="Habilidad Técnica *"
              placeholder="Ej: TypeScript, React Native, Python"
              value={field.state.value}
              onChangeText={(text) => field.handleChange(text)}
              error={field.state.meta.errors ? field.state.meta.errors.join(', ') : undefined}
            />
          )}
        />

        {/* 🟢 4. Selector de nivel con TanStack Form */}
        <Text style={styles.label}>Nivel *</Text>
        <View style={styles.levelContainer}>
          {LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                form.state.values.level === level && styles.levelButtonSelected,
                { borderColor: getLevelColor(level) },
                form.state.values.level === level && { backgroundColor: getLevelColor(level) + '20' },
              ]}
              onPress={() => form.setFieldValue("level", level)}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  form.state.values.level === level && styles.levelButtonTextSelected,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🟢 5. El botón acciona el evento handleSubmit nativo de TanStack Form. */}
        <NavigationButton title="Agregar Habilidad" onPress={form.handleSubmit} />

        {cvData.skills.length > 0 && (
          <>
            <Text style={styles.listTitle}>Habilidades Agregadas</Text>
            {cvData.skills.map((skill) => (
              <View key={skill.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{skill.name}</Text>
                  <View style={[styles.levelBadge, { backgroundColor: getLevelColor(skill.level) }]}>
                    <Text style={styles.levelBadgeText}>{skill.level}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(skill.id)}>
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
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
  sectionTitle: {
    fontSize: fontSize.title1,
    fontWeight: fontWeight.bold,
    color: colors.ui.textPrimary,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.ui.textPrimary,
    marginBottom: spacing.sm,
  },
  levelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  levelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.medium,
    borderWidth: 2,
    borderColor: colors.ui.border,
    backgroundColor: colors.ui.surface,
  },
  levelButtonSelected: {
    borderWidth: 2,
  },
  levelButtonText: {
    fontSize: fontSize.subhead,
    color: colors.ui.textSecondary,
  },
  levelButtonTextSelected: {
    fontWeight: fontWeight.semibold,
  },
  listTitle: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textPrimary,
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.ui.surface,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: "row",
    ...shadows.card,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textPrimary,
    flex: 1,
  },
  levelBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  levelBadgeText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.ui.surface,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.ui.error,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  deleteButtonText: {
    color: colors.ui.surface,
    fontSize: 18,
    fontWeight: fontWeight.bold,
  },
});

================================================
📄 ARCHIVO: app\_layout.tsx
================================================

import { Stack } from 'expo-router';
import { CVProvider } from '../context/CVContext';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <CVProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary.red,
          },
          headerTintColor: colors.header.tint,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >

        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Crear CV', 
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="personal-info" 
          options={{ 
            title: 'Información Personal', 
          }} 
        />
        <Stack.Screen 
          name="experience" 
          options={{ 
            title: 'Información Laboral', 
          }} 
        />
        <Stack.Screen 
          name="education" 
          options={{ 
            title: 'Educación', 
          }} 
        />
        <Stack.Screen 
          name="skills" 
          options={{ 
            title: 'Habilidades', 
          }} 
        />
        <Stack.Screen 
          name="preview" 
          options={{ 
            title: 'Vista Previa', 
            presentation: 'modal',
          }} 
        />
      </Stack>

    </CVProvider>
  );
};

================================================
📄 ARCHIVO: app.json
================================================

{
  "expo": {
    "name": "cv-creator-app",
    "slug": "cv-creator-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "cvcreatorapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.mtemox.cvcreatorapp"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "@react-native-community/datetimepicker"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "8035d9af-d101-4ec7-a69f-62af02fc0a43"
      }
    }
  }
}


================================================
📄 ARCHIVO: components\CVPreview.tsx
================================================

import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { CVData } from "../types/cv.types";
import { colors, spacing, fontSize, fontWeight } from "../src/theme";

interface CVPreviewProps {
  cvData: CVData;
}

const LogoEpn = () => (
  <Image
    source={require("../assets/epn-logo.png")}
    style={styles.logo}
    resizeMode="contain"
  />
);

export const CVPreview: React.FC<CVPreviewProps> = ({ cvData }) => {
  const { personalInfo, experiences, education, skills } = cvData;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Básico': return colors.levels.basic;
      case 'Intermedio': return colors.levels.intermediate;
      case 'Avanzado': return colors.levels.advanced;
      case 'Experto': return colors.levels.expert;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <LogoEpn />
        <Text style={styles.epnLabel}>EPN</Text>
      </View>
      <View style={styles.content}>
        {/* Header con información personal */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.fullName || "Tu Nombre"}
          </Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && (
              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>✉</Text>
                <Text style={styles.contactText}>{personalInfo.email}</Text>
              </View>
            )}
            {personalInfo.phone && (
              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>☎</Text>
                <Text style={styles.contactText}>{personalInfo.phone}</Text>
              </View>
            )}
            {personalInfo.location && (
              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>📍</Text>
                <Text style={styles.contactText}>{personalInfo.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Resumen profesional */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESUMEN PROFESIONAL</Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experiencia laboral */}
        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCIA LABORAL</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                <Text style={styles.itemDate}>
                  {exp.startDate} - {exp.endDate || "Actual"}
                </Text>
                {exp.description && (
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Educación */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCACIÓN</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                {edu.field && (
                  <Text style={styles.itemSubtitle}>{edu.field}</Text>
                )}
                <Text style={styles.itemInstitution}>{edu.institution}</Text>
                {edu.graduationYear && (
                  <Text style={styles.itemDate}>{edu.graduationYear}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Habilidades */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HABILIDADES TÉCNICAS</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill) => (
                <View key={skill.id} style={[styles.skillBadge, { backgroundColor: getLevelColor(skill.level) + '20', borderColor: getLevelColor(skill.level) }]}>
                  <Text style={[styles.skillName]}>{skill.name}</Text>
                  <Text style={[styles.skillLevel, { color: getLevelColor(skill.level) }]}>{skill.level}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Mensaje si no hay datos */}
        {!personalInfo.fullName &&
          experiences.length === 0 &&
          education.length === 0 &&
          skills.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No hay información para mostrar.{"\n"}
                Completa las secciones para ver tu CV.
              </Text>
            </View>
          )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.surface,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.primary.red,
  },
  logo: {
    width: 300,
    height: 200,
  },
  epnLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.ui.surface,
    marginTop: spacing.xs,
    letterSpacing: 2,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary.red,
    paddingBottom: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  name: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.ui.textPrimary,
    marginBottom: spacing.md,
  },
  contactInfo: {
    gap: spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactIcon: {
    fontSize: fontSize.subhead,
    width: 24,
  },
  contactText: {
    fontSize: fontSize.subhead,
    color: colors.ui.textSecondary,
    flex: 1,
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.bold,
    color: colors.primary.red,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: fontSize.subhead,
    color: colors.ui.textPrimary,
    lineHeight: 22,
  },
  item: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.divider,
  },
  itemTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textPrimary,
    marginBottom: spacing.xs,
  },
  itemSubtitle: {
    fontSize: fontSize.subhead,
    color: colors.ui.textSecondary,
    marginBottom: spacing.xs,
  },
  itemInstitution: {
    fontSize: fontSize.subhead,
    color: colors.ui.textMuted,
    marginBottom: spacing.xs,
  },
  itemDate: {
    fontSize: fontSize.caption,
    color: colors.ui.textSecondary,
    fontStyle: "italic",
    marginBottom: spacing.sm,
  },
  itemDescription: {
    fontSize: fontSize.caption,
    color: colors.ui.textPrimary,
    lineHeight: 18,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.sm,
  },
  skillName: {
    fontSize: fontSize.subhead,
    fontWeight: fontWeight.semibold,
    color: colors.ui.textPrimary,
  },
  skillLevel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.ui.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});


================================================
📄 ARCHIVO: components\DatePickerField.tsx
================================================

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

================================================
📄 ARCHIVO: components\InputField.tsx
================================================

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

================================================
📄 ARCHIVO: components\NavigationButton.tsx
================================================

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

================================================
📄 ARCHIVO: context\CVContext.tsx
================================================

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CVData, PersonalInfo, Experience, Education, Skill } from "../types/cv.types";

interface CVContextType {
  cvData: CVData;
  updatePersonalInfo: (info: PersonalInfo) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Experience) => void;
  deleteExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Education) => void;
  deleteEducation: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Skill) => void;
  deleteSkill: (id: string) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCVData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experiences: [],
    education: [],
    skills: [],
  });

  const updatePersonalInfo = (info: PersonalInfo) => {
    setCVData((prev) => ({ ...prev, personalInfo: info }));
  };

  const addExperience = (exp: Experience) => {
    setCVData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, exp],
    }));
  };

  const updateExperience = (id: string, exp: Experience) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? exp : e)),
    }));
  };

  const deleteExperience = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  const addEducation = (edu: Education) => {
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, edu],
    }));
  };

  const updateEducation = (id: string, edu: Education) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? edu : e)),
    }));
  };

  const deleteEducation = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  const addSkill = (skill: Skill) => {
    setCVData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };

  const updateSkill = (id: string, skill: Skill) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? skill : s)),
    }));
  };

  const deleteSkill = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        updatePersonalInfo,
        addExperience,
        updateExperience,
        deleteExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        addSkill,
        updateSkill,
        deleteSkill,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error("useCVContext debe usarse dentro de CVProvider");
  }
  return context;
};



================================================
📄 ARCHIVO: eas.json
================================================

{
  "cli": {
    "version": ">= 18.7.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}


================================================
📄 ARCHIVO: eslint.config.js
================================================

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);


================================================
📄 ARCHIVO: expo-env.d.ts
================================================

/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

================================================
📄 ARCHIVO: jest.config.js
================================================

module.exports = {
  preset: 'jest-expo',
};

================================================
📄 ARCHIVO: package.json
================================================

{
  "name": "cv-creator-app",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-native-community/datetimepicker": "8.4.4",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "@tanstack/react-form": "^1.29.0",
    "expo": "~54.0.33",
    "expo-constants": "~18.0.13",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-linking": "~8.0.11",
    "expo-print": "~15.0.8",
    "expo-router": "~6.0.23",
    "expo-sharing": "~14.0.8",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-web-browser": "~15.0.10",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.5.1"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0",
    "jest-expo": "^55.0.16",
    "typescript": "~5.9.2"
  },
  "private": true
}


================================================
📄 ARCHIVO: README.md
================================================

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


================================================
📄 ARCHIVO: src\theme\colors.ts
================================================

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

================================================
📄 ARCHIVO: src\theme\index.ts
================================================

export { colors } from './colors';
export type { Colors } from './colors';

export { fontSize, fontWeight, typography } from './typography';

export { spacing, borderRadius, shadows, layout } from './spacing';

================================================
📄 ARCHIVO: src\theme\spacing.ts
================================================

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

================================================
📄 ARCHIVO: src\theme\typography.ts
================================================

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

================================================
📄 ARCHIVO: tsconfig.json
================================================

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}


================================================
📄 ARCHIVO: types\cv.types.tsx
================================================

export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
}
export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}
export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
}
export interface Skill {
    id: string;
    name: string;
    level: 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto';
}
export interface CVData {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
}

================================================
📄 ARCHIVO: utils\pdfGenerator.ts
================================================

import { CVData } from '../types/cv.types';

// 🟢 1. Se exporta la función para que pueda ser utilizada tanto por la pantalla visual como por el archivo de pruebas.
export const generateCVHtml = (cvData: CVData) => {
    const { personalInfo, experiences, education, skills } = cvData;

    return `
        <html>
            <head>
                <style>
                    body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
                    .header { border-bottom: 2px solid #C41E3A; padding-bottom: 10px; margin-bottom: 20px; }
                    .name { font-size: 28px; font-weight: bold; color: #000; margin: 0; }
                    .section-title { color: #C41E3A; font-size: 18px; font-weight: bold; margin-top: 20px; text-transform: uppercase; }
                    .item { margin-bottom: 15px; }
                    .item-title { font-weight: bold; font-size: 14px; }
                    .item-date { color: #666; font-size: 12px; }
                    .skill-list { display: flex; flex-wrap: wrap; gap: 10px; }
                    .skill-item { background: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 12px; border: 1px solid #ccc; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 class="name">${personalInfo.fullName || 'Sin Nombre'}</h1>
                    <p>${personalInfo.email} | ${personalInfo.phone}</p>
                    <p>${personalInfo.location}</p>
                </div>

                <div class="section-title">Resumen Profesional</div>
                <p>${personalInfo.summary || 'Sin resumen disponible.'}</p>

                <div class="section-title">Experiencia Laboral</div>
                ${experiences.map(exp => `
                    <div class="item">
                        <div class="item-title">${exp.position} - ${exp.company}</div>
                        <div class="item-date">${exp.startDate} - ${exp.endDate || 'Actual'}</div>
                        <p>${exp.description || ''}</p>
                    </div>
                `).join('')}

                <div class="section-title">Educación</div>
                ${education.map(edu => `
                    <div class="item">
                        <div class="item-title">${edu.degree} en ${edu.field}</div>
                        <div class="item-date">${edu.institution} (${edu.graduationYear})</div>
                    </div>
                `).join('')}

                <div class="section-title">Habilidades Técnicas</div>
                <div class="skill-list">
                    ${skills.map(skill => `<span class="skill-item">${skill.name} (${skill.level})</span>`).join('')}
                </div>
            </body>
        </html>
    `;
};