-- GuMip Database Seed Data (Actualizado para Sistema de Stock)
USE gumip_db;

-- Usuarios (contraseñas hasheadas con bcrypt)
-- Contraseñas: admin123, cocina123, maestro123
INSERT INTO users (email, password, roles, name) VALUES
('admin@iesmendoza.es', '$2y$13$qPz7J9XK8xYxYGH5KZ5B5uqJ9LXqYKH5K8xYxYGH5KZ5B5uqJ9LXq', '["ROLE_ADMIN"]', 'Administrador IES'),
('cocina@iesmendoza.es', '$2y$13$qPz7J9XK8xYxYGH5KZ5B5uqJ9LXqYKH5K8xYxYGH5KZ5B5uqJ9LXq', '["ROLE_KITCHEN"]', 'Personal de Cocina'),
('maestro@iesmendoza.es', '$2y$13$qPz7J9XK8xYxYGH5KZ5B5uqJ9LXqYKH5K8xYxYGH5KZ5B5uqJ9LXq', '["ROLE_USER"]', 'Juan Pérez'),
('maestro2@iesmendoza.es', '$2y$13$qPz7J9XK8xYxYGH5KZ5B5uqJ9LXqYKH5K8xYxYGH5KZ5B5uqJ9LXq', '["ROLE_USER"]', 'María González');

-- Platos con gestión de stock
-- Cada plato ahora tiene: fecha de disponibilidad, stock total y stock reservado
-- Category es opcional (apenas informativo)

INSERT INTO dishes (name, description, category, allergens, nutritional_info, price, available_date, stock_total, stock_reserved, is_active) VALUES
-- Platos para hoy
('Ensalada Mixta', 'Lechuga, tomate, zanahoria, maíz y aceitunas', 'starter', '[]', '{"calories": 120, "protein": 3, "carbs": 15, "fat": 5}', 3.50, CURDATE(), 20, 0, TRUE),
('Pollo Asado con Patatas', 'Pollo asado al horno con patatas panaderas', 'main', '[]', '{"calories": 450, "protein": 35, "carbs": 40, "fat": 15}', 6.50, CURDATE(), 15, 2, TRUE),
('Flan Casero', 'Flan de huevo elaborado en cocina', 'dessert', '["lactose", "eggs"]', '{"calories": 150, "protein": 4, "carbs": 22, "fat": 5}', 2.50, CURDATE(), 25, 0, TRUE),

-- Platos para mañana
('Sopa de Verduras', 'Sopa casera con verduras de temporada', 'starter', '["gluten"]', '{"calories": 85, "protein": 2, "carbs": 12, "fat": 3}', 3.00, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 18, 1, TRUE),
('Pescado a la Plancha', 'Filete de merluza con verduras salteadas', 'main', '["fish"]', '{"calories": 320, "protein": 28, "carbs": 20, "fat": 12}', 7.00, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 12, 0, TRUE),
('Yogur Natural', 'Yogur natural sin azúcar', 'dessert', '["lactose"]', '{"calories": 90, "protein": 5, "carbs": 12, "fat": 2}', 1.50, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 30, 1, TRUE),

-- Platos para pasado mañana
('Crema de Calabaza', 'Crema suave de calabaza con especias', 'starter', '["lactose"]', '{"calories": 110, "protein": 2, "carbs": 18, "fat": 4}', 3.50, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 20, 0, TRUE),
('Macarrones Boloñesa', 'Pasta con salsa de carne casera', 'main', '["gluten", "lactose"]', '{"calories": 520, "protein": 22, "carbs": 65, "fat": 18}', 5.50, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 25, 0, TRUE),
('Natillas de Chocolate', 'Natillas suaves de chocolate', 'dessert', '["lactose"]', '{"calories": 180, "protein": 5, "carbs": 28, "fat": 6}', 2.50, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 20, 0, TRUE),

-- Platos para dentro de 3 días
('Gazpacho Andaluz', 'Gazpacho frío de tomate', 'starter', '["gluten"]', '{"calories": 95, "protein": 2, "carbs": 14, "fat": 3}', 3.00, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 15, 0, TRUE),
('Arroz con Verduras', 'Arroz salteado con verduras variadas', NULL, '[]', '{"calories": 380, "protein": 8, "carbs": 72, "fat": 6}', 5.00, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 18, 0, TRUE),
('Fruta del Día', 'Pieza de fruta de temporada', NULL, '[]', '{"calories": 80, "protein": 1, "carbs": 20, "fat": 0}', 2.00, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 40, 0, TRUE),

-- Platos para dentro de 4 días
('Lentejas Guisadas', 'Lentejas estofadas con verduras', 'main', '[]', '{"calories": 340, "protein": 18, "carbs": 54, "fat": 4}', 5.00, DATE_ADD(CURDATE(), INTERVAL 4 DAY), 20, 0, TRUE),

-- Ejemplo: mismo plato en diferentes fechas
('Ensalada Mixta', 'Lechuga, tomate, zanahoria, maíz y aceitunas', 'starter', '[]', '{"calories": 120, "protein": 3, "carbs": 15, "fat": 5}', 3.50, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 20, 0, TRUE),
('Pollo Asado con Patatas', 'Pollo asado al horno con patatas panaderas', 'main', '[]', '{"calories": 450, "protein": 35, "carbs": 40, "fat": 15}', 6.50, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 15, 0, TRUE);

-- Reservas de ejemplo (con cantidad)
INSERT INTO reservations (user_id, reservation_date, dish_id, quantity, status) VALUES
-- Usuario 3 (Juan Pérez) reservó para hoy
(3, CURDATE(), 2, 2, 'confirmed'),  -- 2 unidades de Pollo Asado

-- Usuario 4 (María González) reservó para mañana
(4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 4, 1, 'pending'),  -- 1 Sopa
(4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 6, 1, 'confirmed'); -- 1 Yogur

-- Valoraciones
INSERT INTO ratings (user_id, dish_id, rating, comment) VALUES
(3, 2, 5, 'Excelente pollo, muy jugoso y bien sazonado'),
(3, 1, 4, 'Ensalada fresca y variada'),
(4, 5, 5, 'El pescado estaba perfecto, muy recomendable');

-- Inventario
INSERT INTO inventory (ingredient_name, quantity, unit, minimum_stock) VALUES
('Pollo (kg)', 25.5, 'kg', 10.0),
('Merluza (kg)', 8.0, 'kg', 5.0),
('Pasta (kg)', 15.0, 'kg', 10.0),
('Arroz (kg)', 20.0, 'kg', 15.0),
('Lentejas (kg)', 12.0, 'kg', 8.0),
('Lechuga (unidades)', 30, 'unidades', 20),
('Tomate (kg)', 18.0, 'kg', 10.0),
('Calabaza (kg)', 5.0, 'kg', 3.0),
('Aceite (litros)', 10.0, 'litros', 5.0),
('Leche (litros)', 15.0, 'litros', 10.0);

-- Verificación de datos insertados
SELECT 'Platos disponibles hoy' as info, COUNT(*) as total FROM dishes WHERE available_date = CURDATE();
SELECT 'Stock total disponible' as info, SUM(stock_total - stock_reserved) as total FROM dishes WHERE is_active = TRUE;
SELECT 'Reservas activas' as info, COUNT(*) as total FROM reservations WHERE status IN ('pending', 'confirmed');
