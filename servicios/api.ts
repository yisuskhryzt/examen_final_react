import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_API, CLAVE_TOKEN } from '@/constantes';
import { logs } from './logs';

const clienteApi = axios.create({
  baseURL: URL_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

clienteApi.interceptors.request.use(
  async (configuracion) => {
    const token = await AsyncStorage.getItem(CLAVE_TOKEN);
    if (token) {
      configuracion.headers.Authorization = `Bearer ${token}`;
    }
    
    logs.request(
      configuracion.method?.toUpperCase() || 'GET',
      configuracion.url || '',
      configuracion.data
    );
    
    return configuracion;
  },
  (error) => {
    logs.error('Error en request interceptor', error);
    return Promise.reject(error);
  }
);

clienteApi.interceptors.response.use(
  (respuesta) => {
    logs.response(
      respuesta.config.url || '',
      respuesta.status,
      respuesta.data
    );
    return respuesta;
  },
  async (error) => {
    logs.error(
      `Error en respuesta: ${error.config?.url}`,
      {
        estado: error.response?.status,
        mensaje: error.response?.data?.detail || error.message,
        data: error.response?.data
      }
    );
    
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(CLAVE_TOKEN);
    }
    return Promise.reject(error);
  }
);

export default clienteApi;
