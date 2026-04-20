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

