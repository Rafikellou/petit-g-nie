const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'icon-192x192.png': 192,
  'icon-512x512.png': 512
};

const BACKGROUND_COLOR = '#0B1120';

async function generateIcons() {
  const inputImage = path.join(__dirname, '../public/logo-original.png');
  const outputDir = path.join(__dirname, '../public/icons');

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  for (const [filename, size] of Object.entries(sizes)) {
    const outputPath = path.join(outputDir, filename);
    
    // Create a square background
    const composite = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BACKGROUND_COLOR
      }
    })
    .png()
    .toBuffer();

    // Resize logo and composite it on the background
    await sharp(inputImage)
      .resize(Math.round(size * 0.8), Math.round(size * 0.8), {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer()
      .then(input => 
        sharp(composite)
          .composite([{
            input,
            gravity: 'center'
          }])
          .png()
          .toFile(outputPath)
      );

    console.log(`Generated ${filename}`);
  }
}

generateIcons().catch(console.error);
