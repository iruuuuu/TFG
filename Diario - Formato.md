# **Diario de trabajo – Desarrollo Backend**

    Irene Ming Jimenez Hinojosa

##

# **27/01/26**

## **1\. Revisión de la estructura del backend**

Se ha analizado la estructura del proyecto Symfony ubicada en:

backend/src  
backend/src/Entity  
backend/src/Controller  
backend/src/Repository

Confirmando que el proyecto sigue correctamente la arquitectura estándar **MVC (Model–View–Controller)** de Symfony, con una separación clara entre:

- **Entity** → Modelo de datos (persistencia)
- **Repository** → Acceso a datos y consultas
- **Controller** → Lógica de negocio y gestión de peticiones HTTP

Esta estructura garantiza escalabilidad, mantenibilidad y una correcta organización del backend.

---

## **2\. Definición del backend del proyecto**

Se ha definido el modelo de datos principal del sistema, compuesto por las siguientes entidades:

- **User** → Gestión de usuarios y autenticación.
- **Dish** → Gestión de platos del menú.
- **Reservation** → Gestión de reservas y control de stock.

Estas entidades constituyen el núcleo funcional del backend del sistema, permitiendo la gestión de usuarios, la administración del menú y el sistema de reservas.

---

## **3\. Generación de entidades, repositorios y controladores**

Se han definido y validado los comandos estándar de Symfony para la generación automática de los componentes del backend.

###

### **Entidades y repositorios**

php bin/console make:user  
php bin/console make:entity Dish  
php bin/console make:entity Reservation

Estos comandos generan automáticamente:

- La entidad (Entity)
- El repositorio asociado (Repository)
- La estructura de persistencia compatible con Doctrine ORM

---

### **Controladores**

php bin/console make:controller AuthController  
php bin/console make:controller DishController  
php bin/console make:controller ReservationController

Estos controladores gestionan:

- Autenticación y autorización (AuthController)
- Gestión de platos (DishController)
- Gestión de reservas (ReservationController)

---

### **Migraciones de base de datos**

php bin/console make:migration  
php bin/console doctrine:migrations:migrate

Estos comandos permiten:

- Generar los scripts SQL de migración.
- Sincronizar la base de datos con el modelo de entidades.
- Garantizar la coherencia entre código y base de datos.

---

##

##

## **4\. Verificación y corrección de las entidades Dish y Reservation**

### **4.1 Entidad Dish – Verificación y corrección**

Se ha realizado una revisión exhaustiva de la entidad **Dish**, corrigiendo y ajustando su estructura para que cumpla al 100 % con las especificaciones funcionales y técnicas definidas para el proyecto.

### **Campos verificados y corregidos**

**Información básica**

- ✅ **id** (integer): Identificador único auto-generado.
- ✅ **name** (string, 150): Nombre del plato.
- ✅ **description** (text, nullable): Descripción detallada del plato.
- ✅ **category** (string, 20, nullable): Categoría del plato.
- ✅ **price** (decimal, 5,2): Precio del plato.

**Información visual**

- ✅ **imageUrl** (string, 255, nullable): URL de la imagen del plato.

**Información nutricional y alérgenos**

- ✅ **allergens** (JSON, nullable): Array con los alérgenos del plato.
- ✅ **nutritionalInfo** (JSON, nullable): Información nutricional del plato.

**Estado y disponibilidad**

- ✅ **isActive** (boolean): Indica si el plato está activo en el menú.
- ✅ **availableDate** (date): Fecha desde la cual el plato está disponible (campo añadido).

**Gestión de stock**

- ✅ **stockTotal** (integer): Cantidad total disponible.
- ✅ **stockReserved** (integer): Cantidad reservada (corregido desde stockReverse).

**Auditoría**

- ✅ **createdAt** (datetime): Fecha de creación, gestionada automáticamente.
- ✅ **updatedAt** (datetime): Fecha de última actualización, gestionada automáticamente.

###

### **Métodos calculados implementados**

- getStockAvailable() → Devuelve el stock disponible (stockTotal \- stockReserved).
- hasStock(int $quantity) → Verifica si existe stock suficiente.
- incrementReserved(int $quantity) → Incrementa el stock reservado con validación.
- decrementReserved(int $quantity) → Decrementa el stock reservado con validación.

---

### **Problemas corregidos en Dish**

- stockReverse → Renombrado a stockReserved.
- allergens → Cambio de string a JSON.
- description → Cambio a tipo TEXT nullable.
- category → Reducción a 20 caracteres y nullable.
- name → Ajustado a 150 caracteres.
- availableDate → Campo añadido.
- Lifecycle Callbacks → Añadidos para createdAt y updatedAt.
- Métodos calculados → Implementados con validaciones.

---

### **Archivos creados/actualizados (Dish)**

- Dish.php → Entidad completa.
- DishRepository.php → Repositorio con consultas personalizadas.

---

## **4.2 Entidad Reservation – Verificación y corrección**

Se ha revisado y corregido la entidad **Reservation**, garantizando su coherencia con el modelo de datos y las reglas de negocio del sistema.

### **Propiedades verificadas**

- ✅ **id**: Identificador único auto-generado.
- ✅ **user**: Relación ManyToOne con User (nullable: false).
- ✅ **dish**: Relación ManyToOne con Dish (nullable: false).
- ✅ **reservationDate**: Fecha de la reserva (DATE).
- ✅ **quantity**: Cantidad reservada (validación â‰¥ 1).
- ✅ **status**: Estado de la reserva (string, 20).
- ✅ **notes**: Notas opcionales (TEXT, nullable).
- ✅ **createdAt**: Timestamp automático.
- ✅ **updatedAt**: Timestamp automático.

### **ðŸ’¡ Validaciones implementadas**

- Validación de **quantity â‰¥ 1** en el setter.
- Relaciones **user** y **dish** obligatorias.
- Campo **notes** opcional.
- Gestión automática de timestamps mediante lifecycle callbacks.

---

### **ðŸ”§ Problemas corregidos en Reservation**

- Campo relation → Reemplazado por relación user.
- Campo notes → Cambiado a nullable.
- Añadidos lifecycle callbacks.
- Implementación de validación de cantidad.
- Actualización de la entidad User con relación a Reservation.

---

### **Archivos creados/actualizados (Reservation)**

- Reservation.php
- ReservationRepository.php
- User.php (relación con reservas)

---

## **🎯 Resumen final**

Durante el día de trabajo se ha realizado:

✔ Análisis de estructura del proyecto  
✔ Definición del modelo de datos  
✔ Generación del backend con Symfony  
✔ Creación de entidades, repositorios y controladores  
✔ Migraciones de base de datos  
✔ Corrección completa de la entidad Dish  
✔ Corrección completa de la entidad Reservation  
✔ Validaciones de negocio  
✔ Implementación de control de stock  
✔ Implementación de auditoría automática  
✔ Relaciones entre entidades correctamente definidas

---

# **13/02/26**

## **5. Migración del backend de PHP (Symfony) a Python (Flask)**

### **5.1 Justificación del cambio**

Se ha tomado la decisión estratégica de cambiar el backend del proyecto de **PHP/Symfony** a **Python/Flask**. Los motivos principales son:

- **Comprensión y Defensa del TFG**: La estructura de Flask es más explícita y directa, lo que facilita la comprensión y explicación de cómo se construyen los modelos, controladores y rutas.
- **Simplicidad**: Flask ofrece un control más granular sobre los componentes, eliminando parte de la complejidad inherente a frameworks más pesados como Symfony.

### **5.2 Nueva Estructura del Proyecto (Python)**

El nuevo backend se organiza en el directorio `backend_python` siguiendo un patrón modular y escalable:

- **app/models/**: Definición de esquemas de base de datos con SQLAlchemy ORM.
- **app/routes/**: Implementación de la lógica de los endpoints mediante Blueprints.
- **run.py**: Punto de entrada para el servidor de desarrollo.

### **5.3 Componentes Implementados tras el cambio**

Se han migrado y adaptado las entidades originales al nuevo entorno:

- ✅ **User**: Modelo para gestión de usuarios y autenticación.
- ✅ **Dish**: Modelo para la gestión del catálogo de platos, precios y stock.
- ✅ **Reservation**: Modelo para el sistema de reservas y su vinculación con platos y usuarios.
- ✅ **API Routes**: Endpoints funcionales para platos, reservas y esqueleto de autenticación.
- ✅ **Database Migrations**: Configuración de Flask-Migrate para la gestión de la base de datos SQLite.

---

# **15/02/26**

## **6. Traducción de Modelos al Castellano**

Se ha realizado una migración lingüística de los modelos de datos para mejorar la legibilidad y facilitar la defensa del proyecto:

- **Usuario** (anteriormente `User`): Gestión de perfiles y roles.
- **Plato** (anteriormente `Dish`): Catálogo, precios y control de stock.
- **Reserva** (anteriormente `Reservation`): Vínculo entre usuarios y platos con estado de pago.

## **7. Creación de Interfaces Especializadas**

Se ha segmentado el frontend para ofrecer una experiencia adaptada a cada tipo de usuario:

### **7.1 Panel del Docente**

- **TeacherDashboard**: Vista principal con acceso rápido a las funciones del docente.
- **TastingMenuTeacher**: Visualización de eventos de degustación como tarjetas informativas (sin precio ni stock).
- **MyReservations**: Gestión personal de las reservas realizadas.

### **7.2 Panel de Cocina**

- **KitchenDashboard**: Control centralizado de pedidos y disponibilidad de platos.
- **TastingMenuKitchen**: Configuración de eventos de degustación con opción de stock ilimitado.

## **8. Refinamiento de la Lógica de Negocio**

- ✅ **Stock Ilimitado**: Implementación en el modelo `Plato` para soportar eventos de capacidad no restringida.
- ✅ **Validación de Reservas**: Nueva lógica para asegurar que las cantidades reservadas sean válidas (positivas, numéricas y dentro del stock disponible).
- ✅ **Optimización de UI**: Desbloqueo de botones de reserva y mejora en la intuitividad de los formularios.

---

# **19/03/26**

## **9. Implementación del DataContext para Gestión Centralizada de Datos**

Se ha creado el contexto de datos centralizado (`lib/data-context.tsx`) que actúa como capa de estado global de la aplicación, reemplazando el uso disperso de datos locales.

### **9.1 Estructura del DataContext**

El `DataProvider` expone un contexto React con las siguientes áreas funcionales:

- **Platos del Menú** (`menuItems`): CRUD completo (añadir, actualizar, eliminar).
- **Reservas** (`reservations`): Creación, actualización, cancelación, gestión del estado de cocina (`pending` → `preparing` → `completed`) y limpieza automática de reservas completadas.
- **Inventario** (`inventory`): Actualización de cantidades y adición de nuevos artículos.
- **Valoraciones** (`ratings`): Sistema de puntuación y comentarios por usuario.
- **Usuarios** (`users`): Gestión completa de usuarios con roles.
- **Menú Semanal** (`weeklyMenu`): Asignación de platos por día y categoría (entrante, principal, postre) con posibilidad de limpiar la planificación completa.
- **Eventos Gastronómicos** (`gastroEvents`): Creación, modificación y cancelación de eventos con control de aforo.
- **Reservas de Eventos** (`eventReservations`): Sistema de inscripción a eventos con validación de duplicados y actualización automática del aforo.
- **Registro de Actividad** (`activityLogs`): Trazabilidad de acciones realizadas por los usuarios.

### **9.2 Datos iniciales (Mock Data)**

Se han definido datos iniciales para el entorno de desarrollo:

- 3 usuarios base: Administrador, Personal de Cocina y Profesor.
- 2 reservas de ejemplo con distintos estados.
- Menú semanal completo de lunes a viernes.
- 2 eventos gastronómicos con distintas capacidades y estados.

---

## **10. Ampliación del Sistema de Tipos (TypeScript)**

Se ha reestructurado y ampliado el archivo `lib/types.ts` con las siguientes interfaces:

- ✅ **UserRole**: Incorporación de los roles `alumno-cocina` y `alumno-cocina-titular`.
- ✅ **MenuItem**: Añadidos campos `authorId` y `authorName` para trazabilidad de creación de platos.
- ✅ **WeeklyMenu**: Tipado dinámico por día con categorías `entrante`, `principal` y `postre`.
- ✅ **GastroEvent**: Nueva interfaz para eventos gastronómicos con control de aforo, estado, platos y fechas de auditoría.
- ✅ **EventReservation**: Nueva interfaz para las inscripciones a eventos gastronómicos.
- ✅ **ActivityLog**: Nueva interfaz para el registro de actividad con acción, detalles, usuario y rol.

---

## **11. Expansión del Contexto de Autenticación**

Se ha ampliado significativamente `lib/auth-context.tsx` con las siguientes mejoras:

### **11.1 Gestión completa de usuarios desde AuthContext**

- **addUser**: Creación de nuevos usuarios con contraseña y persistencia en `localStorage`.
- **updateUser**: Actualización de datos de usuario, incluyendo sesión activa si el usuario modificado es el logueado.
- **deleteUser**: Eliminación de usuarios con persistencia.
- **allUsers**: Exposición de la lista completa de usuarios para el panel de administración.

### **11.2 Reseteo automático de roles de alumnos**

Se ha implementado un mecanismo de reseteo automático diario:

- A las **14:30** de cada **día laborable**, los alumnos con rol `alumno-cocina-titular` se revierten automáticamente a `alumno-cocina`.
- El sistema verifica cada 60 segundos si el reseteo ya se ha aplicado en el día actual.
- Se utiliza `localStorage` para persistir la marca temporal del último reseteo y evitar ejecuciones duplicadas.

---

## **12. Nuevos Componentes del Frontend**

Se han creado nuevos componentes especializados para el panel de cocina:

### **12.1 Gestión de Alumnos (`components/cocina/alumnos-tab.tsx`)**

- Vista de gestión de alumnos de cocina con posibilidad de asignar el rol de **titular** diario.
- Integración con el `AuthContext` para la actualización de roles en tiempo real.

### **12.2 Diálogo de Creación de Platos (`components/cocina/create-dish-dialog.tsx`)**

- Formulario completo para la creación de nuevos platos con campos para nombre, descripción, categoría, alérgenos e imagen.
- Integración directa con el `DataContext` para añadir platos al menú.

### **12.3 Lista de Tareas (`components/cocina/todo-list-tab.tsx`)**

- Sistema de gestión de tareas para el personal de cocina.
- Funcionalidades de crear, completar y eliminar tareas.

### **12.4 Registro de Actividad (`components/cocina/activity-logs-tab.tsx`)**

- Visualización cronológica de las acciones realizadas en el sistema.
- Filtrado por tipo de acción, usuario y rol.

---

## **13. Mejoras en Componentes Existentes**

### **13.1 Panel de Administración**

- **users-tab.tsx**: Rediseño completo con gestión CRUD de usuarios, asignación de roles y contraseñas, integrado con `AuthContext`.
- **stats-tab.tsx**: Actualizado para consumir datos del `DataContext` centralizado.
- **menus-tab.tsx**: Adaptado al nuevo sistema de datos centralizado.

### **13.2 Panel de Cocina**

- **weekly-menu-tab.tsx**: Expansión significativa con planificación semanal completa, asignación de platos por categoría y día.
- **gastro-events-tab.tsx**: Refactorización para integración con `DataContext` y control de aforo.
- **inventory-tab.tsx**: Mejoras en la gestión visual del inventario.
- **today-reservations-tab.tsx**: Simplificación del componente para consumir reservas del contexto centralizado.

### **13.3 Panel del Docente/Menú**

- **weekly-menu-view.tsx**: Ampliación con vista semanal mejorada consumiendo datos del `DataContext`.
- **my-reservations.tsx**: Rediseño con estados de cocina visibles y capacidad de cancelación.
- **ratings-view.tsx**: Integración con el nuevo sistema de valoraciones centralizado.
- **gastro-events-view.tsx**: Actualización para reflejar datos del contexto global.

---

## **14. Backend Python – Nuevos Modelos y Rutas**

### **14.1 Modelos creados**

Se han creado los modelos SQLAlchemy en `backend/app/models/`:

- **Plato** (`dish.py`): Modelo completo con campos en castellano (`nombre`, `descripcion`, `categoria`, `precio`, `stock_total`, `stock_reservado`, etc.) y métodos `obtener_stock_disponible()` y `tiene_stock()`.
- **Reserva** (`reservation.py`): Modelo con relaciones a `Usuario` y `Plato`, campos de estado y auditoría.
- **Usuario** (`user.py`): Modelo base de autenticación.

### **14.2 Rutas API creadas**

Se han implementado los endpoints en `backend/app/routes/`:

- **auth_routes.py**: Esqueleto de autenticación.
- **dish_routes.py**: Endpoints para CRUD de platos y consulta de disponibilidad.
- **reservation_routes.py**: Endpoints para gestión de reservas.

### **14.3 Migraciones de Base de Datos**

- **Migración inicial** (`d993bc49b344`): Creación de tablas base.
- **Traducción al castellano** (`3782cd7593d9`): Renombrado de todos los campos y tablas al español.
- **migration_stock_system.sql**: Script SQL para la implementación del sistema de control de stock.

### **14.4 Configuración CORS**

- Se ha añadido `backend/config/packages/nelmio_cors.yaml` para la configuración de CORS, permitiendo la comunicación entre el frontend (Next.js) y el backend.

---

## **15. Aplicación de Paleta de Colores Corporativa**

Se ha creado el script `colorize3.js` para aplicar de forma automatizada una paleta de colores cálida e inspirada en el logotipo del centro educativo (IES Mendoza).

### **15.1 Paleta aplicada**

| Elemento         | Color anterior | Color nuevo | Nombre           |
| ---------------- | -------------- | ----------- | ---------------- |
| Texto principal  | `#5C5C5C`      | `#4A3B32`   | Deep Cocoa/Brown |
| Texto secundario | `#737373`      | `#877669`   | Warm Taupe       |
| Acento primario  | `#F2EDA2`      | `#FAD85D`   | Goldenrod        |
| Acento hover     | `#F2EFC2`      | `#FDF1B6`   | Light Goldenrod  |
| Acento coral     | `#F2594B`      | `#E8654D`   | Coral/Terracotta |
| Fondo coral      | `#FFF5F4`      | `#FDF0EC`   | Light Coral      |
| Fondo app        | `#FFFDF7`      | `#FAF7F0`   | Creamy Off-White |
| Fondo tarjetas   | `#FFFEF9`      | `#FFFFFF`   | True White       |

### **15.2 Archivos afectados**

El script procesó automáticamente todos los archivos `.tsx` y `.ts` de los directorios `app/` y `components/`, aplicando los cambios de color en:

- Dashboards de administración, cocina y menú.
- Barra de navegación (`navbar.tsx`).
- Todos los componentes de pestañas.
- Página de login.

---

# **21/03/26**

## **16. Reorganización del Panel de Cocina**

Se ha reestructurado la navegación del panel de cocina para optimizar el flujo de trabajo diario, agrupando las funcionalidades de forma lógica:

- **Pedidos (Interactivo)**: Desplegable que agrupa **Gestión de Pedidos** (para preparar platos) y **Buscador de Reservas** (para la entrega final).
- **Previsión y Totales (Informativo)**: Renombrado de "Reservas Hoy" para reflejar mejor su función de dashboard de consulta rápida sin interacción directa.
- **Jerarquía mejorada**: Se ha posicionado la previsión en la parte superior para ofrecer una visión clara de la carga de trabajo antes de entrar en la gestión operativa.

## **17. Mejora de la Estética Premium y Branding**

Se ha unificado la identidad visual de todo el panel siguiendo la paleta de colores corporativa (Coral):

- ✅ **Iconografía**: Actualización de todos los iconos de categorías de primer nivel al color Coral corporativo.
- ✅ **Tipografía y Estados**: Tipografía semi-bold y efectos de hover mejorados (`bg-accent/20`) para una navegación más intuitiva y elegante.
- ✅ **Consistencia**: Unificación de los estilos de botones, bordes y espaciados en todos los menús laterales y desplegables.

## **18. Optimización para Dispositivos Móviles (Aesthetics & Breathing)**

Se han aplicado cambios críticos de UI para mejorar la experiencia en pantallas pequeñas, asegurando que los componentes "respiren":

- ✅ **Modales Flotantes**: Modificación de `DialogContent` y `AlertDialogContent` para incluir un margen lateral de 16px (`w-[calc(100%-2rem)]`) y evitar que toquen los bordes de la pantalla.
- ✅ **Redondeo Moderno**: Incremento del radio de las esquinas de `rounded-lg` a `rounded-2xl` en diálogos y `rounded-xl` en tarjetas para una estética más fluida y premium.
- ✅ **Filtros Verticales**: Los botones de filtrado de eventos ahora se apilan verticalmente en móvil, eliminando el scroll horizontal y permitiendo ver todas las opciones de un vistazo.

## **19. Sistema de Asistencia y Verificación de Eventos**

- **Lector de QR integrado**: Implementación de un escáner en el panel de eventos que identifica al docente por su código QR y valida si está en la lista de invitados.
- **Check-In Manual**: Lista de asistentes interactiva que permite marcar la presencia de un docente manualmente si el código no está disponible.
- **Buscador de Reservas**: Nuevo sistema de búsqueda por código alfanumérico corto o correo electrónico para agilizar la entrega de pedidos en cocina.

---

## **20. Migración Completa al Backend (Python/Flask + MySQL)**

Se ha llevado a cabo una reestructuración profunda de la arquitectura del proyecto, pasando de un frontend monolítico temporal con datos simulados a una arquitectura Cliente-Servidor robusta y definitiva:

- ✅ **Nuevos Modelos ORM (SQLAlchemy)**: Creación e integración de modelos en Python para `Inventario`, `Eventos Gastro`, `Reservas de Eventos`, `Valoraciones` y `Logs de Actividad`, asegurando una coincidencia exacta con el esquema de la base de datos `mendos_db` en MySQL.
- ✅ **API RESTful Completa (Blueprints)**: Desarrollo de controladores remotos (Endpoints) con soporte CRUD (CREATE, READ, UPDATE, DELETE) para todas las entidades, operando bajo el prefijo `/api/`.
- ✅ **Servicio Conector (`api.ts`)**: Implementación de un cliente asíncrono centralizado y estandarizado en el frontend para peticiones `fetch` hacia el servidor Flask.
- ✅ **Refactorización de Estados (`data-context.tsx`)**: Eliminación total del 100% de los arrays `mock`. Se ha integrado un enfoque de carga asíncrona para arrancar la aplicación, así como mutaciones locales (`Optimistic UI`) acompañadas de peticiones silenciosas de actualización. La aplicación presenta ahora persistencia viva de datos manejada 100% por el backend XAMPP.

* **Hotfixes (21/Mar/2026):** Resolví un problema de redirecciones 308 CORS configurando `strict_slashes=False` en Flask. Adicionalmente, creé un traductor en `data-context.tsx` para mapear las categorías en inglés de la base de datos (`starter`, `main`, `dessert`) a las claves en español que esperaba el frontend (`entrante`, `principal`, `postre`), restaurando así la renderización visual del menú semanal. También se mejoró la estética de las divisiones del menú usando componentes Card.
