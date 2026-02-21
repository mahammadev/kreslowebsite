-- Fix: Add Storage Bucket and RLS Policies for Image Uploads

BEGIN;

-- Elevate privileges to modify the protected storage schema
SET LOCAL ROLE postgres;

-- 1. Create the product-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public can read all images in product-images
CREATE POLICY "Public Access to Product Images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- 4. Policy: Authenticated Admins can upload images
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- 5. Policy: Authenticated Admins can update images
CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- 6. Policy: Authenticated Admins can delete images
CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

COMMIT;
