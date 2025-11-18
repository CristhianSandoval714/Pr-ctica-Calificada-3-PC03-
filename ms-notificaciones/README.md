ms-notificaciones/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   └── notificaciones.routes.js
│   │   ├── controllers/
│   │   │   └── notificaciones.controller.js
│   │   └── middlewares/
│   │       ├── errorHandler.js
│   │       └── requestLogger.js
│   │
│   ├── domain/
│   │   ├── services/
│   │   │   └── notificacion.service.js
│   │   └── models/
│   │       └── LogNotificacion.js
│   │
│   ├── infrastructure/
│   │   └── providers/ # Cambiamos 'repositories' por 'providers'
│   │       └── email.provider.js
│   │
│   ├── config/
│   │   └── index.js
│   │
│   └── app.js
│
├── ... (tests/, docs/, Dockerfile, etc.)
└── .env.example