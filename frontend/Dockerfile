FROM node:20-alpine

WORKDIR /app

# Copia manifiestos e instala dependencias
COPY package.json package-lock.json* ./
RUN npm install

# Copia el resto del código fuente
COPY . .

EXPOSE 3000

# Arranca Vite en modo dev escuchando en todas las interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
