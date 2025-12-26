# Aplicación de Tareas - React Native

Aplicación móvil desarrollada con React Native y Expo que permite gestionar tareas personales con autenticación y almacenamiento en la nube.

## Descripción del Proyecto

Esta aplicación móvil permite a los usuarios registrar, visualizar, editar y eliminar tareas de manera intuitiva. Toda la información se almacena en un servidor remoto y se mantiene sincronizada en tiempo real. Los usuarios pueden añadir imágenes a sus tareas capturándolas directamente desde la cámara del dispositivo o seleccionándolas desde la galería.

## Características Principales

- Autenticación de usuarios con persistencia de sesión
- Creación, lectura, actualización y eliminación de tareas
- Adjuntar imágenes desde la cámara o galería del dispositivo
- Sincronización automática con el servidor
- Interfaz moderna y responsive
- Manejo de estados de carga y errores

## Tecnologías Utilizadas

- React Native
- Expo
- TypeScript
- Expo Router (navegación)
- AsyncStorage (persistencia local del token)
- Axios (peticiones HTTP)
- Expo Image Picker (captura de imágenes)

## Integrantes del Equipo

- Ignacio Riveros
- Ethan Duran
- Andrés Corbacho
- Jesús Flores

## Estructura del Proyecto

```
examen_final_react/
├── app/                          # Pantallas y navegación con Expo Router
│   ├── (autenticado)/           # Rutas protegidas
│   │   ├── tareas.tsx           # Lista de tareas
│   │   ├── crear-tarea.tsx      # Formulario para crear tarea
│   │   └── editar-tarea/[id].tsx # Formulario para editar tarea
│   ├── _layout.tsx              # Layout principal con protección de rutas
│   ├── index.tsx                # Pantalla inicial
│   └── login.tsx                # Pantalla de inicio de sesión
├── hooks/                        # Custom hooks
│   ├── useAutenticacion.ts      # Lógica de autenticación
│   ├── useTareas.ts             # Lógica de gestión de tareas
│   └── useImagenes.ts           # Lógica de manejo de imágenes
├── servicios/                    # Servicios de API
│   ├── api.ts                   # Cliente HTTP configurado
│   ├── autenticacion.ts         # Servicios de autenticación
│   ├── tareas.ts                # Servicios de tareas
│   └── imagenes.ts              # Servicios de imágenes
├── tipos/                        # Definiciones de tipos TypeScript
│   └── index.ts
├── constantes/                   # Constantes de la aplicación
│   └── index.ts
├── .env                          # Variables de entorno
├── app.json                      # Configuración de Expo
├── package.json                  # Dependencias del proyecto
└── tsconfig.json                 # Configuración de TypeScript
```

## Uso de Inteligencia Artificial

Durante el desarrollo de este proyecto se utilizaron herramientas de inteligencia artificial como asistentes de código para:

- Optimizar la estructura y arquitectura del proyecto
- Resolver problemas técnicos específicos de React Native y Expo
- Generar código base para componentes y servicios
- Revisar y mejorar la calidad del código
- Documentar funciones y componentes

El uso de IA permitió acelerar el desarrollo y mantener buenas prácticas de programación, aunque todo el código fue revisado, comprendido y adaptado manualmente por el equipo.

## Instrucciones de Ejecución

### Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI instalado globalmente
- Un dispositivo móvil con la app Expo Go o un emulador

### Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd examen_final_react
```

2. Instalar las dependencias:
```bash
npm install
```

3. Configurar las variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con:
```
EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl
```

### Ejecución

1. Iniciar el servidor de desarrollo:
```bash
npm start
```

2. Escanear el código QR con la aplicación Expo Go en tu dispositivo móvil, o presionar:
   - `a` para abrir en emulador Android
   - `i` para abrir en simulador iOS
   - `w` para abrir en navegador web

### Credenciales de Prueba

Para probar la aplicación, puedes registrarte en el sistema o utilizar las credenciales de prueba proporcionadas por el backend.

## Funcionalidades Detalladas

### Autenticación

- Inicio de sesión con email y contraseña
- Almacenamiento seguro del token en AsyncStorage
- Redirección automática según el estado de autenticación
- Cierre de sesión con eliminación del token

### Gestión de Tareas

- **Listar tareas**: Visualización de todas las tareas del usuario autenticado
- **Crear tarea**: Formulario con título, descripción e imagen opcional
- **Editar tarea**: Modificación de tareas existentes
- **Eliminar tarea**: Eliminación con confirmación
- **Marcar como completada**: Cambio de estado con un toque

### Manejo de Imágenes

- Captura de fotos con la cámara del dispositivo
- Selección de imágenes desde la galería
- Subida automática al servidor
- Visualización de imágenes en las tareas

## API Backend

La aplicación se conecta al backend disponible en:
**https://todo-list.dobleb.cl/docs**

Endpoints utilizados:
- `POST /auth/login` - Autenticación
- `GET /todos` - Obtener tareas
- `POST /todos` - Crear tarea
- `PATCH /todos/{id}` - Actualizar tarea
- `DELETE /todos/{id}` - Eliminar tarea
- `POST /images` - Subir imagen

## Notas Importantes

- No se almacenan tareas localmente, toda la información proviene del backend
- El token de autenticación se persiste localmente para mantener la sesión
- Las imágenes se suben al servidor antes de asociarse a una tarea
- La aplicación maneja errores HTTP comunes (401, 403, 500)

## Mejoras Futuras

- Implementar búsqueda y filtrado de tareas
- Añadir categorías o etiquetas a las tareas
- Implementar notificaciones push
- Modo offline con sincronización posterior
- Compartir tareas entre usuarios
