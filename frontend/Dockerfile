# Usa una imagen base de Node.js para construir la aplicación
FROM node:18 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias del proyecto
RUN npm install

# Compila la aplicación para producción
RUN npm run build

# Usa un servidor Nginx para servir la aplicación compilada
FROM nginx:alpine

# Copia los archivos compilados al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia el archivo de configuración de Nginx si lo necesitas (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto por defecto de Nginx
EXPOSE 80

# Comando por defecto para correr Nginx
CMD ["nginx", "-g", "daemon off;"]
