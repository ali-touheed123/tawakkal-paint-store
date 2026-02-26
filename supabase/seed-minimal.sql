-- Minimal seed with no images first
INSERT INTO products (name, brand, category, sub_category, description, price_quarter, price_gallon, price_drum, in_stock) VALUES
('Weather Coat Elegance Emulsion', 'Berger', 'decorative', 'interior', 'Premium interior emulsion', 1450, 4900, 22800, true),
('Weather Coat Silk Finish', 'Berger', 'decorative', 'interior', 'Luxurious silk finish', 1600, 5500, 25500, true),
('Weather Coat NU Emulsion', 'Berger', 'decorative', 'interior', 'Premium quality emulsion', 1350, 4600, 21400, true),
('Weather Coat Super Gloss Enamel', 'Berger', 'decorative', 'wood_metal', 'Super gloss enamel', 1750, 6000, 27900, true),
('Weather Coat Weather Pro', 'Berger', 'decorative', 'exterior', 'Advanced exterior paint', 1650, 5600, 26000, true),
('Berger Red Oxide Primer', 'Berger', 'decorative', 'wood_metal', 'Red oxide primer', 950, 3200, 0, true),
('Gobis Gold Wall Emulsion', 'Gobi''s', 'decorative', 'interior', 'Premium gold wall emulsion', 1550, 5300, 24600, true),
('Gobis Gold Enamel', 'Gobi''s', 'decorative', 'wood_metal', 'Premium gold enamel', 1800, 6200, 28800, true),
('Gobis Silksheen Emulsion', 'Gobi''s', 'decorative', 'interior', 'Silksheen emulsion', 1600, 5500, 25500, true),
('Diamond Matt Finish', 'Diamond', 'decorative', 'interior', 'Premium matt finish', 1350, 4600, 21400, true),
('Diamond Enamel', 'Diamond', 'decorative', 'wood_metal', 'High quality enamel', 1750, 6000, 27900, true),
('Reliance Matt Enamel', 'Reliance', 'decorative', 'wood_metal', 'Matt enamel paint', 1600, 5500, 25500, true),
('Reliance Weather Guard', 'Reliance', 'decorative', 'exterior', 'Weather guard', 1450, 4900, 22800, true),
('Reliable Everlast Weather Proof', 'Reliable', 'decorative', 'exterior', 'Everlast weather proof', 1550, 5300, 24600, true);

SELECT COUNT(*) as total_products FROM products;
