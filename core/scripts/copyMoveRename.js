// move-files.js
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'env/core');
const targetDir = path.join(__dirname, 'core/env');

// Ensure the target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Read files from the source directory
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('Error reading source directory:', err);
    return;
  }

  files.forEach(file => {
    const sourceFile = path.join(sourceDir, file);
    const targetFile = path.join(targetDir, file.replace('.example', ''));

    // Move and rename the file
    fs.rename(sourceFile, targetFile, err => {
      if (err) {
        console.error(`Error moving file ${file}:`, err);
      } else {
        console.log(`Moved and renamed ${file} to ${path.basename(targetFile)}`);
      }
    });
  });
});
