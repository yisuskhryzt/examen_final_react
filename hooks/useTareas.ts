import { useState, useEffect, useCallback } from 'react';
import { servicioTareas } from '@/servicios/tareas';
import { Tarea, CrearTarea, ActualizarTarea } from '@/tipos';

export const useTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarTareas = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const resultado = await servicioTareas.obtenerTareas();
      setTareas(resultado);
    } catch (err: any) {
      const mensajeError = err.response?.data?.detail || 'Error al cargar las tareas';
      setError(mensajeError);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarTareas();
  }, [cargarTareas]);

  const crearTarea = async (nuevaTarea: CrearTarea): Promise<boolean> => {
    try {
      setCargando(true);
      setError(null);
      const tareaCreada = await servicioTareas.crearTarea(nuevaTarea);
      setTareas((prev) => [...prev, tareaCreada]);
      return true;
    } catch (err: any) {
      const mensajeError = err.response?.data?.detail || 'Error al crear la tarea';
      setError(mensajeError);
      return false;
    } finally {
      setCargando(false);
    }
  };

  const actualizarTarea = async (id: string, datosActualizados: ActualizarTarea): Promise<boolean> => {
    try {
      setCargando(true);
      setError(null);
      const tareaActualizada = await servicioTareas.actualizarTarea(id, datosActualizados);
      setTareas((prev) =>
        prev.map((tarea) => (tarea.id === id ? tareaActualizada : tarea))
      );
      return true;
    } catch (err: any) {
      const mensajeError = err.response?.data?.detail || 'Error al actualizar la tarea';
      setError(mensajeError);
      return false;
    } finally {
      setCargando(false);
    }
  };

  const eliminarTarea = async (id: string): Promise<boolean> => {
    try {
      setCargando(true);
      setError(null);
      await servicioTareas.eliminarTarea(id);
      setTareas((prev) => prev.filter((tarea) => tarea.id !== id));
      return true;
    } catch (err: any) {
      const mensajeError = err.response?.data?.detail || 'Error al eliminar la tarea';
      setError(mensajeError);
      return false;
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstadoTarea = async (id: string, completada: boolean): Promise<boolean> => {
    return await actualizarTarea(id, { completed: completada });
  };

  return {
    tareas,
    cargando,
    error,
    cargarTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstadoTarea,
  };
};
