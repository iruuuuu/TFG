UPDATE dishes SET stock = stock_total;
UPDATE dishes SET precio = price;
UPDATE dishes SET allergens = REPLACE(allergens, '"lactose"', '"Lácteos"');
UPDATE dishes SET allergens = REPLACE(allergens, '"eggs"', '"Huevos"');
UPDATE dishes SET allergens = REPLACE(allergens, '"gluten"', '"Gluten"');
UPDATE dishes SET allergens = REPLACE(allergens, '"fish"', '"Pescado"');
