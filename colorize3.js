const fs = require('fs');
const path = require('path');

const targetDirs = ['app', 'components'];

const replacements = {
  // Main Text
  '#5C5C5C': '#4A3B32', // Deep Cocoa/Brown 
  '#737373': '#877669', // Warm Taupe 
  
  // Accents
  '#F2EDA2': '#FAD85D', // Goldenrod (Warm glowing yellow from logo)
  '#F2EFC2': '#FDF1B6', // Light Goldenrod (Hover bg)
  '#F2594B': '#E8654D', // Coral/Terracotta from circles
  '#FFF5F4': '#FDF0EC', // Light Coral bg

  // Background
  '#FFFDF7': '#FAF7F0', // Creamy Off-White App Background
  '#FFFEF9': '#FFFFFF', // True White Card
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      for (const [oldHex, newHex] of Object.entries(replacements)) {
        content = content.replace(new RegExp(oldHex, 'gi'), newHex);
      }

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

targetDirs.forEach((dir) => {
  const p = path.join(__dirname, dir);
  if (fs.existsSync(p)) {
    processDirectory(p);
  }
});
console.log('Color replacement complete (Warm Culinary Theme).');
