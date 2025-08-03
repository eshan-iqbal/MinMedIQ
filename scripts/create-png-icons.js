const fs = require('fs');
const path = require('path');

// Create a simple SVG that can be converted to PNG
const createSimpleIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0f172a"/>
  <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" fill="#1e293b"/>
  <circle cx="${size * 0.5}" cy="${size * 0.4}" r="${size * 0.15}" fill="#3b82f6"/>
  <text x="${size * 0.5}" y="${size * 0.7}" text-anchor="middle" fill="white" font-size="${size * 0.2}" font-family="Arial">M</text>
</svg>
`;

// Create HTML files for each icon size
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
  const svg = createSimpleIcon(size);
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Icon ${size}x${size}</title>
  <style>
    body { margin: 0; padding: 20px; background: #f0f0f0; }
    .icon { background: white; padding: 10px; border-radius: 8px; display: inline-block; }
  </style>
</head>
<body>
  <div class="icon">
    ${svg}
  </div>
  <p>Right-click the icon above and save as PNG</p>
  <p>Save as: icon-${size}x${size}.png</p>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.html`), html);
  console.log(`Created icon-${size}x${size}.html`);
});

console.log('\n✅ Icon HTML files created!');
console.log('📝 Instructions:');
console.log('1. Open each HTML file in your browser');
console.log('2. Right-click the icon and save as PNG');
console.log('3. Save with the exact filename (e.g., icon-192x192.png)');
console.log('4. Place all PNG files in public/icons/ folder');
console.log('\n🌐 Quick access:');
console.log('http://localhost:9003/icons/icon-192x192.html'); 