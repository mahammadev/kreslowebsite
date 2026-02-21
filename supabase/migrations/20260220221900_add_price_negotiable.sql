-- Add price_negotiable column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_negotiable BOOLEAN DEFAULT FALSE;
