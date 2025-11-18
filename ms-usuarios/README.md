ms-usuarios/
├── src/                      # Directorio principal del código fuente
│   ├── api/                  # Capa de API (Express, Fastify, etc.)
│   │   ├── routes/           # Definición de las rutas REST
│   │   │   └── usuarios.routes.js
│   │   ├── controllers/      # Controladores: manejan req/res HTTP
│   │   │   └── usuarios.controller.js
│   │   └── middlewares/      # Middlewares (logging, errores, etc.)
│   │       ├── errorHandler.js
│   │       └── requestLogger.js
│   │
│   ├── domain/               # Lógica de negocio y reglas principales
│   │   ├── services/         # Orquestación de la lógica de negocio
│   │   │   └── usuarios.service.js
│   │   └── models/           # Modelos de dominio (entidades)
│   │       ├── Estudiante.js
│   │       └── Tutor.js
│   │
│   ├── infrastructure/         # Capa de infraestructura (detalles externos)
│   │   └── repositories/     # Acceso a datos (simulado o real)
│   │       └── usuarios.repository.js
│   │
│   ├── config/               # Configuración de la aplicación
│   │   └── index.js          # Carga de variables de entorno, etc.
│   │
│   └── app.js                # Punto de entrada de la aplicación, configuración del servidor
│
├── tests/                    # Pruebas automatizadas
│   ├── unit/                 # Pruebas unitarias (ej. para un servicio)
│   └── integration/          # Pruebas de integración (ej. ruta -> controlador -> servicio)
│
├── docs/                     # Documentación
│   └── swagger.yaml          # Definición OpenAPI/Swagger
│
├── .env.example              # Ejemplo de variables de entorno
├── .gitignore                # Archivos y carpetas a ignorar por Git
├── Dockerfile                # Instrucciones para construir la imagen del contenedor
└── package.json              # Metadatos del proyecto y dependencias (asumiendo Node.js)


-- Conéctate a la base de datos 'db_usuarios'
# Desde la linea de comandos ejecute este codigo sql

CREATE TABLE estudiantes (
    id VARCHAR(50) PRIMARY KEY,
    nombreCompleto VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    carrera VARCHAR(255)
);

CREATE TABLE tutores (
    id VARCHAR(50) PRIMARY KEY,
    nombreCompleto VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    especialidad VARCHAR(255)
);

-- Insertar datos de ejemplo (los que tenías en memoria)
INSERT INTO estudiantes (id, nombreCompleto, email, carrera) VALUES
('e12345', 'Ana Torres', 'ana.torres@universidad.edu', 'Ingeniería de Software'),
('e67890', 'Luis Garcia', 'luis.garcia@universidad.edu', 'Medicina');

INSERT INTO tutores (id, nombreCompleto, email, especialidad) VALUES
('t54321', 'Dr. Carlos Rojas', 'carlos.rojas@universidad.edu', 'Bases de Datos Avanzadas'),
('t09876', 'Dra. Elena Solano', 'elena.solano@universidad.edu', 'Cálculo Multivariable');