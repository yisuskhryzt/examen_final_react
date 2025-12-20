import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SectionList,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTareas } from '@/hooks/useTareas';
import { useAutenticacion } from '@/contextos/AutenticacionContext';
import { useTema } from '@/hooks/useTema';
import { Tarea } from '@/tipos';

export default function TareasScreen() {
  const router = useRouter();
  const { colores } = useTema();
  const { tareas, cargando, eliminarTarea, cambiarEstadoTarea, cargarTareas } = useTareas();
  const { cerrarSesion, emailUsuario } = useAutenticacion();

  useFocusEffect(
    useCallback(() => {
      cargarTareas();
    }, [cargarTareas])
  );

  const tareasNoCompletadas = tareas.filter(t => !t.completed);
  const tareasCompletadas = tareas.filter(t => t.completed);

  const secciones = [
    {
      titulo: 'No Completadas',
      data: tareasNoCompletadas,
    },
    {
      titulo: 'Completadas',
      data: tareasCompletadas,
    },
  ].filter(seccion => seccion.data.length > 0);

  const manejarEliminar = (id: string) => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const exito = await eliminarTarea(id);
            if (exito) {
              Alert.alert('Éxito', 'Tarea eliminada correctamente');
            }
          },
        },
      ]
    );
  };

  const manejarCambiarEstado = async (id: string, completada: boolean) => {
    await cambiarEstadoTarea(id, !completada);
  };

  const estilos = crearEstilos(colores);

  const manejarCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await cerrarSesion();
          },
        },
      ]
    );
  };

  const renderizarTarea = ({ item }: { item: Tarea }) => (
    <View style={estilos.tarjeta}>
      <TouchableOpacity
        style={estilos.checkbox}
        onPress={() => manejarCambiarEstado(item.id, item.completed)}
      >
        <View style={[estilos.checkboxCirculo, item.completed && estilos.checkboxMarcado]}>
          {item.completed && <Text style={estilos.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={estilos.contenidoTarea}>
        <Text style={[estilos.titulo, item.completed && estilos.tituloCompletado]}>
          {item.title}
        </Text>
        
        {item.location && (
          <Text style={estilos.ubicacion}>
            📍 Lat: {item.location.latitude.toFixed(4)}, Lon: {item.location.longitude.toFixed(4)}
          </Text>
        )}
        
        {item.photoUri && (
          <Image source={{ uri: item.photoUri }} style={estilos.imagen} />
        )}
      </View>

      <View style={estilos.acciones}>
        <TouchableOpacity
          onPress={() => router.push(`/(autenticado)/editar-tarea/${item.id}`)}
          style={estilos.botonEditar}
        >
          <Text style={estilos.textoBotonEditar}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => manejarEliminar(item.id)}
          style={estilos.botonEliminar}
        >
          <Text style={estilos.textoBotonEliminar}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.encabezado}>
        {emailUsuario && (
          <Text style={estilos.textoEmail}>{emailUsuario}</Text>
        )}
        <TouchableOpacity
          style={estilos.botonCerrarSesion}
          onPress={manejarCerrarSesion}
        >
          <Text style={estilos.textoBotonCerrarSesion}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {cargando && tareas.length === 0 ? (
        <View style={estilos.centroCargando}>
          <ActivityIndicator size="large" color={colores.primario} />
        </View>
      ) : (
        <SectionList
          sections={secciones}
          renderItem={({ item }) => renderizarTarea({ item })}
          renderSectionHeader={({ section: { titulo } }) => (
            <View style={estilos.encabezadoSeccion}>
              <Text style={estilos.tituloSeccion}>{titulo}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={estilos.lista}
          refreshControl={
            <RefreshControl refreshing={cargando} onRefresh={cargarTareas} />
          }
          ListEmptyComponent={
            <View style={estilos.vacio}>
              <Text style={estilos.textoVacio}>No hay tareas</Text>
              <Text style={estilos.subtextoVacio}>Crea una nueva tarea para comenzar</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={estilos.botonFlotante}
        onPress={() => router.push('/(autenticado)/crear-tarea')}
      >
        <Text style={estilos.textoBotonFlotante}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const crearEstilos = (colores: any) => StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  encabezado: {
    padding: 16,
    backgroundColor: colores.fondoTarjeta,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoEmail: {
    fontSize: 14,
    color: colores.texto,
    fontWeight: '500',
  },
  botonCerrarSesion: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colores.error,
    borderRadius: 8,
  },
  textoBotonCerrarSesion: {
    color: '#fff',
    fontWeight: '600',
  },
  lista: {
    padding: 16,
  },
  encabezadoSeccion: {
    backgroundColor: colores.fondo,
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: '700',
    color: colores.texto,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tarjeta: {
    backgroundColor: colores.fondoTarjeta,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: colores.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkboxCirculo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colores.primario,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxMarcado: {
    backgroundColor: colores.primario,
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contenidoTarea: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: colores.texto,
  },
  tituloCompletado: {
    textDecorationLine: 'line-through',
    color: colores.textoTerciario,
  },
  ubicacion: {
    fontSize: 13,
    color: colores.textoSecundario,
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    color: colores.textoSecundario,
    marginBottom: 8,
  },
  imagen: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  acciones: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  botonEditar: {
    padding: 8,
    marginRight: 4,
  },
  textoBotonEditar: {
    fontSize: 20,
  },
  botonEliminar: {
    padding: 8,
  },
  textoBotonEliminar: {
    fontSize: 20,
  },
  botonFlotante: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colores.primario,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colores.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  textoBotonFlotante: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
  },
  centroCargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  textoVacio: {
    fontSize: 18,
    color: colores.textoTerciario,
    marginBottom: 8,
  },
  subtextoVacio: {
    fontSize: 14,
    color: colores.textoTerciario,
  },
});
