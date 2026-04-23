// app/photo.tsx

import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";
import { NavigationButton } from "../components/NavigationButton";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from "../src/theme";
import { Ionicons } from '@expo/vector-icons'; // 🟢 Usamos Expo Icons en lugar de Emojis

export default function PhotoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    cvData.personalInfo.profileImage
  );

  // 📷 Tomar foto con la cámara
  const takePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

      if (!cameraPermission.granted) {
        Alert.alert("Permiso Denegado", "Necesitamos acceso a tu cámara para tomar fotos.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1], // Cuadrado perfecto
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la cámara");
      console.error(error);
    }
  };

  // 🖼️ Seleccionar de la galería
  const pickImage = async () => {
    try {
      const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!galleryPermission.granted) {
        Alert.alert("Permiso Denegado", "Necesitamos acceso a tu galería para seleccionar fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // 🟢 Actualizado a la sintaxis moderna
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la galería");
      console.error(error);
    }
  };

  // 💾 Guardar la foto
  const handleSave = () => {
    updatePersonalInfo({
      ...cvData.personalInfo,
      profileImage: selectedImage,
    });
    Alert.alert("Éxito", "Foto guardada correctamente", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  // 🗑️ Eliminar foto
  const handleRemove = () => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar la foto de perfil?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setSelectedImage(undefined);
          updatePersonalInfo({
            ...cvData.personalInfo,
            profileImage: undefined,
          });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Foto de Perfil</Text>

      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="person" size={60} color={colors.ui.textSecondary} />
            <Text style={styles.placeholderText}>Sin foto</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <Ionicons name="camera" size={24} color={colors.ui.surface} />
          <Text style={styles.actionButtonText}>Tomar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.galleryButton]} onPress={pickImage}>
          <Ionicons name="images" size={24} color={colors.ui.surface} />
          <Text style={styles.actionButtonText}>Seleccionar de Galería</Text>
        </TouchableOpacity>

        {selectedImage && (
          <TouchableOpacity style={[styles.actionButton, styles.removeButton]} onPress={handleRemove}>
            <Ionicons name="trash" size={24} color={colors.ui.surface} />
            <Text style={styles.actionButtonText}>Eliminar Foto</Text>
          </TouchableOpacity>
        )}
      </View>

      <NavigationButton title="Guardar Foto" onPress={handleSave} />
      <NavigationButton title="Cancelar" onPress={() => router.back()} variant="secondary" />
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
    paddingBottom: spacing['4xl'],
  },
  title: {
    fontSize: fontSize.title1,
    fontWeight: fontWeight.bold,
    color: colors.ui.textPrimary,
    marginBottom: spacing['2xl'],
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: spacing['3xl'],
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.primary.blue,
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.neutral.gray200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.ui.border,
  },
  placeholderText: {
    color: colors.ui.textSecondary,
    fontSize: fontSize.body,
    marginTop: spacing.sm,
  },
  buttonContainer: {
    marginBottom: spacing['2xl'],
    gap: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.primary.blue,
    padding: spacing.lg,
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.card,
  },
  galleryButton: {
    backgroundColor: colors.neutral.gray700,
  },
  removeButton: {
    backgroundColor: colors.ui.error,
  },
  actionButtonText: {
    color: colors.ui.surface,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
});