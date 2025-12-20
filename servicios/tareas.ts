import clienteApi from './api';
import { Tarea, CrearTarea, ActualizarTarea, RespuestaTareas, RespuestaTarea } from '@/tipos';

export const servicioTareas = {
  async obtenerTareas(): Promise<Tarea[]> {
    const { data } = await clienteApi.get<RespuestaTareas>('/todos');
    return data.data;
  },

  async crearTarea(tarea: CrearTarea): Promise<Tarea> {
    const { data } = await clienteApi.post<RespuestaTarea>('/todos', tarea);
    return data.data;
  },

  async actualizarTarea(id: string, tarea: ActualizarTarea): Promise<Tarea> {
    const { data } = await clienteApi.patch<RespuestaTarea>(`/todos/${id}`, tarea);
    return data.data;
  },

  async eliminarTarea(id: string): Promise<void> {
    await clienteApi.delete(`/todos/${id}`);
  },
};
