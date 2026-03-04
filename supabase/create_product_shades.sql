-- Create product_shades table
CREATE TABLE IF NOT EXISTS product_shades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    hex TEXT NOT NULL,
    is_drum_available BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE product_shades ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access for product_shades"
ON product_shades FOR SELECT
USING (true);

-- Create policy to allow admin manage access
-- This assumes existence of an 'is_admin' column in a users/profiles table or similar logic
-- For now, we allow authenticated users with admin role or specific email
CREATE POLICY "Allow admins to manage product_shades"
ON product_shades FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.uid() = id AND raw_app_meta_data->>'role' = 'admin'
    )
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_product_shades_product_id ON product_shades(product_id);
