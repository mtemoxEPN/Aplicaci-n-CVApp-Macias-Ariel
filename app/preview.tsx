// app/preview.tsx

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useCVContext } from '../context/CVContext';
import { CVPreview } from '@/components/CVPreview';
import { NavigationButton } from '../components/NavigationButton';
import { generateCVHtml } from '../utils/pdfGenerator';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function PreviewScreen() {
    // 🟢 AQUÍ ESTÁ LA CLAVE: Estamos jalando los datos actualizados del contexto global
    const { cvData } = useCVContext();

    const handleExportPDF = async () => {
        try {
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
            {/* 🟢 Le pasamos esos datos actualizados (que ya deberían incluir la foto) al componente visual */}
            <CVPreview cvData={cvData} />
            
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