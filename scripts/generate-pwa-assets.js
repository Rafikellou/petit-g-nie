const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Configuration des tailles d'icônes
const iconSizes = [192, 512];

// Configuration des écrans de démarrage iOS
const splashScreens = [
  // iPhone SE, iPod Touch
  { width: 640, height: 1136, name: 'splash-640x1136.png' },
  // iPhone 8, iPhone 7, iPhone 6s
  { width: 750, height: 1334, name: 'splash-750x1334.png' },
  // iPhone 14 Pro Max, 13 Pro Max, 12 Pro Max
  { width: 1284, height: 2778, name: 'splash-1284x2778.png' },
  // iPad Pro 12.9"
  { width: 2048, height: 2732, name: 'splash-2048x2732.png' },
];

// Fonction pour créer une icône
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fond dégradé
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#8B5CF6');
  gradient.addColorStop(1, '#7C3AED');
  
  ctx.fillStyle = gradient;
  
  // Dessiner un carré arrondi
  const radius = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.closePath();
  ctx.fill();

  // Ajouter le texte
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.4}px -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JB', size/2, size/2);

  return canvas;
}

// Créer le dossier public s'il n'existe pas
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Générer les icônes
iconSizes.forEach(size => {
  const canvas = createIcon(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, `icon-${size}x${size}.png`), buffer);
  console.log(`Created icon-${size}x${size}.png`);
});

// Générer les écrans de démarrage
splashScreens.forEach(screen => {
  const canvas = createCanvas(screen.width, screen.height);
  const ctx = canvas.getContext('2d');

  // Fond dégradé
  const gradient = ctx.createLinearGradient(0, 0, screen.width, screen.height);
  gradient.addColorStop(0, '#0F172A');
  gradient.addColorStop(1, '#1E293B');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, screen.width, screen.height);

  // Dessiner le logo
  const logoSize = Math.min(screen.width, screen.height) * 0.2;
  const logoCanvas = createIcon(logoSize);
  ctx.drawImage(logoCanvas, (screen.width - logoSize) / 2, (screen.height - logoSize) / 2);

  // Ajouter le texte
  ctx.fillStyle = 'white';
  ctx.font = `bold ${logoSize * 0.3}px -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Futur Génie', screen.width / 2, (screen.height + logoSize) / 2 + logoSize * 0.4);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, screen.name), buffer);
  console.log(`Created ${screen.name}`);
});
