const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, '../public/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create placeholder SVG icon
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="64" fill="#0f172a"/>
  <rect x="64" y="64" width="384" height="384" rx="32" fill="#1e293b"/>
  <circle cx="256" cy="200" r="40" fill="#3b82f6"/>
  <rect x="176" y="280" width="160" height="8" rx="4" fill="#64748b"/>
  <rect x="176" y="300" width="120" height="8" rx="4" fill="#64748b"/>
  <rect x="176" y="320" width="140" height="8" rx="4" fill="#64748b"/>
  <rect x="176" y="340" width="100" height="8" rx="4" fill="#64748b"/>
  <rect x="176" y="360" width="160" height="8" rx="4" fill="#64748b"/>
  <rect x="176" y="380" width="80" height="8" rx="4" fill="#64748b"/>
</svg>
`;

// Create placeholder icons
iconSizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  
  // Create SVG version
  fs.writeFileSync(svgPath, svgIcon);
  
  // Create a simple HTML file that can be converted to PNG
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    svg { width: ${size}px; height: ${size}px; }
  </style>
</head>
<body>
  ${svgIcon}
</body>
</html>
  `;
  
  const htmlPath = path.join(iconsDir, `icon-${size}x${size}.html`);
  fs.writeFileSync(htmlPath, htmlContent);
  
  console.log(`Created icon-${size}x${size}.html (convert to PNG manually)`);
});

// Create shortcut icons
const shortcuts = ['dashboard', 'billing', 'inventory', 'customers'];
shortcuts.forEach(shortcut => {
  const htmlPath = path.join(iconsDir, `${shortcut}-96x96.html`);
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    svg { width: 96px; height: 96px; }
  </style>
</head>
<body>
  ${svgIcon}
</body>
</html>
  `;
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`Created ${shortcut}-96x96.html`);
});

console.log('\nPWA icon files created!');
console.log('To convert HTML files to PNG:');
console.log('1. Open each HTML file in a browser');
console.log('2. Take a screenshot or use browser dev tools to save as PNG');
console.log('3. Replace the HTML files with PNG files');
console.log('\nOr use online tools like:');
console.log('- https://convertio.co/html-png/');
console.log('- https://www.ilovepdf.com/html-to-png'); 