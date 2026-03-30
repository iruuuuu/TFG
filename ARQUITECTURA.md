# Arquitectura del Proyecto Mendos

## Visión general

**Mendos** es una aplicación web de gestión de cocina escolar para el IES Antonio de Mendoza.
El proyecto está compuesto por **tres servicios independientes** orquestados con Docker Compose:

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   mendos_db  │  │mendos_backend│  │mendos_frontend│  │
│  │   MySQL 8.0  │  │  Flask/Python│  │  Vite + React │  │
│  │  puerto 3306 │  │  puerto 8000 │  │  puerto 3000  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Estructura de carpetas del proyecto raíz

```
TFG/
├── frontend/src/           ← Todo el código del frontend (componentes, páginas, lógica)
├── backend/                ← API REST en Flask (Python)
├── database/               ← Scripts SQL de creación y seed
├── docker-entrypoint-initdb.d/  ← Scripts SQL cargados automáticamente por MySQL al arrancar
├── public/                 ← Imágenes y assets estáticos
├── index.html              ← Punto de entrada HTML de Vite
├── vite.config.ts          ← Configuración de Vite (alias @/, puerto, polling para Docker)
├── Dockerfile              ← Dockerfile del frontend (Vite)
├── docker-compose.yml      ← Orquestación de los tres servicios
├── tsconfig.json           ← Configuración de TypeScript
├── postcss.config.mjs      ← Configuración de PostCSS (Tailwind v4)
├── package.json            ← Dependencias del frontend (`npm run dev` arranca Vite)
└── tailwind.config.ts      ← Configuración de Tailwind CSS
```

---

## El Frontend: estructura unificada en `frontend/src/`

Tras la migración de Next.js a **Vite + React Router DOM**, todo el código del frontend
está consolidado en una única carpeta `frontend/src/`. Ya no existe separación entre
"router" y "componentes" — todo convive en el mismo sitio.

### Punto de entrada

```
index.html                  → HTML raíz que carga frontend/src/main.tsx
frontend/src/
├── main.tsx                → Monta React con BrowserRouter + AuthProvider + DataProvider
└── App.tsx                 → Define las 5 rutas con <Routes> y <Route>
```

Las rutas disponibles son:

| URL | Componente | Descripción |
|---|---|---|
| `/` | `pages/HomePage.tsx` | Landing page con redirección automática por rol |
| `/login` | `pages/LoginPage.tsx` | Formulario de login |
| `/admin` | `pages/AdminPage.tsx` | Panel de administración |
| `/cocina` | `pages/CocinaPage.tsx` | Panel de cocina |
| `/menu` | `pages/MenuPage.tsx` | Vista del menú para maestros |

### Alias TypeScript / Vite

```json
// tsconfig.json y vite.config.ts
"@/*" → "./frontend/src/*"
```

Esto significa que `@/components/navbar` resuelve a `frontend/src/components/navbar.tsx`.

---

## Estructura detallada de `frontend/src/`

```
frontend/src/
│
├── main.tsx                → Entry point: monta la app con React Router + contextos
├── App.tsx                 → Router: define las 5 rutas de la SPA
├── globals.css             → Estilos globales y variables CSS del design system
│
├── pages/                  → Una página por ruta (usan los componentes de abajo)
│   ├── HomePage.tsx        → localhost:3000/    — Landing + redirección por rol
│   ├── LoginPage.tsx       → localhost:3000/login
│   ├── AdminPage.tsx       → localhost:3000/admin
│   ├── CocinaPage.tsx      → localhost:3000/cocina
│   └── MenuPage.tsx        → localhost:3000/menu
│
├── components/
│   ├── ui/                         → Componentes genéricos de shadcn/ui (Button, Card, Input…)
│   ├── navbar.tsx                  → Barra de navegación superior (QR modal del maestro)
│   ├── theme-provider.tsx          → Proveedor de tema (dark/light mode)
│   │
│   ├── landing/
│   │   └── landing-hero.tsx        → Sección hero de la página de inicio
│   │
│   ├── admin/                      → Componentes del Panel de Administración
│   │   ├── users-tab.tsx           → Gestión de usuarios (ver, crear, editar, eliminar)
│   │   ├── menus-tab.tsx           → Gestión de platos del menú
│   │   ├── reservations-tab.tsx    → Visualización de reservas
│   │   └── stats-tab.tsx           → Estadísticas generales
│   │
│   ├── cocina/                     → Componentes del Panel de Cocina
│   │   ├── today-reservations-tab.tsx  → Resumen y totales de reservas del día
│   │   ├── todo-list-tab.tsx           → Gestión de pedidos pendientes
│   │   ├── search-reservations-tab.tsx → Buscador por QR o código (Pasaplatos/Entregas)
│   │   ├── weekly-menu-tab.tsx         → Gestión del menú semanal
│   │   ├── gastro-events-tab.tsx       → Gestión de eventos gastronómicos
│   │   ├── alumnos-tab.tsx             → Gestión de alumnos de cocina
│   │   ├── activity-logs-tab.tsx       → Registro de actividad del sistema
│   │   ├── inventory-tab.tsx           → Control de inventario
│   │   └── create-dish-dialog.tsx      → Diálogo para crear nuevos platos
│   │
│   └── menu/                       → Componentes de la vista del Maestro
│       ├── weekly-menu-view.tsx        → Vista del menú semanal (lectura + reserva)
│       ├── my-reservations.tsx         → Historial de reservas del usuario
│       ├── ratings-view.tsx            → Valoraciones de platos
│       └── gastro-events-view.tsx      → Vista de eventos (reserva de plazas)
│
├── lib/
│   ├── api.ts              → fetchApi() — cliente HTTP centralizado hacia el backend
│   ├── auth-context.tsx    → AuthContext: sesión, login/logout, lista de todos los usuarios
│   ├── data-context.tsx    → DataContext: estado global de reservas, platos, eventos, etc.
│   ├── types.ts            → Tipos TypeScript (User, Reservation, MenuItem, etc.)
│   └── utils.ts            → Utilidades generales (cn() para combinar clases CSS)
│
└── hooks/
    ├── use-toast.ts        → Hook para notificaciones toast
    └── use-mobile.ts       → Hook para detectar dispositivo móvil
```

---

## Flujo de datos

```
Usuario (navegador)
     │
     ▼
Vite frontend  (puerto 3000)   ← SPA con React Router DOM
     │  usa fetchApi()
     ▼
Flask backend  (puerto 8000)   ← API REST en Python
     │  consulta/modifica
     ▼
MySQL          (puerto 3306)
```

### Contextos de estado global

Definidos en `frontend/src/main.tsx`, envuelven toda la aplicación:

| Contexto | Archivo | Responsabilidad |
|---|---|---|
| `AuthContext` | `lib/auth-context.tsx` | Sesión activa, login/logout, lista de todos los usuarios (`allUsers`) |
| `DataContext` | `lib/data-context.tsx` | Platos, reservas, eventos, inventario, ratings, logs de actividad |

Ambos contextos **cargan los datos del backend al arrancar** y los mantienen en memoria
mientras la app está abierta.

---

## Roles de usuario y acceso

| Rol | Ruta | Descripción |
|---|---|---|
| `admin` | `/admin` | Acceso total: usuarios, platos, reservas y estadísticas |
| `cocina` | `/cocina` | Panel completo: pedidos, menú, eventos, alumnos, actividad |
| `alumno-cocina` | `/cocina` | Panel de cocina con acceso limitado (sin gestión de alumnos/actividad) |
| `alumno-cocina-titular` | `/cocina` | Igual que `alumno-cocina`, pero con rol temporal que se resetea a las 14:30 |
| `maestro` | `/menu` | Vista del menú, reserva de platos y eventos, valoraciones |

La redirección automática por rol ocurre en `pages/HomePage.tsx` y `pages/LoginPage.tsx`.

### Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin@iesmendoza.es` | `admin123` | `admin` |
| `cocina@iesmendoza.es` | `cocina123` | `cocina` |
| `maestro@iesmendoza.es` | `maestro123` | `maestro` |
| `alumno@iesmendoza.es` | `alumno123` | `alumno-cocina` |

---

## Docker

| Servicio | Dockerfile | Puerto | Notas |
|---|---|---|---|
| `mendos_db` | imagen `mysql:8.0` | 3306 | Los scripts de `docker-entrypoint-initdb.d/` se ejecutan automáticamente al crear el contenedor |
| `mendos_backend` | `backend/Dockerfile` | 8000 | Flask en modo desarrollo con hot-reload (volumen `./backend:/app`) |
| `mendos_frontend` | `Dockerfile` (raíz) | 3000 | Vite en modo `dev` con polling activo para detectar cambios en Windows (volumen `.:/app`) |

El frontend usa **polling de archivos** (`usePolling: true` en `vite.config.ts`) porque
Docker en Windows no propaga eventos de sistema de archivos (inotify) al contenedor.

Para arrancar el proyecto completo:
```bash
docker compose up --build
```

Para reiniciar solo el frontend (tras cambios en configuración):
```bash
docker restart mendos_frontend
```

---

## Design System

Los colores y estilos están definidos como variables CSS en `frontend/src/globals.css`:

| Variable | Alias antiguo | Uso |
|---|---|---|
| `--md-accent` | `--gm-accent` | Color principal (amarillo/dorado) — botones, bordes activos |
| `--md-coral` | `--gm-coral` | Color secundario (coral/rojo) — textos de énfasis, badges |
| `--md-surface` | `--gm-surface` | Fondo de cards y paneles |
| `--md-page-bg` | `--gm-page-bg` | Fondo general de la página |
| `--md-heading` | `--gm-heading` | Color de títulos y texto principal |
| `--md-body` | `--gm-body` | Color de texto secundario |

> Los alias `--gm-*` se mantienen como variables secundarias apuntando a los `--md-*`
> para no romper componentes existentes que aún los usen.
