import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "../src/theme";

// 🟢 1. IMPORTAMOS REACT HOOK FORM
import { useForm, Controller } from "react-hook-form";

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  // 🟢 2. CONFIGURAMOS EL FORMULARIO
  const { control, handleSubmit, formState: { errors }, reset } = useForm<Omit<Education, "id">>({
    defaultValues: {
      institution: "", degree: "", field: "", graduationYear: ""
    }
  });

  const onSubmit = (data: Omit<Education, "id">) => {
    const newEducation: Education = {
      id: Date.now().toString(),
      ...data,
    };
    addEducation(newEducation);
    reset({ institution: "", degree: "", field: "", graduationYear: "" });
    Alert.alert("Éxito", "Educación agregada correctamente");
  };

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

        {/* 🟢 INPUT DE INSTITUCIÓN (Solo letras) */}
        <Controller
          control={control}
          name="institution"
          rules={{ 
            required: "La institución es obligatoria",
            pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: "Solo se permiten letras" }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Institución *"
              placeholder="Nombre de la universidad/institución"
              value={value}
              onChangeText={(text) => onChange(text.replace(/[0-9]/g, ''))} // Bloquea números
              error={errors.institution?.message}
            />
          )}
        />

        {/* 🟢 INPUT DE TÍTULO (Solo letras) */}
        <Controller
          control={control}
          name="degree"
          rules={{ 
            required: "El título es obligatorio",
            pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: "Solo se permiten letras" }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Título/Grado *"
              placeholder="Ej: Licenciatura, Maestría"
              value={value}
              onChangeText={(text) => onChange(text.replace(/[0-9]/g, ''))} // Bloquea números
              error={errors.degree?.message}
            />
          )}
        />

        {/* 🟢 INPUT DE ÁREA DE ESTUDIO (Solo letras) */}
        <Controller
          control={control}
          name="field"
          rules={{ 
            pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: "Solo se permiten letras" }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Área de Estudio"
              placeholder="Ej: Ingeniería en Sistemas"
              value={value}
              onChangeText={(text) => onChange(text.replace(/[0-9]/g, ''))} // Bloquea números
              error={errors.field?.message}
            />
          )}
        />

        {/* 🟢 INPUT DE AÑO (Validación estricta de 4 números) */}
        <Controller
          control={control}
          name="graduationYear"
          rules={{ 
            pattern: { 
              value: /^[0-9]{4}$/, 
              message: "Debe ser un año válido de 4 dígitos" 
            },
            // 🟢 NUEVO: Validación extra para revisar que el año tenga sentido
            validate: (value) => {
              if (!value) return true; // Si lo deja vacío no hay error
              const year = parseInt(value, 10);
              if (year < 1950) return "El año no puede ser tan antiguo (mínimo 1950)";
              if (year > 2035) return "Ingresa un año válido";
              return true;
            }
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Año de Graduación"
              placeholder="Ej: 2026"
              value={value}
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))} // Bloquea letras
              maxLength={4} // Máximo 4 números
              keyboardType="numeric" // Teclado numérico
              error={errors.graduationYear?.message}
            />
          )}
        />

        <NavigationButton title="Agregar Educación" onPress={handleSubmit(onSubmit)} />

        {/* LISTA DE EDUCACIÓN AGREGADA */}
        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  <Text style={styles.cardDate}>{edu.graduationYear}</Text>
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