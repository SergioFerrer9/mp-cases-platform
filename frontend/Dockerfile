# Etapa de build
FROM node:18 AS build
WORKDIR /app

# Copiar solo package.json primero para aprovechar el cache
COPY package*.json ./
RUN npm install

# Ahora copiar todo incluyendo .env
COPY . .

# Build de la app (React lee el .env en este paso)
RUN npm run build

# Etapa de producción con NGINX
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Opcional: reemplazar default.conf si lo necesitas
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
