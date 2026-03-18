-- Migración para actualizar base de datos existente a sistema de stock
-- Ejecutar DESPUÉS del schema.sql inicial si ya hay datos en la BD

USE gumip_db;

-- PASO 1: Eliminar tabla weekly_menus (ya no necesaria)
DROP TABLE IF EXISTS weekly_menus;

-- PASO 2: Modificar tabla dishes - añadir campos de stock
ALTER TABLE dishes
    -- Cambiar category de ENUM a VARCHAR nullable
    MODIFY COLUMN category VARCHAR(20) NULL COMMENT 'Opcional: solo informativo',
    
    -- Añadir campos de gestión de stock
    ADD COLUMN available_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL 1 DAY) COMMENT 'Fecha específica de disponibilidad' AFTER is_active,
    ADD COLUMN stock_total INT NOT NULL DEFAULT 10 COMMENT 'Stock total disponible' AFTER available_date,
    ADD COLUMN stock_reserved INT NOT NULL DEFAULT 0 COMMENT 'Unidades ya reservadas' AFTER stock_total,
    
    -- Añadir índices
    ADD INDEX idx_available_date (available_date),
    ADD INDEX idx_stock (stock_total, stock_reserved),
    
    -- Añadir constraints
    ADD CONSTRAINT chk_stock_reserved CHECK (stock_reserved >= 0),
    ADD CONSTRAINT chk_stock_total CHECK (stock_total >= stock_reserved),
    
    -- Eliminar índice antiguo de category
    DROP INDEX idx_category;

-- PASO 3: Actualizar platos existentes con valores por defecto
-- Establecer fecha de disponibilidad = mañana para todos los platos activos
UPDATE dishes 
SET available_date = DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY)
WHERE available_date IS NULL OR available_date = '0000-00-00';

-- PASO 4: Modificar tabla reservations - añadir campo quantity
ALTER TABLE reservations
    ADD COLUMN quantity INT NOT NULL DEFAULT 1 COMMENT 'Cantidad de unidades reservadas' AFTER dish_id,
    ADD CONSTRAINT chk_quantity CHECK (quantity >= 1);

-- PASO 5: Actualizar reservas existentes
-- Todas las reservas anteriores tienen quantity = 1
UPDATE reservations 
SET quantity = 1 
WHERE quantity IS NULL OR quantity = 0;

-- PASO 6: Calcular stock_reserved basado en reservas existentes
-- Para cada plato, contar cuántas reservas activas tiene y actualizar stock_reserved
UPDATE dishes d
SET stock_reserved = (
    SELECT COALESCE(SUM(r.quantity), 0)
    FROM reservations r
    WHERE r.dish_id = d.id 
    AND r.status IN ('pending', 'confirmed')
    AND r.reservation_date = d.available_date
)
WHERE d.id IN (SELECT DISTINCT dish_id FROM reservations);

-- VERIFICACIÓN: Mostrar estadísticas de la migración
SELECT 
    'Platos migrados' as tipo,
    COUNT(*) as total,
    SUM(stock_total) as stock_total_sum,
    SUM(stock_reserved) as stock_reserved_sum
FROM dishes
UNION ALL
SELECT 
    'Reservas migradas' as tipo,
    COUNT(*) as total,
    SUM(quantity) as cantidad_total,
    NULL
FROM reservations;

-- Mostrar platos con stock
SELECT 
    id, 
    name, 
    available_date, 
    stock_total, 
    stock_reserved, 
    (stock_total - stock_reserved) as stock_disponible
FROM dishes 
WHERE is_active = TRUE
ORDER BY available_date ASC
LIMIT 10;

COMMIT;
