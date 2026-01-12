-- GuMip Database Seed Data
USE gumip_db;

-- Usuarios (contraseñas hasheadas con bcrypt)
-- Contraseñas: admin123, cocina123, maestro123
INSERT INTO users (email, password, roles, name) VALUES
('admin@iesmendoza.es', '$2y$13$qPz7J9XK8xYxYGH5KZ5B5uqJ9LXqYKH5K8xYxYGH5KZ5B5uqJ9LXq', '["ROLE_ADMIN"]', 'Administrador IES'),
('cocina@iesmendoza.es', '$2y$13$qPz7J9XK8xYxYGH5KZ5B5uqJ9LXqYKH5K8xYxYGH5KZ5B5uqJ9LXq', '["ROLE_KITCHEN"]', 'Personal de Cocina'),
('maestro@iesmendoza.es', '$2y$13$qPz7J9XK8xYxYGH5KZ5B5uqJ9LXqYKH5K8xYxYGH5KZ5B5uqJ9LXq', '["ROLE_USER"]', 'Juan Pérez'),
('maestro2@iesmendoza.es', '$2y$13$qPz7J9XK8xYxYGH5KZ5B5uqJ9LXqYKH5K8xYxYGH5KZ5B5uqJ9LXq', '["ROLE_USER"]', 'María González');

-- Platos
INSERT INTO dishes (name, description, category, allergens, nutritional_info, price, is_active) VALUES
-- Entrantes
('Ensalada Mixta', 'Lechuga, tomate, zanahoria, maíz y aceitunas', 'starter', '[]', '{"calories": 120, "protein": 3, "carbs": 15, "fat": 5}', 3.50, TRUE),
('Sopa de Verduras', 'Sopa casera con verduras de temporada', 'starter', '["gluten"]', '{"calories": 85, "protein": 2, "carbs": 12, "fat": 3}', 3.00, TRUE),
('Crema de Calabaza', 'Crema suave de calabaza con especias', 'starter', '["lactose"]', '{"calories": 110, "protein": 2, "carbs": 18, "fat": 4}', 3.50, TRUE),
('Gazpacho Andaluz', 'Gazpacho frío de tomate', 'starter', '["gluten"]', '{"calories": 95, "protein": 2, "carbs": 14, "fat": 3}', 3.00, TRUE),

-- Principales
('Pollo Asado con Patatas', 'Pollo asado al horno con patatas panaderas', 'main', '[]', '{"calories": 450, "protein": 35, "carbs": 40, "fat": 15}', 6.50, TRUE),
('Pescado a la Plancha', 'Filete de merluza con verduras salteadas', 'main', '["fish"]', '{"calories": 320, "protein": 28, "carbs": 20, "fat": 12}', 7.00, TRUE),
('Macarrones Boloñesa', 'Pasta con salsa de carne casera', 'main', '["gluten", "lactose"]', '{"calories": 520, "protein": 22, "carbs": 65, "fat": 18}', 5.50, TRUE),
('Arroz con Verduras', 'Arroz salteado con verduras variadas', 'main', '[]', '{"calories": 380, "protein": 8, "carbs": 72, "fat": 6}', 5.00, TRUE),
('Lentejas Guisadas', 'Lentejas estofadas con verduras', 'main', '[]', '{"calories": 340, "protein": 18, "carbs": 54, "fat": 4}', 5.00, TRUE),

-- Postres
('Fruta del Día', 'Pieza de fruta de temporada', 'dessert', '[]', '{"calories": 80, "protein": 1, "carbs": 20, "fat": 0}', 2.00, TRUE),
('Yogur Natural', 'Yogur natural sin azúcar', 'dessert', '["lactose"]', '{"calories": 90, "protein": 5, "carbs": 12, "fat": 2}', 1.50, TRUE),
('Flan Casero', 'Flan de huevo elaborado en cocina', 'dessert', '["lactose", "eggs"]', '{"calories": 150, "protein": 4, "carbs": 22, "fat": 5}', 2.50, TRUE),
('Natillas de Chocolate', 'Natillas suaves de chocolate', 'dessert', '["lactose"]', '{"calories": 180, "protein": 5, "carbs": 28, "fat": 6}', 2.50, TRUE);

-- Menú Semanal (Semana 2, Año 2025)
INSERT INTO weekly_menus (week_number, year, day_of_week, dish_id) VALUES
-- Lunes
(2, 2025, 'monday', 1),  -- Ensalada
(2, 2025, 'monday', 5),  -- Pollo
(2, 2025, 'monday', 10), -- Fruta
-- Martes
(2, 2025, 'tuesday', 2),  -- Sopa
(2, 2025, 'tuesday', 6),  -- Pescado
(2, 2025, 'tuesday', 11), -- Yogur
-- Miércoles
(2, 2025, 'wednesday', 3),  -- Crema
(2, 2025, 'wednesday', 7),  -- Macarrones
(2, 2025, 'wednesday', 12), -- Flan
-- Jueves
(2, 2025, 'thursday', 4),  -- Gazpacho
(2, 2025, 'thursday', 8),  -- Arroz
(2, 2025, 'thursday', 13), -- Natillas
-- Viernes
(2, 2025, 'friday', 1),  -- Ensalada
(2, 2025, 'friday', 9),  -- Lentejas
(2, 2025, 'friday', 10); -- Fruta

-- Reservas de ejemplo
INSERT INTO reservations (user_id, reservation_date, dish_id, status) VALUES
(3, CURDATE(), 5, 'confirmed'),
(3, CURDATE(), 1, 'confirmed'),
(4, CURDATE(), 6, 'pending'),
(4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 7, 'pending');

-- Valoraciones
INSERT INTO ratings (user_id, dish_id, rating, comment) VALUES
(3, 5, 5, 'Excelente pollo, muy jugoso y bien sazonado'),
(3, 1, 4, 'Ensalada fresca y variada'),
(4, 6, 5, 'El pescado estaba perfecto, muy recomendable');

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
