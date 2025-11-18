# client-mobile-sim/Dockerfile

# --- Etapa 1: Builder ---
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# --- Etapa 2: Producción ---
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app ./

ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]