# Dockerfile

# --- Etapa 1: Builder ---
# Usamos una imagen de Node.js con el tag 'builder'. Esta etapa instalará
# las dependencias y copiará el código.
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json. Hacemos esto en un paso separado
# para aprovechar el caché de Docker. Las dependencias no cambian tan a menudo
# como el código, así que Docker no necesitará reinstalarlas en cada build.
COPY package*.json ./

# Instalamos las dependencias de producción
RUN npm install --omit=dev

# Copiamos el resto del código de la aplicación
COPY . .

# --- Etapa 2: Producción ---
# Empezamos desde una imagen fresca y ligera de Node.js para mantener
# nuestra imagen final pequeña y segura.
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiamos las dependencias ya instaladas y el código desde la etapa 'builder'.
# Esta es la magia de los 'multi-stage builds'.
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app ./

# Exponemos el puerto 3000 (esto es más para documentación; el puerto real
# se mapea en Docker Compose). Usamos 3000 como un default genérico.
EXPOSE 3000

# El comando que se ejecutará cuando el contenedor inicie.
CMD ["node", "src/app.js"]