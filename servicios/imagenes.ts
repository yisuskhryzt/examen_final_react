import clienteApi from './api';
import { RespuestaImagen } from '@/tipos';

export const servicioImagenes = {
  async subirImagen(uri: string): Promise<string> {
    const nombreArchivo = uri.split('/').pop() || 'imagen.jpg';
    const tipoArchivo = nombreArchivo.split('.').pop();

    const formData = new FormData();
    formData.append('image', {
      uri,
      name: nombreArchivo,
      type: `image/${tipoArchivo}`,
    } as any);

    const { data } = await clienteApi.post<RespuestaImagen>('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data.url;
  },
};
