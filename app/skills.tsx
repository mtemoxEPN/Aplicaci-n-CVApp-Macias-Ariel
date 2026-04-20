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