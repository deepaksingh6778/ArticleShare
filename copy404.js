const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist', 'ArticleShare', 'browser');
const indexFile = path.join(distPath, 'index.html');
const notFoundFile = path.join(distPath, '404.html');

if (fs.existsSync(indexFile)) {
  fs.copyFileSync(indexFile, notFoundFile);
  console.log('✅ 404.html created successfully from index.html');
} else {
  console.error('❌ index.html not found. Run `ng build` first.');
  process.exit(1);
}
