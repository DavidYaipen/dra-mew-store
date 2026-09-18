-- =============================================================
-- Dra. Mew Store — Migración: los productos nuevos nacen con
-- stock = 0 en vez de "sin rastrear" (NULL). No toca filas
-- existentes ni agrega NOT NULL (hay productos en preventa con
-- stock NULL que se migran manualmente al editarlos, no de golpe).
-- Ejecuta en el SQL Editor de Supabase DESPUÉS de
-- migration_preorder_stock_checkout.sql
-- =============================================================

ALTER TABLE products ALTER COLUMN stock SET DEFAULT 0;
