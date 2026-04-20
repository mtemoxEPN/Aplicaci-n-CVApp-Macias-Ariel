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