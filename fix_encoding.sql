SET NAMES utf8mb4;
UPDATE dishes SET allergens = REPLACE(allergens, 'LÃ¡cteos', 'Lácteos');
UPDATE dishes SET allergens = REPLACE(allergens, 'CrustÃ¡ceos', 'Crustáceos');
UPDATE dishes SET allergens = REPLACE(allergens, 'SÃ©samo', 'Sésamo');
UPDATE dishes SET allergens = REPLACE(allergens, 'Altramuces', 'Altramuces');
UPDATE dishes SET allergens = REPLACE(allergens, 'Moluscos', 'Moluscos');
-- Just in case, redo the whole translation with correct encoding
UPDATE dishes SET allergens = REPLACE(allergens, '"lactose"', '"Lácteos"');
UPDATE dishes SET allergens = REPLACE(allergens, '"eggs"', '"Huevos"');
UPDATE dishes SET allergens = REPLACE(allergens, '"gluten"', '"Gluten"');
UPDATE dishes SET allergens = REPLACE(allergens, '"fish"', '"Pescado"');
