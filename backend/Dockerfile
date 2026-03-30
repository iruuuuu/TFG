# Usa python:3.11-slim
FROM python:3.11-slim

# Establece el directorio de trabajo
WORKDIR /app

# Instala paquetes de sistema por si PyMySQL o similares los necesitan
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copia los dependencias e instala
COPY requirements.txt .

# Instala desde requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código fuente
COPY . .

# Expuso el puerto 8000
EXPOSE 8000

# Lanza la aplicación (usamos python run.py)
CMD ["python", "run.py"]
