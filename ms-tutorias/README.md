ms-tutorias/
├── src/
│   ├── api/
│   │   # ... (routes, controllers, middlewares igual que antes) ...
│   │
│   ├── domain/
│   │   ├── services/
│   │   │   └── tutoria.service.js
│   │   └── models/
│   │       └── Tutoria.js
│   │
│   ├── infrastructure/
│   │   ├── repositories/     # Para persistir sus propios datos
│   │   │   └── tutoria.repository.js
│   │   │
│   │   └── clients/          # CLIENTES HTTP PARA OTROS SERVICIOS
│   │       ├── usuarios.client.js
│   │       └── agenda.client.js
│   │       └── notificaciones.client.js
│   │
│   ├── config/
│   │   └── index.js
│   │
│   └── app.js
│
├── ... (tests/, docs/, Dockerfile, etc.)
└── .env.example


# Instrucciones para crear la BD
-- Conéctate a la base de datos 'db_tutorias'

CREATE TABLE tutorias (
    idTutoria UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idEstudiante VARCHAR(50) NOT NULL,
    idTutor VARCHAR(50) NOT NULL,
    materia VARCHAR(255),
    fecha TIMESTAMPTZ NOT NULL,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'FALLIDA', 'CANCELADA')), -- Estados posibles
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- Para rastrear actualizaciones
    error VARCHAR(500) -- Para guardar mensaje de error si falla la saga
);

-- Opcional: Índices para búsquedas comunes
CREATE INDEX idx_tutorias_idEstudiante ON tutorias(idEstudiante);
CREATE INDEX idx_tutorias_idTutor ON tutorias(idTutor);
CREATE INDEX idx_tutorias_estado ON tutorias(estado);

-- Función para actualizar updatedAt automáticamente (específico de Postgres)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON tutorias
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();