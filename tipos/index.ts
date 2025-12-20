export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface Tarea {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  photoUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RespuestaLogin {
  success: boolean;
  data: {
    token: string;
    userId: string;
  };
}

export interface CrearTarea {
  title: string;
  completed?: boolean;
  photoUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface ActualizarTarea {
  title?: string;
  completed?: boolean;
  photoUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface RespuestaImagen {
  success: boolean;
  data: {
    url: string;
    key: string;
    size: number;
    contentType: string;
  };
}

export interface RespuestaTareas {
  success: boolean;
  data: Tarea[];
  count: number;
}

export interface RespuestaTarea {
  success: boolean;
  data: Tarea;
}
