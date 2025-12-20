import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTareas } from '@/hooks/useTareas';
import { useImagenes } from '@/hooks/useImagenes';
import { useTema } from '@/hooks/useTema';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function EditarTareaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colores } = useTema();
  const { tareas, actualizarTarea, cargando: cargandoTarea } = useTareas();
  const { seleccionarImagen, tomarFoto, subirImagen, cargando: cargandoImagen } = useImagenes();

  const [titulo, setTitulo] = useState('');
  const [ubicacion, setUbicacion] = useState<{ latitude: number; longitude: number } | null>(null);
  const [imagenUri, setImagenUri] = useState<string | null>(null);
  const [urlImagenSubida, setUrlImagenSubida] = useState<string | null>(null);
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  const [tituloInicial, setTituloInicial] = useState('');
  const [ubicacionInicial, setUbicacionInicial] = useState<{ latitude: number; longitude: number } | null>(null);
  const [urlImagenInicial, setUrlImagenInicial] = useState<string | null>(null);

  const tareaActual = tareas.find((t) => t.id === id);

  const hubocambios = 
    titulo !== tituloInicial || 
    JSON.stringify(ubicacion) !== JSON.stringify(ubicacionInicial) || 
    urlImagenSubida !== urlImagenInicial;

  useEffect(() => {
    if (tareaActual) {
      setTitulo(tareaActual.title);
      setTituloInicial(tareaActual.title);
      
      setUbicacion(tareaActual.location || null);
      setUbicacionInicial(tareaActual.location || null);
      
      if (tareaActual.photoUri) {
        setImagenUri(tareaActual.photoUri);
        setUrlImagenSubida(tareaActual.photoUri);
        setUrlImagenInicial(tareaActual.photoUri);
      }
    }
  }, [tareaActual]);

  const manejarSeleccionarImagen = async () => {
    const uri = await seleccionarImagen();
    if (uri) {
      setImagenUri(uri);
      const url = await subirImagen(uri);
      if (url) {
        setUrlImagenSubida(url);
        Alert.alert('Éxito', 'Imagen subida correctamente');
      }
    }
  };

  const manejarTomarFoto = async () => {
    const uri = await tomarFoto();
    if (uri) {
      setImagenUri(uri);
      const url = await subirImagen(uri);
      if (url) {
        setUrlImagenSubida(url);
        Alert.alert('Éxito', 'Foto subida correctamente');
      }
    }
  };

  const manejarObtenerUbicacion = async () => {
    try {
      console.log('Solicitando permiso de ubicación...');
      setObteniendoUbicacion(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Estado del permiso:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación');
        return;
      }

      console.log('Obteniendo ubicación actual...');
      const location = await Location.getCurrentPositionAsync({});
      console.log('Ubicación obtenida:', location.coords);
      
      setUbicacion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      Alert.alert('Éxito', `Ubicación obtenida:\nLat: ${location.coords.latitude.toFixed(6)}\nLon: ${location.coords.longitude.toFixed(6)}`);
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación: ' + error);
    } finally {
      setObteniendoUbicacion(false);
    }
  };

  const manejarGuardar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Campo obligatorio', 'Debe ingresar un título para la tarea');
      return;
    }

    if (!ubicacion) {
      Alert.alert('Campo obligatorio', 'Debe compartir su ubicación');
      return;
    }

    if (!urlImagenSubida) {
      Alert.alert('Campo obligatorio', 'Debe adjuntar una foto');
      return;
    }

    const exito = await actualizarTarea(id, {
      title: titulo.trim(),
      photoUri: urlImagenSubida,
      location: ubicacion,
    });

    if (exito) {
      Alert.alert('Éxito', 'Tarea actualizada correctamente', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  const manejarVolver = () => {
    if (!hubocambios) {
      router.back();
      return;
    }

    Alert.alert(
      'Descartar cambios',
      '¿Desea abandonar la edición de la tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abandonar',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const estaCargando = cargandoTarea || cargandoImagen;

  const estilos = crearEstilos(colores);

  if (!tareaActual) {
    return (
      <View style={estilos.contenedorCargando}>
        <Text>Tarea no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={estilos.contenedor}>
      <View style={estilos.formulario}>
        <Text style={estilos.etiqueta}>Título *</Text>
        <TextInput
          style={estilos.input}
          placeholder="Ingresa el título de la tarea"
          placeholderTextColor={colores.textoTerciario}
          value={titulo}
          onChangeText={setTitulo}
          editable={!estaCargando}
        />

        <Text style={estilos.etiqueta}>Ubicación *</Text>
        <TouchableOpacity
          style={[estilos.botonUbicacion, obteniendoUbicacion && estilos.botonDeshabilitado]}
          onPress={manejarObtenerUbicacion}
          disabled={obteniendoUbicacion || estaCargando}
        >
          {obteniendoUbicacion ? (
            <ActivityIndicator size="small" color={colores.primario} />
          ) : (
            <Text style={estilos.textoBotonUbicacion}>
              {ubicacion ? '✓ Ubicación obtenida' : '📍 Obtener ubicación actual'}
            </Text>
          )}
        </TouchableOpacity>
        {ubicacion && (
          <Text style={estilos.coordenadas}>
            Lat: {ubicacion.latitude.toFixed(6)}, Lon: {ubicacion.longitude.toFixed(6)}
          </Text>
        )}
        {ubicacion && (
          <MapView
            style={estilos.mapa}
            initialRegion={{
              latitude: ubicacion.latitude,
              longitude: ubicacion.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: ubicacion.latitude,
                longitude: ubicacion.longitude,
              }}
              title="Tu ubicación"
            />
          </MapView>
        )}

        <Text style={estilos.etiqueta}>Imagen *</Text>
        <View style={estilos.contenedorImagenes}>
          <TouchableOpacity
            style={estilos.botonImagen}
            onPress={manejarSeleccionarImagen}
            disabled={estaCargando}
          >
            <Text style={estilos.textoBotonImagen}>📷 Galería</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botonImagen}
            onPress={manejarTomarFoto}
            disabled={estaCargando}
          >
            <Text style={estilos.textoBotonImagen}>📸 Cámara</Text>
          </TouchableOpacity>
        </View>

        {cargandoImagen && (
          <View style={estilos.contenedorCargandoImagen}>
            <ActivityIndicator size="small" color={colores.primario} />
            <Text style={estilos.textoCargando}>Subiendo imagen...</Text>
          </View>
        )}

        {imagenUri && (
          <Image source={{ uri: imagenUri }} style={estilos.previsualizacion} />
        )}

        <TouchableOpacity
          style={[estilos.botonGuardar, estaCargando && estilos.botonDeshabilitado]}
          onPress={manejarGuardar}
          disabled={estaCargando}
        >
          {cargandoTarea ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={estilos.textoBotonGuardar}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botonCancelar}
          onPress={manejarVolver}
          disabled={estaCargando}
        >
          <Text style={estilos.textoBotonCancelar}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const crearEstilos = (colores: any) => StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  formulario: {
    padding: 20,
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colores.texto,
  },
  input: {
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: colores.inputFondo,
    color: colores.texto,
  },
  inputMultilinea: {
    height: 100,
    textAlignVertical: 'top',
  },
  contenedorImagenes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  botonImagen: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colores.fondoTarjeta,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colores.borde,
  },
  textoBotonImagen: {
    fontSize: 14,
    color: colores.texto,
  },
  contenedorCargandoImagen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginBottom: 12,
  },
  textoCargando: {
    marginLeft: 8,
    color: colores.textoSecundario,
  },
  previsualizacion: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  botonGuardar: {
    backgroundColor: colores.primario,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  botonUbicacion: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: colores.fondoTarjeta,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: 'center',
    marginBottom: 12,
  },
  textoBotonUbicacion: {
    fontSize: 14,
    color: colores.texto,
    fontWeight: '500',
  },
  coordenadas: {
    fontSize: 12,
    color: colores.textoSecundario,
    marginBottom: 8,
    textAlign: 'center',
  },
  mapa: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  textoBotonGuardar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  botonCancelar: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colores.fondoTarjeta,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  textoBotonCancelar: {
    color: colores.textoSecundario,
    fontSize: 16,
    fontWeight: '600',
  },
  contenedorCargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
