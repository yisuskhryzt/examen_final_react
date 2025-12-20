import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { servicioAutenticacion } from '@/servicios/autenticacion';
import { RespuestaLogin } from '@/tipos';

interface ContextoAutenticacion {
  cargando: boolean;
  estaAutenticado: boolean;
  error: string | null;
  emailUsuario: string | null;
  registrarse: (email: string, contraseña: string) => Promise<RespuestaLogin | null>;
  iniciarSesion: (email: string, contraseña: string) => Promise<RespuestaLogin | null>;
  cerrarSesion: () => Promise<void>;
  verificarAutenticacion: () => Promise<void>;
}

const AutenticacionContext = createContext<ContextoAutenticacion | undefined>(undefined);

export const ProveedorAutenticacion = ({ children }: { children: ReactNode }) => {
  const [cargando, setCargando] = useState(false);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailUsuario, setEmailUsuario] = useState<string | null>(null);

  useEffect(() => {
    verificarAutenticacion();
  }, []);

  const verificarAutenticacion = async () => {
    try {
      const autenticado = await servicioAutenticacion.estaAutenticado();
      setEstaAutenticado(autenticado);
      if (autenticado) {
        const email = await AsyncStorage.getItem('@email_usuario');
        setEmailUsuario(email);
      }
    } catch (err) {
      setEstaAutenticado(false);
    }
  };

  const registrarse = async (email: string, contraseña: string): Promise<RespuestaLogin | null> => {
    try {
      setCargando(true);
      setError(null);
      const resultado = await servicioAutenticacion.registrarse(email, contraseña);
      setEstaAutenticado(true);
      await AsyncStorage.setItem('@email_usuario', email);
      setEmailUsuario(email);
      return resultado;
    } catch (err: any) {
      const mensajeError = err.response?.data?.detail || 'Error al registrarse';
      setError(mensajeError);
      return null;
    } finally {
      setCargando(false);
    }
  };

  const iniciarSesion = async (email: string, contraseña: string): Promise<RespuestaLogin | null> => {
    try {
      setCargando(true);
      setError(null);
      const resultado = await servicioAutenticacion.iniciarSesion(email, contraseña);
      setEstaAutenticado(true);
      await AsyncStorage.setItem('@email_usuario', email);
      setEmailUsuario(email);
      return resultado;
    } catch (err: any) {
      const mensajeError = err.response?.data?.detail || 'Error al iniciar sesión';
      setError(mensajeError);
      return null;
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      console.log('Context: Iniciando cierre de sesión');
      setCargando(true);
      await servicioAutenticacion.cerrarSesion();
      await AsyncStorage.removeItem('@email_usuario');
      console.log('Context: Token eliminado, actualizando estado');
      setEstaAutenticado(false);
      setEmailUsuario(null);
      setError(null);
      console.log('Context: Estado actualizado, estaAutenticado=false');
    } catch (err) {
      console.error('Context: Error al cerrar sesión', err);
      setError('Error al cerrar sesión');
      setEstaAutenticado(false);
      setEmailUsuario(null);
    } finally {
      setCargando(false);
    }
  };

  return (
    <AutenticacionContext.Provider
      value={{
        cargando,
        estaAutenticado,
        error,
        emailUsuario,
        registrarse,
        iniciarSesion,
        cerrarSesion,
        verificarAutenticacion,
      }}
    >
      {children}
    </AutenticacionContext.Provider>
  );
};

export const useAutenticacion = () => {
  const contexto = useContext(AutenticacionContext);
  if (contexto === undefined) {
    throw new Error('useAutenticacion debe usarse dentro de un ProveedorAutenticacion');
  }
  return contexto;
};
