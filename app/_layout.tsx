import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ProveedorAutenticacion, useAutenticacion } from '@/contextos/AutenticacionContext';

function RootLayoutNav() {
  const { estaAutenticado } = useAutenticacion();
  const segmentos = useSegments();
  const router = useRouter();

  useEffect(() => {
    const enRutaAutenticada = segmentos[0] === '(autenticado)';
    
    console.log('Navigation check:', { estaAutenticado, enRutaAutenticada, segmentos });

    if (!estaAutenticado && enRutaAutenticada) {
      console.log('Redirigiendo a login');
      router.replace('/login');
    } else if (estaAutenticado && !enRutaAutenticada) {
      console.log('Redirigiendo a tareas');
      router.replace('/(autenticado)/tareas');
    }
  }, [estaAutenticado, segmentos]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="registro" />
      <Stack.Screen name="(autenticado)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ProveedorAutenticacion>
      <RootLayoutNav />
    </ProveedorAutenticacion>
  );
}
