/**
 * Script para migrar imagenes existentes a Supabase Storage
 * 
 * Ejecutar con: npx tsx scripts/migrate-images.ts
 * 
 * Requiere variables de entorno:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (service_role key para uploads)
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Imagenes a migrar (mapeo de archivos locales a nombres en Storage)
const IMAGES_TO_MIGRATE = [
  'star.png',
  'heart.png',
  'golden-heart.png',
  'lightning.png',
  'peace.png',
  'purple-heart.png',
  'five-star.png',
  'medal.png',
  'award.png',
  'like.png',
  'love.png',
  'console.png',
  'eighth-note.png',
];

async function migrateImages() {
  const publicDir = path.join(process.cwd(), 'public', 'assets', 'thiings');
  
  console.log('Migrando imagenes a Supabase Storage...\n');

  for (const filename of IMAGES_TO_MIGRATE) {
    const filePath = path.join(publicDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  No encontrado: ${filename}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(fileBuffer);

    // Determinar content type
    const ext = path.extname(filename).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
    };
    const contentType = contentTypes[ext] || 'image/png';

    // Upload a Supabase Storage
    const { error } = await supabase.storage
      .from('products')
      .upload(filename, uint8Array, {
        contentType,
        upsert: true, // Sobrescribir si ya existe
      });

    if (error) {
      console.log(`❌ Error subiendo ${filename}: ${error.message}`);
    } else {
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filename);
      
      console.log(`✅ ${filename} → ${data.publicUrl}`);
    }
  }

  console.log('\nMigracion completada!');
}

migrateImages().catch(console.error);
