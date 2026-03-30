# Usa node:20-alpine
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de manifiesto
COPY package.json package-lock.json* ./

# Instala dependencias
RUN npm install

# Copia el código fuente
COPY . .

# Variables de entorno
ENV HOST=0.0.0.0

# Expone el puerto 3000 donde corre Next.js
EXPOSE 3000

# Lanza la app en modo dev
CMD ["npm", "run", "dev"]
