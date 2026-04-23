-- Mendos Database Seed Data (Completo - mínimo 10 registros por tabla)
USE mendos_db;

-- =============================================
-- 1. USUARIOS (10 registros)
-- Contraseñas: admin123, cocina123, maestro123 (hasheadas con bcrypt)
-- =============================================
INSERT INTO users (email, password, roles, name) VALUES
('admin@iesmendoza.es', '$2b$12$gumM2sKw7yXNq34FSVtq7uDH0z9Ck6hv.STkZVaih0s0b2o8m2bJe', '["ROLE_ADMIN"]', 'Administrador IES'),
('cocina@iesmendoza.es', '$2b$12$qFlzM.mpPZ0A7PwAISPt7e8XK4DpvWcVQedeGmjZBUeX.GyYVPqlO', '["ROLE_KITCHEN"]', 'Personal de Cocina'),
('cocina2@iesmendoza.es', '$2b$12$qFlzM.mpPZ0A7PwAISPt7e8XK4DpvWcVQedeGmjZBUeX.GyYVPqlO', '["ROLE_KITCHEN"]', 'Auxiliar de Cocina'),
('maestro@iesmendoza.es', '$2b$12$MZbMG5bwDDb9MNc0QYoqVOkulOWZxovvK0bfs/CRsdkz3/cPO24KG', '["ROLE_USER"]', 'Juan Pérez'),
('maestro2@iesmendoza.es', '$2b$12$MZbMG5bwDDb9MNc0QYoqVOkulOWZxovvK0bfs/CRsdkz3/cPO24KG', '["ROLE_USER"]', 'María González'),
('maestro3@iesmendoza.es', '$2b$12$MZbMG5bwDDb9MNc0QYoqVOkulOWZxovvK0bfs/CRsdkz3/cPO24KG', '["ROLE_USER"]', 'Carlos López'),
('maestro4@iesmendoza.es', '$2b$12$MZbMG5bwDDb9MNc0QYoqVOkulOWZxovvK0bfs/CRsdkz3/cPO24KG', '["ROLE_USER"]', 'Ana Martínez'),
('maestro5@iesmendoza.es', '$2b$12$MZbMG5bwDDb9MNc0QYoqVOkulOWZxovvK0bfs/CRsdkz3/cPO24KG', '["ROLE_USER"]', 'Pedro Sánchez'),
('maestro6@iesmendoza.es', '$2b$12$MZbMG5bwDDb9MNc0QYoqVOkulOWZxovvK0bfs/CRsdkz3/cPO24KG', '["ROLE_USER"]', 'Laura Fernández'),
('maestro7@iesmendoza.es', '$2b$12$MZbMG5bwDDb9MNc0QYoqVOkulOWZxovvK0bfs/CRsdkz3/cPO24KG', '["ROLE_USER"]', 'David Ruiz');

-- =============================================
-- 2. PLATOS (14 registros) - con gestión de stock
-- =============================================
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

-- Platos repetidos en diferentes fechas
('Ensalada Mixta', 'Lechuga, tomate, zanahoria, maíz y aceitunas', 'starter', '[]', '{"calories": 120, "protein": 3, "carbs": 15, "fat": 5}', 3.50, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 20, 0, TRUE),
('Pollo Asado con Patatas', 'Pollo asado al horno con patatas panaderas', 'main', '[]', '{"calories": 450, "protein": 35, "carbs": 40, "fat": 15}', 6.50, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 15, 0, TRUE);

-- =============================================
-- 3. RESERVAS DE PLATOS (12 registros)
-- =============================================
INSERT INTO reservations (user_id, reservation_date, dish_id, quantity, status, notes) VALUES
-- Juan Pérez (user 4)
(4, CURDATE(), 2, 2, 'confirmed', 'Sin salsa por favor'),
(4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 4, 1, 'pending', NULL),
(4, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 8, 1, 'pending', 'Extra queso'),

-- María González (user 5)
(5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 5, 1, 'confirmed', NULL),
(5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 6, 1, 'confirmed', NULL),
(5, CURDATE(), 1, 1, 'completed', 'Muy buena'),

-- Carlos López (user 6)
(6, CURDATE(), 2, 1, 'confirmed', NULL),
(6, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 7, 2, 'pending', NULL),

-- Ana Martínez (user 7)
(7, CURDATE(), 3, 1, 'confirmed', 'Me encanta el flan'),
(7, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 10, 1, 'pending', NULL),

-- Pedro Sánchez (user 8)
(8, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 4, 2, 'confirmed', 'Para llevar'),

-- Laura Fernández (user 9)
(9, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 9, 1, 'pending', 'Sin azúcar extra');

-- =============================================
-- 4. VALORACIONES (12 registros)
-- Restricción: un usuario solo puede valorar cada plato una vez
-- =============================================
INSERT INTO ratings (user_id, dish_id, rating, comment) VALUES
(4, 2, 5, 'Excelente pollo, muy jugoso y bien sazonado'),
(4, 1, 4, 'Ensalada fresca y variada'),
(4, 3, 4, 'Buen flan, textura perfecta'),
(5, 5, 5, 'El pescado estaba perfecto, muy recomendable'),
(5, 1, 3, 'Correcta pero le falta variedad'),
(5, 6, 4, 'Yogur cremoso y natural'),
(6, 2, 4, 'Muy rico, el pollo estaba en su punto'),
(6, 3, 5, 'El mejor flan que he probado en el comedor'),
(7, 1, 5, 'Fresca y abundante, muy bien aliñada'),
(7, 3, 3, 'Correcto pero prefiero otro postre'),
(8, 4, 4, 'Sopa calentita y sabrosa'),
(9, 2, 5, 'Riquísimo, repetiría sin duda');

-- =============================================
-- 5. INVENTARIO (12 registros)
-- =============================================
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
('Leche (litros)', 15.0, 'litros', 10.0),
('Huevos (docenas)', 8.0, 'docenas', 4.0),
('Patatas (kg)', 22.0, 'kg', 12.0);

-- =============================================
-- 6. EVENTOS GASTRONÓMICOS (10 registros)
-- =============================================
INSERT INTO gastro_events (name, description, date, max_capacity, current_attendees, dishes, status, created_by) VALUES
('Degustación Mediterránea', 'Jornada de platos típicos del Mediterráneo con aceite de oliva virgen', DATE_ADD(NOW(), INTERVAL 5 DAY), 30, 4, '["Ensalada griega", "Hummus", "Gazpacho"]', 'active', 'admin@iesmendoza.es'),
('Taller de Repostería', 'Aprende a hacer postres caseros con nuestro equipo de cocina', DATE_ADD(NOW(), INTERVAL 7 DAY), 15, 2, '["Flan casero", "Natillas", "Bizcocho"]', 'active', 'cocina@iesmendoza.es'),
('Semana de la Cocina Japonesa', 'Descubre los sabores del Japón: sushi, ramen y tempura', DATE_ADD(NOW(), INTERVAL 10 DAY), 25, 0, '["Sushi variado", "Ramen tonkotsu", "Tempura"]', 'active', 'admin@iesmendoza.es'),
('Menú Saludable - Nutrición', 'Charla sobre nutrición equilibrada con degustación incluida', DATE_ADD(NOW(), INTERVAL 12 DAY), 40, 6, '["Ensalada quinoa", "Pollo al vapor", "Fruta"]', 'active', 'admin@iesmendoza.es'),
('Cata de Zumos Naturales', 'Prueba diferentes combinaciones de zumos frescos de temporada', DATE_ADD(NOW(), INTERVAL 14 DAY), 20, 0, '["Zumo naranja-zanahoria", "Smoothie verde", "Limonada"]', 'active', 'cocina@iesmendoza.es'),
('Cocina Italiana Express', 'Pasta fresca, pizza artesana y tiramisú casero', DATE_ADD(NOW(), INTERVAL 3 DAY), 35, 8, '["Pasta carbonara", "Pizza margarita", "Tiramisú"]', 'active', 'cocina@iesmendoza.es'),
('Desayuno Saludable', 'Aprende a preparar desayunos equilibrados y nutritivos', DATE_ADD(NOW(), INTERVAL 15 DAY), 20, 1, '["Tostadas integrales", "Smoothie bowl", "Granola"]', 'active', 'admin@iesmendoza.es'),
('Fiesta de Fin de Trimestre', 'Celebración gastronómica con platos especiales', DATE_ADD(NOW(), INTERVAL 20 DAY), 50, 10, '["Paella", "Cochinillo", "Tarta"]', 'active', 'admin@iesmendoza.es'),
('Cocina Sin Gluten', 'Taller especializado en recetas aptas para celíacos', DATE_ADD(NOW(), INTERVAL 8 DAY), 18, 3, '["Pan sin gluten", "Pasta de arroz", "Brownie sin gluten"]', 'active', 'cocina@iesmendoza.es'),
('Mercado de Temporada', 'Degustación de productos locales de temporada con productores invitados', DATE_ADD(NOW(), INTERVAL 25 DAY), 45, 0, '["Quesos artesanos", "Embutidos", "Frutas"]', 'active', 'admin@iesmendoza.es');

-- =============================================
-- 7. RESERVAS DE EVENTOS (12 registros)
-- =============================================
INSERT INTO event_reservations (event_id, user_id, user_name, status, attended) VALUES
-- Degustación Mediterránea (event 1) - 4 inscritos
(1, 4, 'Juan Pérez', 'confirmed', FALSE),
(1, 5, 'María González', 'confirmed', FALSE),
(1, 6, 'Carlos López', 'confirmed', FALSE),
(1, 7, 'Ana Martínez', 'confirmed', FALSE),

-- Taller de Repostería (event 2) - 2 inscritos
(2, 8, 'Pedro Sánchez', 'confirmed', FALSE),
(2, 9, 'Laura Fernández', 'confirmed', FALSE),

-- Menú Saludable (event 4) - 6 inscritos
(4, 4, 'Juan Pérez', 'confirmed', FALSE),
(4, 5, 'María González', 'confirmed', FALSE),
(4, 6, 'Carlos López', 'confirmed', FALSE),
(4, 7, 'Ana Martínez', 'confirmed', FALSE),
(4, 8, 'Pedro Sánchez', 'confirmed', FALSE),
(4, 10, 'David Ruiz', 'confirmed', FALSE);

-- =============================================
-- 8. REGISTROS DE ACTIVIDAD (12 registros)
-- =============================================
INSERT INTO activity_logs (action, details, user_name, user_role, timestamp) VALUES
('LOGIN', 'Inicio de sesión exitoso', 'Administrador IES', 'ROLE_ADMIN', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('CREATE_DISH', 'Creado plato: Ensalada Mixta', 'Personal de Cocina', 'ROLE_KITCHEN', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('CREATE_DISH', 'Creado plato: Pollo Asado con Patatas', 'Personal de Cocina', 'ROLE_KITCHEN', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('CREATE_RESERVATION', 'Reserva de 2x Pollo Asado', 'Juan Pérez', 'ROLE_USER', DATE_SUB(NOW(), INTERVAL 23 HOUR)),
('CREATE_RESERVATION', 'Reserva de 1x Pescado a la Plancha', 'María González', 'ROLE_USER', DATE_SUB(NOW(), INTERVAL 22 HOUR)),
('UPDATE_STOCK', 'Actualizado stock de Pollo (kg): 25.5', 'Personal de Cocina', 'ROLE_KITCHEN', DATE_SUB(NOW(), INTERVAL 20 HOUR)),
('CREATE_EVENT', 'Creado evento: Degustación Mediterránea', 'Administrador IES', 'ROLE_ADMIN', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('EVENT_RESERVATION', 'Inscripción en Degustación Mediterránea', 'Juan Pérez', 'ROLE_USER', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('CREATE_RATING', 'Valoración 5★ para Pollo Asado con Patatas', 'Juan Pérez', 'ROLE_USER', DATE_SUB(NOW(), INTERVAL 18 HOUR)),
('LOGIN', 'Inicio de sesión exitoso', 'Personal de Cocina', 'ROLE_KITCHEN', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
('UPDATE_INVENTORY', 'Actualizado inventario: Merluza 8.0 kg', 'Auxiliar de Cocina', 'ROLE_KITCHEN', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
('CANCEL_RESERVATION', 'Cancelada reserva #3 por el usuario', 'Carlos López', 'ROLE_USER', DATE_SUB(NOW(), INTERVAL 12 HOUR));

-- =============================================
-- VERIFICACIÓN de datos insertados
-- =============================================
SELECT 'users' as tabla, COUNT(*) as registros FROM users
UNION ALL SELECT 'dishes', COUNT(*) FROM dishes
UNION ALL SELECT 'reservations', COUNT(*) FROM reservations
UNION ALL SELECT 'ratings', COUNT(*) FROM ratings
UNION ALL SELECT 'inventory', COUNT(*) FROM inventory
UNION ALL SELECT 'gastro_events', COUNT(*) FROM gastro_events
UNION ALL SELECT 'event_reservations', COUNT(*) FROM event_reservations
UNION ALL SELECT 'activity_logs', COUNT(*) FROM activity_logs;
