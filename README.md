# GuMip - Sistema de Gestión de Cocina IES Mendoza

## Arquitectura del Proyecto

- **Frontend**: React + TypeScript
- **Backend**: PHP + Symfony 6
- **Base de Datos**: MySQL
- **IA/Servicios**: Python + Flask

## Estructura del Proyecto

```
gumip/
├── frontend/          # Aplicación React
├── backend/           # API Symfony
├── database/          # Scripts SQL
├── ai-services/       # Servicios Python IA
└── docs/              # Documentación
```

## Requisitos

### Backend (Symfony)
- PHP 8.1+
- Composer
- Symfony CLI

### Frontend (React)
- Node.js 18+
- npm o yarn

### Base de Datos
- MySQL 8.0+

### Servicios IA
- Python 3.10+
- pip

## Instalación

### 1. Base de Datos
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p gumip_db < database/seed.sql
```

### 2. Backend
```bash
cd backend
composer install
php bin/console doctrine:migrations:migrate
php bin/console lexik:jwt:generate-keypair
symfony server:start
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Servicios IA
```bash
cd ai-services
pip install -r requirements.txt
python app.py
```

## Configuración

### Backend (.env)
```
DATABASE_URL="mysql://user:password@127.0.0.1:3306/gumip_db"
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
AI_SERVICE_URL=http://localhost:5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api
```

## URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Servicios IA: http://localhost:5000

## Usuarios de Prueba

- Admin: admin@iesmendoza.es / admin123
- Cocina: cocina@iesmendoza.es / cocina123
- Maestro: maestro@iesmendoza.es / maestro123
