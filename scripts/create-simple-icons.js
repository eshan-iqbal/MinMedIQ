const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple SVG icon that can be used as PNG
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.125}" fill="#0f172a"/>
  <rect x="${size * 0.125}" y="${size * 0.125}" width="${size * 0.75}" height="${size * 0.75}" rx="${size * 0.0625}" fill="#1e293b"/>
  <circle cx="${size * 0.5}" cy="${size * 0.4}" r="${size * 0.15}" fill="#3b82f6"/>
  <rect x="${size * 0.35}" y="${size * 0.55}" width="${size * 0.3}" height="${size * 0.02}" rx="${size * 0.01}" fill="#64748b"/>
  <rect x="${size * 0.35}" y="${size * 0.6}" width="${size * 0.25}" height="${size * 0.02}" rx="${size * 0.01}" fill="#64748b"/>
  <rect x="${size * 0.35}" y="${size * 0.65}" width="${size * 0.28}" height="${size * 0.02}" rx="${size * 0.01}" fill="#64748b"/>
  <rect x="${size * 0.35}" y="${size * 0.7}" width="${size * 0.2}" height="${size * 0.02}" rx="${size * 0.01}" fill="#64748b"/>
  <rect x="${size * 0.35}" y="${size * 0.75}" width="${size * 0.3}" height="${size * 0.02}" rx="${size * 0.01}" fill="#64748b"/>
  <rect x="${size * 0.35}" y="${size * 0.8}" width="${size * 0.15}" height="${size * 0.02}" rx="${size * 0.01}" fill="#64748b"/>
</svg>
`;

// Create HTML files that can be converted to PNG
iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      background: transparent;
    }
    svg { 
      width: ${size}px; 
      height: ${size}px; 
      display: block;
    }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>
  `;
  
  const htmlPath = path.join(iconsDir, `icon-${size}x${size}.html`);
  fs.writeFileSync(htmlPath, htmlContent);
  
  console.log(`Created icon-${size}x${size}.html`);
});

// Create shortcut icons
const shortcuts = ['dashboard', 'billing', 'inventory', 'customers'];
shortcuts.forEach(shortcut => {
  const svgContent = createSVGIcon(96);
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      background: transparent;
    }
    svg { 
      width: 96px; 
      height: 96px; 
      display: block;
    }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>
  `;
  
  const htmlPath = path.join(iconsDir, `${shortcut}-96x96.html`);
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`Created ${shortcut}-96x96.html`);
});

console.log('\nIcon HTML files created!');
console.log('To convert to PNG:');
console.log('1. Open each HTML file in a browser');
console.log('2. Right-click and "Save as" PNG');
console.log('3. Or use browser dev tools to save as PNG');
console.log('\nQuick conversion method:');
console.log('1. Open http://localhost:9003/icons/icon-192x192.html');
console.log('2. Take a screenshot or save as PNG');
console.log('3. Repeat for other sizes'); 