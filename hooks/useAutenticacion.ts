import { useState, useEffect } from 'react';
import { servicioAutenticacion } from '@/servicios/autenticacion';
import { RespuestaLogin } from '@/tipos';

export const useAutenticacion = () => {
  const [cargando, setCargando] = useState(false);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    verificarAutenticacion();
  }, []);

  const verificarAutenticacion = async () => {
    try {
      const autenticado = await servicioAutenticacion.estaAutenticado();
      setEstaAutenticado(autenticado);
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
      setCargando(true);
      await servicioAutenticacion.cerrarSesion();
      setEstaAutenticado(false);
    } catch (err) {
      setError('Error al cerrar sesión');
    } finally {
      setCargando(false);
    }
  };

  return {
    cargando,
    estaAutenticado,
    error,
    registrarse,
    iniciarSesion,
    cerrarSesion,
    verificarAutenticacion,
  };
};
