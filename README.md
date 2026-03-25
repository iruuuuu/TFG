# Mendos - Sistema de Gestión de Cocina IES Mendoza

## Arquitectura del Proyecto

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Python + Flask
- **Base de Datos**: MySQL

## Estructura del Proyecto

```
mendos/
├── frontend/          # Aplicación principal Next.js
├── backend/           # API Flask
├── database/          # Scripts SQL e histórico
└── brain/             # Documentación de diseño y desarrollo (Antigravity)
```

## Requisitos

### Backend (Flask)
- Python 3.10+
- MySQL 8.0+

### Frontend (Next.js)
- Node.js 18+
- npm

## Instalación

### 1. Base de Datos
```bash
# Crear la base de datos mendos_db en MySQL
mysql -u root -p < database/schema.sql
# (Opcional) Cargar datos de prueba
mysql -u root -p mendos_db < database/seed.sql
```

### 2. Backend
```bash
cd backend
python -m venv venv
# Activar venv (Windows: .\venv\Scripts\activate | Unix: source venv/bin/activate)
pip install -r app/requirements.txt
python run.py
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Configuración

### Backend (.env)
```
DATABASE_URL=mysql+pymysql://root@localhost/mendos_db
SECRET_KEY=supersecretkey-for-tfg-mendoza
FLASK_APP=run.py
FLASK_ENV=development
```

## URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Usuarios de Prueba

- Admin: admin@iesmendoza.es / admin123
- Cocina: cocina@iesmendoza.es / cocina123
- Maestro: maestro@iesmendoza.es / maestro123
- Alumno: alumno@iesmendoza.es / alumno123
