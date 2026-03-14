-- Seed shipping rates for Karachi areas
-- Based on the KARACHI_AREAS constant in src/types/index.ts

INSERT INTO public.shipping_rates (city, area, rate, min_order_for_free, is_active)
VALUES 
('Karachi', 'Gulshan-e-Iqbal', 0, 0, true),
('Karachi', 'DHA', 0, 0, true),
('Karachi', 'Clifton', 0, 0, true),
('Karachi', 'North Karachi', 0, 0, true),
('Karachi', 'Korangi', 0, 0, true),
('Karachi', 'Malir', 0, 0, true),
('Karachi', 'Saddar', 0, 0, true),
('Karachi', 'Orangi Town', 0, 0, true),
('Karachi', 'F.B Area', 0, 0, true),
('Karachi', 'Nazimabad', 0, 0, true),
('Karachi', 'Gulistan-e-Johar', 0, 0, true),
('Karachi', 'Liaquatabad', 0, 0, true),
('Karachi', 'Landhi', 0, 0, true),
('Karachi', 'Baldia Town', 0, 0, true),
('Karachi', 'New Karachi', 0, 0, true),
('Karachi', 'Shah Faisal Colony', 0, 0, true)
ON CONFLICT (area) DO UPDATE 
SET rate = EXCLUDED.rate, 
    min_order_for_free = EXCLUDED.min_order_for_free,
    is_active = EXCLUDED.is_active;
