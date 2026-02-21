-- Add sku and jsonb attributes to products
ALTER TABLE products
ADD COLUMN sku TEXT UNIQUE,
ADD COLUMN attributes JSONB;

-- Add sku and jsonb variant options to product_variants, remove localized string labels
ALTER TABLE product_variants
ADD COLUMN sku TEXT UNIQUE,
ADD COLUMN variant_options JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE product_variants
DROP COLUMN label_az,
DROP COLUMN label_ru,
DROP COLUMN label_en;
