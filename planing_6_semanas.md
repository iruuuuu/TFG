# Plan de Trabajo TFG - 6 Semanas (2h/semana)

**Objetivo:** Tener una demo funcional funcional ("MVP") para dentro de 6 semanas.
**Horario:** Martes, 2 horas cada sesión.

## Resumen del Proyecto

- **Frontend:** Next.js (App Router), Tailwind/Shadcn UI.
- **Backend:** PHP (Symfony/Structure Custom), Base de Datos SQL.
- **Estado Actual:** Estructura básica creada (Carpetas, AuthController, DishController, ReservationController).

---

## Semana 1: Backend y Base de Datos (Cimientos)

**Objetivo:** Asegurar que la base de datos está creada y el backend responde correctamente a peticiones básicas de prueba.

- **Hora 1:**
  - Revisar y ejecutar scripts SQL (`schema.sql`, `seed.sql`) para tener la BD lista.
  - Verificar conexión desde el Backend (PHP) a la BD.
  - Probar endpoints básicos de `AuthController` y `DishController` usando Postman o `curl` (Login y Listar Platos).
- **Hora 2:**
  - Corregir errores de conexión o configuración (CORS, variables de entorno .env).
  - Asegurar que el login devuelve un token o sesión válida (aunque sea simple).
  - _Entregable:_ Backend respondiendo JSON correctamente para Login y Platos.

## Semana 2: Frontend - Listado de Menú (Público)

**Objetivo:** Que la página de "Menú" muestre datos reales del backend en lugar de texto estático.

- **Hora 1:**
  - Crear/Revisar el componente de tarjeta de plato (`DishCard` o similar) en Next.js.
  - Implementar la llamada a la API (`fetch` o `axios`) en `/menu/page.tsx` para traer los platos.
- **Hora 2:**
  - Mostrar los platos dinámicamente en el grid.
  - Manejar estados de carga (Loading...) y error.
  - _Entregable:_ Página de Menú mostrando platos de la base de datos.

## Semana 3: Frontend - Login y Protección

**Objetivo:** Integrar el formulario de Login y proteger la ruta de Admin.

- **Hora 1:**
  - Conectar el formulario de `/login` con el endpoint de `AuthController`.
  - Guardar el token/sesión en cookies o localStorage tras login exitoso.
- **Hora 2:**
  - Redirigir al usuario a `/admin` o `/cocina` según su rol.
  - Proteger las rutas `/admin/*` para que si no estás logueado, te eche al login.
  - _Entregable:_ Login funcional que permite entrar al área privada.

## Semana 4: Gestión de Platos (Admin)

**Objetivo:** Poder añadir o editar un plato desde la interfaz de admin.

- **Hora 1:**
  - Crear una tabla o lista simple en `/admin` que muestre los platos actuales.
  - Añadir un botón y formulario modal para "Crear Nuevo Plato".
- **Hora 2:**
  - Conectar el formulario de creación con el endpoint de Backend (INSERT).
  - Implementar "Eliminar Plato" (básico).
  - _Entregable:_ Panel de Admin básico para gestionar el menú.

## Semana 5: Flujo de Pedidos/Reservas

**Objetivo:** Permitir crear una reserva/pedido desde la parte pública y verla en backend.

- **Hora 1:**
  - Añadir botón "Reservar" o "Pedir" en la vista pública (Menú o nueva página).
  - Formulario simple (Nombre, Fecha, Platos seleccionados).
- **Hora 2:**
  - Enviar el pedido al `ReservationController` (Backend).
  - Validar que se guarda en la base de datos.
  - _Entregable:_ Se pueden crear pedidos que quedan registrados en BD.

## Semana 6: Vista de Cocina y Demo Final

**Objetivo:** Visualizar pedidos en cocina y pulido final para la demo.

- **Hora 1:**
  - Crear vista `/cocina` que liste los pedidos pendientes (lectura de BD).
  - Añadir botón para cambiar estado (ej: "Pendiente" -> "Listo").
- **Hora 2:**
  - Prueba integral (End-to-End): Login Admin -> Crear Plato -> Login Cliente (o público) -> Hacer Pedido -> Ver en Cocina.
  - Corrección de estilos rápidos o bugs críticos.
  - _Hito:_ DEMO FUNCIONAL LISTA.

---

**Notas:**

- Si te atascas más de 20 mins en algo técnico, simplifica (ej: usa `alert` en vez de un toast bonito, o estilos básicos). Lo importante es la _funcionalidad_ para la demo.
- Usa el asistente (yo) para generar código repetitivo (como formularios o llamadas fetch) y así aprovechar mejor las 2 horas.
