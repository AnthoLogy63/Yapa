-- ============================================
-- DATOS INICIALES PARA RECETAS
-- ============================================

-- PRIMERO: Insertar categorías (si no existen)
INSERT OR IGNORE INTO category (id, name, description)
VALUES 
    (1, 'Platos Principales', 'Platos fuertes y completos'),
    (2, 'Sopas y Caldos', 'Sopas, caldos y consomés'),
    (3, 'Postres', 'Dulces y postres'),
    (4, 'Bebidas', 'Bebidas calientes y frías'),
    (5, 'Desayunos', 'Comidas matutinas'),
    (6, 'Entradas', 'Aperitivos y entradas');

-- SEGUNDO: Insertar ingredientes básicos (si no existen)
INSERT OR IGNORE INTO ingredient (id, name, classification, type_restriction, note, date_register)
VALUES
    (1, 'Carne de Res', 'Proteína', '', 'Carne de res fresca', datetime('now')),
    (2, 'Cebolla', 'Verdura', '', 'Cebolla blanca', datetime('now')),
    (3, 'Tomate', 'Verdura', '', 'Tomate maduro', datetime('now')),
    (4, 'Ajo', 'Verdura', '', 'Ajo fresco', datetime('now')),
    (5, 'Papa', 'Tubérculo', '', 'Papa blanca', datetime('now')),
    (6, 'Sal', 'Condimento', '', 'Sal de mesa', datetime('now')),
    (7, 'Pimienta', 'Condimento', '', 'Pimienta negra', datetime('now')),
    (8, 'Aceite Vegetal', 'Aceite', '', 'Aceite de canola', datetime('now')),
    (9, 'Caldo de Res', 'Caldo', '', 'Caldo casero o cubito', datetime('now')),
    (10, 'Corn Shells', 'Cereal', '', 'Cascarones de maíz', datetime('now')),
    (11, 'Queso', 'Lácteo', 'Lactosa', 'Queso fresco', datetime('now')),
    (12, 'Lechuga', 'Verdura', '', 'Lechuga verde', datetime('now')),
    (13, 'Huevo', 'Proteína', 'Alergia a huevo', 'Huevo fresco', datetime('now')),
    (14, 'Harina', 'Cereal', 'Gluten', 'Harina de trigo', datetime('now')),
    (15, 'Azúcar', 'Condimento', '', 'Azúcar blanca', datetime('now')),
    (16, 'Leche', 'Lácteo', 'Lactosa', 'Leche fresca', datetime('now')),
    (17, 'Chocolate', 'Postre', '', 'Chocolate para beber', datetime('now')),
    (18, 'Culantro', 'Hierba', '', 'Hierba aromática', datetime('now')),
    (19, 'Comino', 'Condimento', '', 'Comino molido', datetime('now')),
    (20, 'Zanahoria', 'Verdura', '', 'Zanahoria fresca', datetime('now')),
    (21, 'Pescado Blanco', 'Proteína', '', 'Pescado fresco', datetime('now')),
    (22, 'Limón', 'Fruta', '', 'Limón fresco', datetime('now')),
    (23, 'Cebollino', 'Hierba', '', 'Cebollino fresco', datetime('now')),
    (24, 'Ají Amarillo', 'Verdura', '', 'Ají amarillo fresco', datetime('now')),
    (25, 'Papa Amarilla', 'Tubérculo', '', 'Papa amarilla peruana', datetime('now')),
    (26, 'Atún', 'Proteína', '', 'Atún conservado', datetime('now')),
    (27, 'Vinagre', 'Condimento', '', 'Vinagre tinto', datetime('now')),
    (28, 'Cebolleta', 'Verdura', '', 'Cebolleta morada', datetime('now')),
    (29, 'Camarón', 'Proteína', '', 'Camarones frescos', datetime('now')),
    (30, 'Pollo', 'Proteína', '', 'Pechuga de pollo', datetime('now')),
    (31, 'Chancaca', 'Condimento', '', 'Miel de chancaca', datetime('now')),
    (32, 'Choclo', 'Verdura', '', 'Maíz tierno', datetime('now')),
    (33, 'Aceitunas', 'Verdura', '', 'Aceitunas negras', datetime('now')),
    (34, 'Leche Condensada', 'Lácteo', 'Lactosa', 'Leche condensada', datetime('now')),
    (35, 'Jengibre', 'Hierba', '', 'Jengibre fresco', datetime('now')),
    (36, 'Cilantro', 'Hierba', '', 'Cilantro fresco', datetime('now')),
    (37, 'Arroz Blanco', 'Cereal', '', 'Arroz de grano largo', datetime('now')),
    (38, 'Caldo de Pollo', 'Caldo', '', 'Caldo de pollo', datetime('now')),
    (39, 'Achiote', 'Condimento', '', 'Achiote molido', datetime('now')),
    (40, 'Mantequilla', 'Lácteo', 'Lactosa', 'Mantequilla natural', datetime('now'));

-- TERCERO: Insertar recetas de ejemplo
-- Nota: user_id = 1 (asume que existe un usuario con ID 1)

INSERT OR IGNORE INTO recipe (id, user_id, category_id, title, description, preparation_time, difficulty, portions, visualizations, is_active, image, date_register, date_update)
VALUES
    (1, 1, 1, 'Seco de Res', 'Tradicional plato peruano con carne de res desmenuzada, acompañado de arroz y frijoles', 90, 'Medio', 4, 0, 1, 'uploads/images/seco_de_res.jpg', datetime('now'), datetime('now')),
    (2, 1, 1, 'Tacos', 'Tacos mexicanos con carne molida, lechuga, tomate y queso', 30, 'Fácil', 3, 0, 1, 'uploads/images/tacos.jpg', datetime('now'), datetime('now')),
    (3, 1, 2, 'Sopa de Cebolla', 'Sopa caliente a base de cebolla caramelizada y caldo de res', 45, 'Fácil', 4, 0, 1, 'uploads/images/sopa_cebolla.jpg', datetime('now'), datetime('now')),
    (4, 1, 1, 'Carne Guisada', 'Carne cocida en salsa de tomate con papas y verduras', 60, 'Medio', 5, 0, 1, 'uploads/images/carne_guisada.jpg', datetime('now'), datetime('now')),
    (5, 1, 5, 'Huevos Revueltos', 'Desayuno rápido con huevos revueltos, pan y queso', 15, 'Fácil', 2, 0, 1, 'uploads/images/huevos_revueltos.jpg', datetime('now'), datetime('now')),
    (6, 1, 3, 'Brownies de Chocolate', 'Postre de chocolate húmedo y delicioso', 45, 'Medio', 8, 0, 1, 'uploads/images/brownies_chocolate.jpg', datetime('now'), datetime('now')),
    (7, 1, 2, 'Caldo de Pollo', 'Caldo casero nutritivo con verduras', 60, 'Fácil', 6, 0, 1, 'uploads/images/caldo_pollo.jpg', datetime('now'), datetime('now')),
    (8, 1, 1, 'Estofado de Res', 'Carne cocida lentamente con vegetales en salsa', 120, 'Difícil', 6, 0, 1, 'uploads/images/estofado_res.jpg', datetime('now'), datetime('now')),
    (9, 1, 6, 'Ceviche', 'Plato frío de pescado crudo marinado en limón con cebolla y cilantro', 30, 'Medio', 4, 0, 1, 'uploads/images/ceviche.jpg', datetime('now'), datetime('now')),
    (10, 1, 1, 'Lomo Saltado', 'Carne de res salteada con cebolla, tomate, papas y vinagre', 45, 'Medio', 4, 0, 1, 'uploads/images/lomo_saltado.jpg', datetime('now'), datetime('now')),
    (11, 1, 6, 'Causa Limeña', 'Entrada fría de papas amarillas con atún o pollo', 50, 'Medio', 4, 0, 1, 'uploads/images/causa_limena.jpg', datetime('now'), datetime('now')),
    (12, 1, 1, 'Ají de Gallina', 'Pollo deshilachado en salsa cremosa de ají amarillo', 75, 'Medio', 4, 0, 1, 'uploads/images/aji_gallina.jpg', datetime('now'), datetime('now')),
    (13, 1, 2, 'Chupe de Camarones', 'Sopa sustanciosa de camarones con papas y leche', 60, 'Medio', 4, 0, 1, 'uploads/images/chupe_camarones.jpg', datetime('now'), datetime('now')),
    (14, 1, 1, 'Papa a la Huancaína', 'Papas cocidas con salsa cremosa de ají amarillo y queso', 40, 'Fácil', 4, 0, 1, 'uploads/images/papa_huancaina.jpg', datetime('now'), datetime('now')),
    (15, 1, 1, 'Arroz con Pollo', 'Arroz cocido con pollo, verduras y caldo de pollo', 60, 'Medio', 5, 0, 1, 'uploads/images/arroz_pollo.jpg', datetime('now'), datetime('now')),
    (16, 1, 6, 'Tiradito', 'Pescado fresco crudo en láminas delgadas con salsa de ají', 25, 'Difícil', 2, 0, 1, 'uploads/images/tiradito.jpg', datetime('now'), datetime('now')),
    (17, 1, 1, 'Anticuchos', 'Brochetas de carne marinadas en vinagre y especias', 40, 'Medio', 4, 0, 1, 'uploads/images/anticuchos.jpg', datetime('now'), datetime('now')),
    (18, 1, 1, 'Pastel de Choclo', 'Pastel salado de maíz con carne y aceitunas', 90, 'Medio', 6, 0, 1, 'uploads/images/pastel_choclo.jpg', datetime('now'), datetime('now')),
    (19, 1, 3, 'Crema Volteada', 'Postre de flan con caramelo, suave y delicioso', 50, 'Fácil', 6, 0, 1, 'uploads/images/crema_volteada.jpg', datetime('now'), datetime('now')),
    (20, 1, 3, 'Picarones', 'Fritas de masa dulce con miel de chancaca', 45, 'Medio', 8, 0, 1, 'uploads/images/picarones.jpg', datetime('now'), datetime('now'));

-- CUARTO: Insertar ingredientes para cada receta

-- Seco de Res (receta_id = 1)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (1, 1, 1, 1, 'kg', 1, 0),
    (2, 1, 2, 3, 'unidades', 2, 0),
    (3, 1, 3, 4, 'unidades', 3, 0),
    (4, 1, 4, 5, 'dientes', 4, 0),
    (5, 1, 18, 1, 'ramo pequeño', 5, 1),
    (6, 1, 19, 1, 'cucharadita', 6, 0),
    (7, 1, 6, 1, 'cucharadita', 7, 0),
    (8, 1, 7, 1, 'cucharadita', 8, 0),
    (9, 1, 8, 3, 'cucharadas', 9, 0),
    (10, 1, 9, 2, 'tazas', 10, 0);

-- Tacos (receta_id = 2)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (11, 2, 1, 500, 'gramos', 1, 0),
    (12, 2, 2, 2, 'unidades', 2, 0),
    (13, 2, 4, 3, 'dientes', 3, 0),
    (14, 2, 10, 12, 'cascarones', 4, 0),
    (15, 2, 12, 1, 'unidad', 5, 0),
    (16, 2, 3, 2, 'unidades', 6, 0),
    (17, 2, 11, 200, 'gramos', 7, 1),
    (18, 2, 6, 1, 'cucharadita', 8, 0),
    (19, 2, 7, 1, 'cucharadita', 9, 0);

-- Sopa de Cebolla (receta_id = 3)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (20, 3, 2, 8, 'unidades', 1, 0),
    (21, 3, 8, 4, 'cucharadas', 2, 0),
    (22, 3, 9, 1, 'litro', 3, 0),
    (23, 3, 6, 1, 'cucharadita', 4, 0),
    (24, 3, 7, 1, 'cucharadita', 5, 0),
    (25, 3, 11, 100, 'gramos', 6, 1);

-- Carne Guisada (receta_id = 4)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (26, 4, 1, 1, 'kg', 1, 0),
    (27, 4, 3, 4, 'unidades', 2, 0),
    (28, 4, 2, 2, 'unidades', 3, 0),
    (29, 4, 5, 800, 'gramos', 4, 0),
    (30, 4, 20, 2, 'unidades', 5, 0),
    (31, 4, 8, 3, 'cucharadas', 6, 0),
    (32, 4, 6, 1, 'cucharadita', 7, 0),
    (33, 4, 7, 1, 'cucharadita', 8, 0),
    (34, 4, 9, 1, 'taza', 9, 0);

-- Huevos Revueltos (receta_id = 5)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (35, 5, 13, 3, 'unidades', 1, 0),
    (36, 5, 8, 2, 'cucharadas', 2, 0),
    (37, 5, 2, 1, 'cucharada', 3, 0),
    (38, 5, 11, 50, 'gramos', 4, 1),
    (39, 5, 6, 1, 'pizca', 5, 0),
    (40, 5, 7, 1, 'pizca', 6, 0);

-- Brownies de Chocolate (receta_id = 6)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (41, 6, 17, 200, 'gramos', 1, 0),
    (42, 6, 15, 200, 'gramos', 2, 0),
    (43, 6, 8, 150, 'gramos', 3, 0),
    (44, 6, 13, 4, 'unidades', 4, 0),
    (45, 6, 14, 150, 'gramos', 5, 0),
    (46, 6, 6, 1, 'pizca', 6, 0);

-- Caldo de Pollo (receta_id = 7)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (47, 7, 2, 4, 'unidades', 1, 0),
    (48, 7, 20, 3, 'unidades', 2, 0),
    (49, 7, 5, 2, 'unidades', 3, 0),
    (50, 7, 4, 5, 'dientes', 4, 0),
    (51, 7, 9, 2, 'litros', 5, 0),
    (52, 7, 6, 1, 'cucharadita', 6, 0),
    (53, 7, 18, 1, 'ramo', 7, 0);

-- Estofado de Res (receta_id = 8)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (54, 8, 1, 1.5, 'kg', 1, 0),
    (55, 8, 3, 6, 'unidades', 2, 0),
    (56, 8, 2, 4, 'unidades', 3, 0),
    (57, 8, 5, 1, 'kg', 4, 0),
    (58, 8, 20, 4, 'unidades', 5, 0),
    (59, 8, 8, 4, 'cucharadas', 6, 0),
    (60, 8, 9, 1, 'litro', 7, 0),
    (61, 8, 6, 1, 'cucharadita', 8, 0),
    (62, 8, 7, 1, 'cucharadita', 9, 0);

-- Ceviche (receta_id = 9)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (63, 9, 21, 800, 'gramos', 1, 0),
    (64, 9, 22, 8, 'unidades', 2, 0),
    (65, 9, 28, 2, 'unidades', 3, 0),
    (66, 9, 36, 1, 'ramo', 4, 0),
    (67, 9, 6, 1, 'cucharadita', 5, 0),
    (68, 9, 7, 1, 'pizca', 6, 0),
    (69, 9, 23, 2, 'tallos', 7, 1);

-- Lomo Saltado (receta_id = 10)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (70, 10, 1, 800, 'gramos', 1, 0),
    (71, 10, 5, 600, 'gramos', 2, 0),
    (72, 10, 28, 2, 'unidades', 3, 0),
    (73, 10, 3, 3, 'unidades', 4, 0),
    (74, 10, 27, 3, 'cucharadas', 5, 0),
    (75, 10, 8, 3, 'cucharadas', 6, 0),
    (76, 10, 6, 1, 'cucharadita', 7, 0),
    (77, 10, 7, 1, 'cucharadita', 8, 0),
    (78, 10, 37, 2, 'tazas', 9, 0);

-- Causa Limeña (receta_id = 11)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (79, 11, 25, 1, 'kg', 1, 0),
    (80, 11, 24, 2, 'unidades', 2, 0),
    (81, 11, 22, 4, 'unidades', 3, 0),
    (82, 11, 26, 400, 'gramos', 4, 0),
    (83, 11, 8, 3, 'cucharadas', 5, 0),
    (84, 11, 6, 1, 'cucharadita', 6, 0),
    (85, 11, 16, 100, 'ml', 7, 1),
    (86, 11, 11, 100, 'gramos', 8, 1);

-- Ají de Gallina (receta_id = 12)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (87, 12, 30, 1, 'kg', 1, 0),
    (88, 12, 24, 4, 'unidades', 2, 0),
    (89, 12, 4, 6, 'dientes', 3, 0),
    (90, 12, 16, 500, 'ml', 4, 0),
    (91, 12, 8, 3, 'cucharadas', 5, 0),
    (92, 12, 14, 100, 'gramos', 6, 0),
    (93, 12, 11, 100, 'gramos', 7, 0),
    (94, 12, 13, 1, 'unidad', 8, 0),
    (95, 12, 6, 1, 'cucharadita', 9, 0);

-- Chupe de Camarones (receta_id = 13)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (96, 13, 29, 600, 'gramos', 1, 0),
    (97, 13, 5, 800, 'gramos', 2, 0),
    (98, 13, 2, 2, 'unidades', 3, 0),
    (99, 13, 4, 4, 'dientes', 4, 0),
    (100, 13, 38, 1, 'litro', 5, 0),
    (101, 13, 16, 300, 'ml', 6, 0),
    (102, 13, 8, 3, 'cucharadas', 7, 0),
    (103, 13, 6, 1, 'cucharadita', 8, 0),
    (104, 13, 23, 2, 'tallos', 9, 1);

-- Papa a la Huancaína (receta_id = 14)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (105, 14, 5, 1, 'kg', 1, 0),
    (106, 14, 24, 3, 'unidades', 2, 0),
    (107, 14, 4, 4, 'dientes', 3, 0),
    (108, 14, 16, 300, 'ml', 4, 0),
    (109, 14, 11, 150, 'gramos', 5, 0),
    (110, 14, 13, 1, 'unidad', 6, 0),
    (111, 14, 8, 2, 'cucharadas', 7, 0),
    (112, 14, 6, 1, 'cucharadita', 8, 0);

-- Arroz con Pollo (receta_id = 15)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (113, 15, 30, 1, 'kg', 1, 0),
    (114, 15, 37, 500, 'gramos', 2, 0),
    (115, 15, 38, 1, 'litro', 3, 0),
    (116, 15, 2, 2, 'unidades', 4, 0),
    (117, 15, 4, 4, 'dientes', 5, 0),
    (118, 15, 20, 2, 'unidades', 6, 0),
    (119, 15, 39, 1, 'cucharadita', 7, 0),
    (120, 15, 8, 4, 'cucharadas', 8, 0),
    (121, 15, 6, 1, 'cucharadita', 9, 0);

-- Tiradito (receta_id = 16)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (122, 16, 21, 400, 'gramos', 1, 0),
    (123, 16, 24, 2, 'unidades', 2, 0),
    (124, 16, 22, 6, 'unidades', 3, 0),
    (125, 16, 4, 3, 'dientes', 4, 0),
    (126, 16, 36, 1, 'ramo pequeño', 5, 0),
    (127, 16, 6, 1, 'pizca', 6, 0),
    (128, 16, 7, 1, 'pizca', 7, 0);

-- Anticuchos (receta_id = 17)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (129, 17, 1, 800, 'gramos', 1, 0),
    (130, 17, 27, 100, 'ml', 2, 0),
    (131, 17, 4, 8, 'dientes', 3, 0),
    (132, 17, 19, 2, 'cucharaditas', 4, 0),
    (133, 17, 6, 1, 'cucharadita', 5, 0),
    (134, 17, 7, 1, 'cucharadita', 6, 0),
    (135, 17, 8, 3, 'cucharadas', 7, 0),
    (136, 17, 24, 2, 'unidades', 8, 1);

-- Pastel de Choclo (receta_id = 18)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (137, 18, 32, 800, 'gramos', 1, 0),
    (138, 18, 1, 500, 'gramos', 2, 0),
    (139, 18, 2, 2, 'unidades', 3, 0),
    (140, 18, 30, 400, 'gramos', 4, 0),
    (141, 18, 11, 100, 'gramos', 5, 0),
    (142, 18, 33, 100, 'gramos', 6, 0),
    (143, 18, 8, 4, 'cucharadas', 7, 0),
    (144, 18, 6, 1, 'cucharadita', 8, 0),
    (145, 18, 15, 1, 'cucharada', 9, 0);

-- Crema Volteada (receta_id = 19)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (146, 19, 16, 400, 'ml', 1, 0),
    (147, 19, 34, 400, 'ml', 2, 0),
    (148, 19, 13, 5, 'unidades', 3, 0),
    (149, 19, 15, 200, 'gramos', 4, 0),
    (150, 19, 6, 1, 'pizca', 5, 0);

-- Picarones (receta_id = 20)
INSERT OR IGNORE INTO recipe_ingredient (id, recipe_id, ingredient_id, amount, unit, "order", is_optional)
VALUES
    (151, 20, 14, 300, 'gramos', 1, 0),
    (152, 20, 13, 2, 'unidades', 2, 0),
    (153, 20, 15, 50, 'gramos', 3, 0),
    (154, 20, 8, 1, 'litro', 4, 0),
    (155, 20, 6, 1, 'pizca', 5, 0),
    (156, 20, 31, 300, 'ml', 6, 0),
    (157, 20, 35, 1, 'cucharada', 7, 1);

-- ============================================
-- FIN DE DATOS INICIALES
-- ============================================
