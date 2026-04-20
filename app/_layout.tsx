import { Stack } from 'expo-router';
import { CVProvider } from '../context/CVContext';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <CVProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary.red,
          },
          headerTintColor: colors.header.tint,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >

        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Crear CV', 
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="personal-info" 
          options={{ 
            title: 'Información Personal', 
          }} 
        />
        <Stack.Screen 
          name="experience" 
          options={{ 
            title: 'Información Laboral', 
          }} 
        />
        <Stack.Screen 
          name="education" 
          options={{ 
            title: 'Educación', 
          }} 
        />
        <Stack.Screen 
          name="skills" 
          options={{ 
            title: 'Habilidades', 
          }} 
        />
        <Stack.Screen 
          name="preview" 
          options={{ 
            title: 'Vista Previa', 
            presentation: 'modal',
          }} 
        />
      </Stack>

    </CVProvider>
  );
};