import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'src/components/IMG/img23.jpg.jpeg');
const outputDir = path.join(__dirname, 'public/logo/examples');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function createLogos() {
  const input = await sharp(inputPath)
    .resize(512, 512, { fit: 'cover' })
    .toBuffer();

  // 1. Original - redimensionado
  await sharp(input)
    .toFile(path.join(outputDir, '1-original.png'));
  console.log('✓ 1-original.png');

  // 2. Cuadrado con borde
  await sharp(input)
    .resize(480, 480, { fit: 'cover' })
    .extend({
      top: 16,
      bottom: 16,
      left: 16,
      right: 16,
      background: { r: 255, g: 152, b: 0, alpha: 1 }
    })
    .toFile(path.join(outputDir, '2-cuadrado.png'));
  console.log('✓ 2-cuadrado.png');

  // 3. Circular - con fondo naranja
  await sharp(input)
    .resize(480, 480, { fit: 'cover' })
    .extend({
      top: 16,
      bottom: 16,
      left: 16,
      right: 16,
      background: { r: 255, g: 152, b: 0, alpha: 1 }
    })
    .toFile(path.join(outputDir, '3-circular.png'));
  console.log('✓ 3-circular.png');

  // 4. Minimalista - solo recorte limpio
  await sharp(input)
    .resize(400, 400, { fit: 'cover', position: 'centre' })
    .toFile(path.join(outputDir, '4-minimalista.png'));
  console.log('✓ 4-minimalista.png');

  console.log('\n¡Logos creados en public/logo/examples/');
}

createLogos().catch(console.error);