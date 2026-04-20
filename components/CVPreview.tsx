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
