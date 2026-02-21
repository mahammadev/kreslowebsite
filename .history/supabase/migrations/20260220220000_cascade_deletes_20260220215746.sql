-- Migrate foreign keys to ON DELETE CASCADE

-- 1. categories parent_id
ALTER TABLE categories
DROP CONSTRAINT IF EXISTS categories_parent_id_fkey,
ADD CONSTRAINT categories_parent_id_fkey
  FOREIGN KEY (parent_id)
  REFERENCES categories(id)
  ON DELETE CASCADE;

-- 2. products category_id
ALTER TABLE products
DROP CONSTRAINT IF EXISTS products_category_id_fkey,
ADD CONSTRAINT products_category_id_fkey
  FOREIGN KEY (category_id)
  REFERENCES categories(id)
  ON DELETE CASCADE;
