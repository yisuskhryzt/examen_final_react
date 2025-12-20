import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { servicioImagenes } from '@/servicios/imagenes';

export const useImagenes = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seleccionarImagen = async (): Promise<string | null> => {
    try {
      const permisoResultado = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permisoResultado.granted) {
        setError('Se necesita permiso para acceder a las imágenes');
        return null;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!resultado.canceled) {
        return resultado.assets[0].uri;
      }

      return null;
    } catch (err) {
      setError('Error al seleccionar la imagen');
      return null;
    }
  };

  const tomarFoto = async (): Promise<string | null> => {
    try {
      const permisoResultado = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permisoResultado.granted) {
        setError('Se necesita permiso para usar la cámara');
        return null;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!resultado.canceled) {
        return resultado.assets[0].uri;
      }

      return null;
    } catch (err) {
      setError('Error al tomar la foto');
      return null;
    }
  };

  const subirImagen = async (uri: string): Promise<string | null> => {
    try {
      setCargando(true);
      setError(null);
      const urlImagen = await servicioImagenes.subirImagen(uri);
      return urlImagen;
    } catch (err: any) {
      const mensajeError = err.response?.data?.detail || 'Error al subir la imagen';
      setError(mensajeError);
      return null;
    } finally {
      setCargando(false);
    }
  };

  return {
    cargando,
    error,
    seleccionarImagen,
    tomarFoto,
    subirImagen,
  };
};
