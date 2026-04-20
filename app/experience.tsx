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