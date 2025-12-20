import clienteApi from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CLAVE_TOKEN } from '@/constantes';
import { RespuestaLogin } from '@/tipos';
import { logs } from './logs';

export const servicioAutenticacion = {
  async registrarse(email: string, contraseña: string): Promise<RespuestaLogin> {
    logs.info('Iniciando registro de usuario', { email });
    
    const payload = {
      email,
      password: contraseña,
    };

    const { data } = await clienteApi.post<RespuestaLogin>('/auth/register', payload);

    await AsyncStorage.setItem(CLAVE_TOKEN, data.data.token);
    logs.info('Usuario registrado exitosamente', { userId: data.data.userId });
    return data;
  },

  async iniciarSesion(email: string, contraseña: string): Promise<RespuestaLogin> {
    logs.info('Iniciando sesión', { email });
    
    const payload = {
      email,
      password: contraseña,
    };

    const { data } = await clienteApi.post<RespuestaLogin>('/auth/login', payload);

    await AsyncStorage.setItem(CLAVE_TOKEN, data.data.token);
    logs.info('Sesión iniciada exitosamente', { userId: data.data.userId });
    return data;
  },

  async cerrarSesion(): Promise<void> {
    logs.info('Cerrando sesión');
    await AsyncStorage.removeItem(CLAVE_TOKEN);
    logs.info('Token eliminado, sesión cerrada');
  },

  async obtenerToken(): Promise<string | null> {
    return await AsyncStorage.getItem(CLAVE_TOKEN);
  },

  async estaAutenticado(): Promise<boolean> {
    const token = await AsyncStorage.getItem(CLAVE_TOKEN);
    return token !== null;
  },
};
