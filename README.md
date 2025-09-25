# Todo-App (Backend)

Backend para gestionar tareas (“to-do”) y usuarios, desarrollado con Node.js, Express y TypeScript.  
Se implementa lógica de CRUD para tareas y gestión de usuarios, usando MySQL como base de datos preferencial a través de Prisma ORM.

## Características

- Endpoints REST para crear, listar, actualizar y eliminar tareas.
- Sistema de **autenticación con login** y protección de rutas mediante JWT.
- Validación y manejo robusto de errores.
- Organización modular: controladores, rutas, modelos, configuración.
- Tipado fuerte con TypeScript.
- Compatible con desarrollo ágil usando `nodemon` y compilación de TS.

## Tecnologías

- **Node.js** — entorno de ejecución del backend.
- **Express** — framework para manejo de rutas y middleware.
- **TypeScript** — tipado estático y compilación a JavaScript.
- **Prisma / @prisma/client** — ORM y cliente para la base de datos.
- **bcrypt** — hashing de contraseñas.
- **jsonwebtoken** — generación y verificación de JWT.
- **express-validator** — validación de datos en rutas.
- **Jest / ts-jest** — pruebas unitarias y de integración.
- **swagger-jsdoc / swagger-ui-express** — documentación de API con OpenAPI.
- **dotenv** — manejo de variables de entorno.

## Estructura del proyecto

├── src  
│ ├── **tests**
│ ├── config
│ ├── controllers  
│ ├── db
│ ├── docs
│ ├── helpers
│ ├── interfaces
│ ├── middlewares
│ ├── routes  
│ ├── schemas  
│ ├── services
│ ├── prisma.ts
│ ├── server.ts
│ └── app.ts (punto de entrada)  
├── prisma (o carpeta de migraciones / esquema de BD)  
├── jest.config.ts  
├── tsconfig.json  
├── package.json  
├── nodemon.json  
└── .gitignore

## Instalación & puesta en marcha

1. Clonar el repositorio.
2. Ejecutar `npm install` o `yarn` para instalar dependencias.
3. Configurar variables de entorno (nombre del archivo `.env`, con claves como DB_URL, puerto, etc.).
4. Compilar TypeScript:
   ```bash
   npm run build
   ```
5. Para desarrollo con autorecarga:
   ```bash
   npm run dev
   ```
6. Para producción:
   ```bash
   npm start
   ```

## Endpoints (API)

| Método | Ruta                             | Función                          | Descripción                                                                           |
| ------ | -------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| GET    | `/api/users`                     | listar todos los usuarios        | Devuelve arreglo de usuarios                                                          |
| POST   | `/api/users`                     | crear nuevo usuario              | Recibe datos de usuario en el cuerpo                                                  |
| POST   | `/api/auth/login`                | inicia sesión                    | El usuario se autentica correctamente y recibe un token JWT junto con su información. |
| PUT    | `/api/users/:id`                 | actualizar usuario existente     | Actualiza con los campos enviados                                                     |
| PUT    | `/api/users/update-password/:id` | actualizar contraseña de usuario | Actualiza con los campos enviados                                                     |
| DELETE | `/api/users/:id`                 | borrar usuario                   | Elimina el usuario por su identificador                                               |

## Variables de entorno necesarias

- `PORT` — puerto en el que correrá el servidor
- `DATABASE_URL` — cadena de conexión a la BD

## Pruebas

- Ejecutar pruebas con:
  ```bash
  npm test
  ```
