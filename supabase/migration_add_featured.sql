-- =============================================================
-- Dra. Mew Store — Migración: añadir is_featured
-- Ejecuta en el SQL Editor de Supabase DESPUÉS del seed.sql
-- =============================================================

-- 1. Añadir columna is_featured (default false)
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 2. Marcar productos destacados (Mew, Charizard, Carta Mew ex)
UPDATE products SET is_featured = true WHERE id IN (1, 4, 9);

-- 3. Índice para queries de featured
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- 4. Policy para lectura de featured (ya cubierta por la policy existente de anon)
