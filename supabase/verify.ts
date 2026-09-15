/**
 * Verifica la conexión a Supabase y la tabla products.
 * Ejecuta: npx tsx supabase/verify.ts
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Cargar .env.local manualmente
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env.local');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // Ignorar si no existe
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error('Faltan variables de entorno. Crea .env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

async function verify() {
  console.log(`Conectando a ${url}...`);

  const { data, error } = await supabase
    .from('products')
    .select('id, name, cat, price')
    .order('id');

  if (error) {
    console.error('Error al consultar products:', error.message);
    console.error('\n¿Ejecutaste el SQL en supabase/seed.sql en el SQL Editor?');
    process.exit(1);
  }

  console.log(`\n✅ Conexión exitosa. ${data.length} productos encontrados:\n`);
  console.table(data);
}

verify();
