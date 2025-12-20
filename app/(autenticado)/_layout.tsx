import { Stack } from 'expo-router';

export default function AutenticadoLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="tareas" 
        options={{ 
          title: 'Mis Tareas',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="crear-tarea" 
        options={{ 
          title: 'Nueva Tarea',
          presentation: 'modal',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="editar-tarea/[id]" 
        options={{ 
          title: 'Editar Tarea',
          presentation: 'modal',
          headerShown: true
        }} 
      />
    </Stack>
  );
}
