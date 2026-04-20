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