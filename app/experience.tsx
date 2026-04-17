import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "../src/theme";

// 🟢 1. IMPORTAMOS LAS HERRAMIENTAS NUEVAS
import { useForm, Controller } from "react-hook-form";
import { DatePickerField } from "../components/DatePickerField"; // Nuestro calendario

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  // 🟢 2. CONFIGURAMOS EL FORMULARIO (Eliminamos el viejo useState)
  const { control, handleSubmit, formState: { errors }, reset } = useForm<Omit<Experience, "id">>({
    defaultValues: {
      company: "", position: "", startDate: "", endDate: "", description: ""
    }
  });

  // 🟢 3. GUARDAR EXPERIENCIA (React Hook Form ya verificó que no hay errores)
  const onSubmit = (data: Omit<Experience, "id">) => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      ...data,
    };
    addExperience(newExperience);
    
    // Limpiamos el formulario para agregar otra
    reset({ company: "", position: "", startDate: "", endDate: "", description: "" });
    Alert.alert("Éxito", "Experiencia agregada correctamente");
  };

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

        {/* 🟢 INPUT DE EMPRESA */}
        <Controller
          control={control}
          name="company"
          rules={{ 
            required: "La empresa es obligatoria",
            // 🟢 NUEVO: Solo letras
            pattern: {
              value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
              message: "Solo se permiten letras"
            }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Empresa *"
              placeholder="Nombre de la empresa"
              value={value}
              onChangeText={(text) => onChange(text.replace(/[0-9]/g, ''))} // 🟢 NUEVO: Bloquea números al escribir
              error={errors.company?.message}
            />
          )}
        />

        {/* 🟢 INPUT DE CARGO */}
        <Controller
          control={control}
          name="position"
          rules={{ 
            required: "El cargo es obligatorio",
            // 🟢 NUEVO: Solo letras
            pattern: {
              value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
              message: "Solo se permiten letras"
            }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Cargo *"
              placeholder="Tu posición"
              value={value}
              onChangeText={(text) => onChange(text.replace(/[0-9]/g, ''))} // 🟢 NUEVO: Bloquea números
              error={errors.position?.message}
            />
          )}
        />

        {/* 🟢 AQUÍ USAMOS NUESTRO NUEVO CALENDARIO PARA FECHA DE INICIO */}
        <Controller
          control={control}
          name="startDate"
          rules={{ required: "La fecha de inicio es obligatoria" }}
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              label="Fecha de Inicio *"
              placeholder="Toca para elegir una fecha"
              value={value} // El valor que se muestra en pantalla
              onChangeText={onChange} // Guarda la fecha cuando se elige
              error={errors.startDate?.message}
            />
          )}
        />

        {/* 🟢 CALENDARIO PARA FECHA DE FIN (Este no es obligatorio) */}
        <Controller
          control={control}
          name="endDate"
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              label="Fecha de Fin"
              placeholder="Déjalo vacío si es tu trabajo actual"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        {/* 🟢 INPUT DE DESCRIPCIÓN */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Descripción"
              placeholder="Describe tus responsabilidades..."
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
            />
          )}
        />

        {/* 🟢 EL BOTÓN EJECUTA handleSubmit DE REACT HOOK FORM */}
        <NavigationButton title="Agregar Experiencia" onPress={handleSubmit(onSubmit)} />

        {/* LISTA DE EXPERIENCIAS YA AGREGADAS (Esto se mantiene igual) */}
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
