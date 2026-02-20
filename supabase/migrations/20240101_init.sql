-- 3.1 settings
CREATE TABLE settings (
  id          SERIAL PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES ('whatsapp_number', '994554017464');

-- 3.2 categories
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_az     TEXT NOT NULL,
  name_ru     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug   ON categories(slug);

-- 3.3 products
CREATE TABLE products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_az          TEXT NOT NULL,
  name_ru          TEXT NOT NULL,
  name_en          TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  description_az   TEXT,
  description_ru   TEXT,
  description_en   TEXT,
  category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
  price            NUMERIC(10, 2) NOT NULL,
  discount_price   NUMERIC(10, 2),
  discount_ends_at TIMESTAMPTZ,
  image_url        TEXT NOT NULL,
  extra_images     TEXT[],
  is_active        BOOLEAN DEFAULT TRUE,
  in_stock         BOOLEAN DEFAULT TRUE,
  sort_order       INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category  ON products(category_id);
CREATE INDEX idx_products_slug      ON products(slug);
CREATE INDEX idx_products_active    ON products(is_active);

-- 3.4 product_variants
CREATE TABLE product_variants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label_az     TEXT NOT NULL,
  label_ru     TEXT NOT NULL,
  label_en     TEXT NOT NULL,
  image_url    TEXT,
  price_delta  NUMERIC(10, 2) DEFAULT 0,
  in_stock     BOOLEAN DEFAULT TRUE,
  sort_order   INT DEFAULT 0
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

-- 3.5 bundles
CREATE TABLE bundles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_az             TEXT NOT NULL,
  name_ru             TEXT NOT NULL,
  name_en             TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description_az      TEXT,
  description_ru      TEXT,
  description_en      TEXT,
  discount_percentage NUMERIC(5, 2) NOT NULL DEFAULT 10,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 bundle_items
CREATE TABLE bundle_items (
  bundle_id  UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (bundle_id, product_id)
);

-- 3.7 Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3.8 Useful Views
CREATE VIEW active_flash_sales AS
SELECT * FROM products
WHERE is_active = TRUE
  AND discount_price IS NOT NULL
  AND (discount_ends_at IS NULL OR discount_ends_at > NOW());

CREATE VIEW category_tree AS
SELECT
  c.id, c.name_az, c.name_ru, c.name_en, c.slug, c.sort_order,
  p.name_az AS parent_name_az,
  p.name_ru AS parent_name_ru,
  p.name_en AS parent_name_en
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id;

-- 4. RLS Policies
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read active bundles" ON bundles FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read bundle items" ON bundle_items FOR SELECT USING (TRUE);
CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (TRUE);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (TRUE);

CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access bundles" ON bundles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access bundle_items" ON bundle_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access variants" ON product_variants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (auth.role() = 'authenticated');
-- NOTE: The 'authenticated' role check assumes that public signups are disabled in Supabase Auth settings.
-- Only the admin user (shop owner) should be invited via email.
-- If public signups are enabled, these policies must be updated to check for specific admin privileges (e.g. email or roles table).
