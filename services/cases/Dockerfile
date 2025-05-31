# Imagen base oficial de Node.js
FROM node:18

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto
EXPOSE 4001

# Comando para ejecutar la app
CMD ["node", "index.js"]
