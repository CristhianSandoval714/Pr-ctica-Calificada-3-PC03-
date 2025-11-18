# Tutorias Universitarias 2
Proyecto académico diseñado para construir y demostrar una arquitectura de microservicios robusta, resiliente y moderna para un sistema de gestión de tutorías universitarias.

## ¿Qué Hace? (Funcionalidad Principal)
El sistema simula el flujo completo de un estudiante que solicita una tutoría:
1.  **Autenticación:** Un cliente (simulador) solicita un token JWT al servicio `ms-auth` proveyendo credenciales.
2.  **Autorización:** El token JWT se utiliza para validar la identidad y el rol (ej. "estudiante") del usuario en rutas protegidas.
3.  **Orquestación de Saga (en `ms-tutorias`):**
    * Valida la existencia del estudiante y el tutor (`ms-usuarios`).
    * Verifica la disponibilidad de horario (`ms-agenda`).
    * Crea la tutoría en la base de datos con estado `PENDIENTE`.
    * Bloquea el horario en la agenda del tutor (`ms-agenda`).
    * Publica un evento asíncrono en RabbitMQ para notificar al usuario.
    * Actualiza la tutoría a estado `CONFIRMADA`.
4.  **Notificación (Consumidor):**
    * `ms-notificaciones` consume el mensaje de la cola de RabbitMQ y (simula) el envío de un email de confirmación.

## Arquitectura del Sistema Local

El ecosistema se levanta usando `docker-compose` y consiste en **11 contenedores** que representan **7 servicios de aplicación** y **4 servicios de infraestructura**:

### Servicios de Aplicación
* **`client-sim` (UI 1):** Un cliente web interactivo (Node.js + Express) para simular las solicitudes del estudiante.
* **`tracking-dashboard` (UI 2):** Un dashboard de trazabilidad en vivo (Node.js + Express + WebSockets) que muestra la saga en tiempo real.
* **`ms-auth`:** Microservicio de autenticación. Genera tokens JWT para los usuarios.
* **`ms-usuarios`:** Microservicio que gestiona la información de estudiantes y tutores.
* **`ms-agenda`:** Microservicio que gestiona la disponibilidad y los bloqueos de horario de los tutores.
* **`ms-tutorias` (Orquestador):** El servicio central que maneja la lógica de negocio (Saga) para crear una tutoría.
* **`ms-notificaciones` (Consumidor):** Un *worker* que escucha eventos de RabbitMQ para (simular) el envío de emails de confirmación.

### Servicios de Infraestructura
* **`db-usuarios`:** Base de datos PostgreSQL dedicada para `ms-usuarios`.
* **`db-agenda`:** Base de datos PostgreSQL dedicada para `ms-agenda`.
* **`db-tutorias`:** Base de datos PostgreSQL dedicada para `ms-tutorias`.
* **`rabbitmq`:** Bróker de mensajería para la comunicación asíncrona.

## Stack Tecnológico Principal

* **Backend:** Node.js, Express.js
* **Bases de Datos:** PostgreSQL (con cliente `pg` de Node.js)
* **Mensajería:** RabbitMQ (con `amqplib`)
* **Observabilidad:** WebSockets (`socket.io`)
* **Contenerización:** Docker, Docker Compose
* **Seguridad:** JWT (JSON Web Tokens)

---

## Guía de Puesta en Marcha Local (Obligatoria)
Sigue estos pasos en orden para levantar el ecosistema completo en tu máquina.

### 1. Prerrequisitos
Asegúrate de tener instalado:
* Git
* Node.js (v18+)
* Docker Desktop (y que esté **corriendo**)
* Un cliente SQL (Recomendado: DBeaver, pgAdmin, o `psql` CLI)

### 2. Clonar el Repositorio
```bash
    git clone [URL-DE-TU-REPOSITORIO]
    cd tutorias-universitarias-2
```
### 3. Configuración de Entorno (.env)
El proyecto requiere archivos .env para cada servicio para desarrollo local. Ejecuta los siguientes 7 comandos desde la carpeta raíz del proyecto para crearlos a partir de las plantillas.

**Nota:** Los valores de las plantillas (.env.example) están configurados para funcionar con los puertos locales expuestos por Docker Compose (ej. DB_PORT=5432, DB_PORT=5433, etc.).

<details> <summary><strong>Haz clic aquí para ver los 7 comandos y el contenido de las plantillas</strong></summary>

1. Comando para ms-auth:
```bash
    cp ms-auth/.env.example ms-auth/.env
```
Contenido de ms-auth/.env.example:

```bash
    PORT=4000
    JWT_SECRET=ESTE_ES_UN_SECRETO_PARA_DESARROLLO_NO_USAR_EN_PROD
    JWT_EXPIRES_IN=1h
```
2. Comando para ms-usuarios:
```bash
    cp ms-usuarios/.env.example ms-usuarios/.env
```
Contenido de ms-usuarios/.env.example:
```bash
    PORT=3001
    LOG_LEVEL=info
    SERVICE_NAME=MS_Usuarios
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=user_usuarios
    DB_PASSWORD=password_usuarios
    DB_NAME=db_usuarios
    RABBITMQ_URL=amqp://localhost:5672
```
3. Comando para ms-agenda:
```bash
    cp ms-agenda/.env.example ms-agenda/.env
```
Contenido de ms-agenda/.env.example (Corregido):
```bash
    PORT=3002
    LOG_LEVEL=info
    SERVICE_NAME=MS_Agenda
    DB_HOST=localhost
    DB_PORT=5433
    DB_USER=user_agenda
    DB_PASSWORD=password_agenda
    DB_NAME=db_agenda
    RABBITMQ_URL=amqp://localhost:5672
```
4. Comando para ms-tutorias:
```bash
cp ms-tutorias/.env.example ms-tutorias/.env
```

Contenido de ms-tutorias/.env.example (Corregido):
```bash
    PORT=3000
    LOG_LEVEL=info
    SERVICE_NAME=MS_Tutorias
    MS_USUARIOS_URL=http://localhost:3001/usuarios
    MS_AGENDA_URL=http://localhost:3002/agenda
    MS_NOTIFICACIONES_URL=http://localhost:3003/notificaciones
    JWT_SECRET=ESTE_ES_UN_SECRETO_PARA_DESARROLLO_NO_USAR_EN_PROD
    RABBITMQ_URL=amqp://localhost:5672
    DB_HOST=localhost
    DB_PORT=5434
    DB_USER=user_tutorias
    DB_PASSWORD=password_tutorias
    DB_NAME=db_tutorias
```

5. Comando para ms-notificaciones:
```bash
    cp ms-notificaciones/.env.example ms-notificaciones/.env
```

Contenido de ms-notificaciones/.env.example:
```bash
    PORT=3003
    LOG_LEVEL=info
    SERVICE_NAME=MS_Notificaciones
    RABBITMQ_URL=amqp://localhost:5672
```

6. Comando para client-mobile-sim:
```bash
    cp client-mobile-sim/.env.example client-mobile-sim/.env
```

Contenido de client-mobile-sim/.env.example (Creado por nosotros):
```bash
    PORT=8080
    API_BASE_URL=http://localhost:3000
    AUTH_SERVICE_URL=http://localhost:4000/auth

7. Comando para tracking-dashboard:
```bash
    cp tracking-dashboard/.env.example tracking-dashboard/.env
```

Contenido de tracking-dashboard/.env.example (Creado por nosotros):
```bash
    PORT=9000
    RABBITMQ_URL=amqp://localhost:5672
```
</details>

### 4. Levantar el Ecosistema
Este comando construirá las imágenes de Docker para los 7 servicios y levantará los 11 contenedores.
```bash
    docker-compose up --build
```
Espera a que los logs se estabilicen. Verás mensajes de "Conexión exitosa a PostgreSQL" y "Conectado a RabbitMQ" de los servicios.

### 5. (Paso Crítico) Inicializar las Bases de Datos
Los contenedores de la base de datos están corriendo, pero están vacíos. Debes inicializar las tablas y datos de ejemplo manualmente.
Abre tu cliente SQL (DBeaver, etc.) y ejecuta los siguientes 3 scripts:
<details> <summary><strong>1. Conexión a db-usuarios (Puerto 5432)</strong></summary>
* Host: localhost
* Puerto: 5432
* BD: db_usuarios
* User: user_usuarios
* Pass: password_usuarios

**Script SQL** (de ms-usuarios/README.md):
```bash
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

    INSERT INTO estudiantes (id, nombreCompleto, email, carrera) VALUES
    ('e12345', 'Ana Torres', 'ana.torres@universidad.edu', 'Ingeniería de Software'),
    ('e67890', 'Luis Garcia', 'luis.garcia@universidad.edu', 'Medicina');

    INSERT INTO tutores (id, nombreCompleto, email, especialidad) VALUES
    ('t54321', 'Dr. Carlos Rojas', 'carlos.rojas@universidad.edu', 'Bases de Datos Avanzadas'),
    ('t09876', 'Dra. Elena Solano', 'elena.solano@universidad.edu', 'Cálculo Multivariable');
```
</details>

<details> <summary><strong>2. Conexión a db-agenda (Puerto 5433)</strong></summary>
    *Host: localhost
    *Puerto: 5433
    *BD: db_agenda
    *User: user_agenda
    *Pass: password_agenda

**Script SQL** (de ms-agenda/README.md):
```bash
    CREATE TABLE bloqueos (
        idBloqueo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        idTutor VARCHAR(50) NOT NULL,
        fechaInicio TIMESTAMPTZ NOT NULL,
        duracionMinutos INTEGER NOT NULL,
        idEstudiante VARCHAR(50) NOT NULL,
        createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_bloqueos_idTutor ON bloqueos(idTutor);

    INSERT INTO bloqueos (idTutor, fechaInicio, duracionMinutos, idEstudiante) VALUES
    ('t54321', '2025-10-22T10:00:00.000Z', 60, 'e12345');
```
</details>

<details> <summary><strong>3. Conexión a db-tutorias (Puerto 5434)</strong></summary>
    * Host: localhost
    * Puerto: 5434
    * BD: db_tutorias
    * User: user_tutorias
    * Pass: password_tutorias

**Script SQL** (de ms-tutorias/README.md):
```bash
    CREATE TABLE tutorias (
        idTutoria UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        idEstudiante VARCHAR(50) NOT NULL,
        idTutor VARCHAR(50) NOT NULL,
        materia VARCHAR(255),
        fecha TIMESTAMPTZ NOT NULL,
        estado VARCHAR(50) NOT NULL CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'FALLIDA', 'CANCELADA')),
        createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        error VARCHAR(500)
    );

    CREATE INDEX idx_tutorias_idEstudiante ON tutorias(idEstudiante);
    CREATE INDEX idx_tutorias_idTutor ON tutorias(idTutor);
    CREATE INDEX idx_tutorias_estado ON tutorias(estado);

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
```
</details>

### 6. ¡Sistema Listo! Verifica tu Entorno
Tu ecosistema completo está en marcha. Abre las siguientes 3 URLs en tu navegador:
1. **Cliente Web Interactivo:**
    * http://localhost:8080
    * Verás el formulario para solicitar tutorías.

2. **Dashboard de Trazabilidad en Vivo:**
    * http://localhost:9000
    * Verás el dashboard con los carriles, listo para recibir eventos.

3. **Panel de Administración de RabbitMQ:**
    * http://localhost:15672
    * Login: rabbit / rabbit
    * Ve a la pestaña "Queues". Deberías ver notificaciones_email_queue con **1 consumidor**.

### 7. Ejecuta una Prueba de Flujo Completo
1. Coloca las ventanas del **Cliente (:8080)** y el **Dashboard (:9000)** una al lado de la otra.
2. En el Cliente, usa los datos pre-rellenados (o cámbialos) y haz clic en **"Solicitar Tutoría"**.
3. Observa cómo el Dashboard (:9000) se llena en tiempo real con los eventos de la saga, mostrando la comunicación entre MS_Tutorias, MS_Usuarios, MS_Agenda y MS_Notificaciones.
4. Observa cómo el Cliente (:8080) recibe la respuesta JSON final de CONFIRMADA.

## Hacia Dónde Apunta (Roadmap)
El objetivo final de este proyecto es evolucionar de docker-compose a un despliegue completo en la nube:
* **Orquestación de Contenedores:** Migrar a **Kubernetes (K8s)** para gestionar el despliegue, escalado y auto-reparación.
* **Gestión de Infraestructura:** Desplegar PostgreSQL y RabbitMQ en K8s usando Helm charts.
* **Gestión de Configuración:** Convertir las variables de entorno en **ConfigMaps y Secrets** de Kubernetes.
* **API Gateway:** Integrar **Kong** como Ingress Controller en K8s para manejar el enrutamiento de tráfico externo y la seguridad JWT de forma centralizada.