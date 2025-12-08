/**
 * Script to fix CSS export in Next.js static export
 * 
 * This script:
 * 1. Copies CSS files from the .next directory to the out directory
 * 2. Updates HTML files to ensure CSS paths are correct for static hosting
 */

const fs = require('fs');
const path = require('path');

// Paths
const nextCssDir = path.join(__dirname, '.next', 'static', 'css');
const outCssDir = path.join(__dirname, 'out', '_next', 'static', 'css');
const outDir = path.join(__dirname, 'out');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outCssDir)) {
  console.log(`Creating directory: ${outCssDir}`);
  fs.mkdirSync(outCssDir, { recursive: true });
}

// Copy CSS files
try {
  const cssFiles = fs.readdirSync(nextCssDir);
  
  if (cssFiles.length === 0) {
    console.log('No CSS files found in .next/static/css');
    process.exit(0);
  }
  
  console.log(`Found ${cssFiles.length} CSS files to copy:`);
  
  cssFiles.forEach(file => {
    const sourcePath = path.join(nextCssDir, file);
    const destPath = path.join(outCssDir, file);
    
    console.log(`Copying ${file} to ${destPath}`);
    fs.copyFileSync(sourcePath, destPath);
  });
  
  console.log('CSS files copied successfully!');
  
  // Fix HTML files to ensure CSS paths work correctly
  console.log('Fixing HTML files to ensure CSS paths work correctly...');
  
  // Function to process HTML files recursively
  function processHtmlFiles(directory) {
    const items = fs.readdirSync(directory);
    
    items.forEach(item => {
      const itemPath = path.join(directory, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        processHtmlFiles(itemPath);
      } else if (item.endsWith('.html')) {
        console.log(`Processing HTML file: ${itemPath}`);
        let content = fs.readFileSync(itemPath, 'utf8');
        
        // Fix CSS paths in HTML files
        // This ensures that CSS references work correctly on static hosting
        content = content.replace(
          /(href=["'])(\/_next\/static\/css\/[^"']+)(["'])/g, 
          (match, prefix, cssPath, suffix) => {
            // Calculate relative path from current HTML file to root
            const relativeToRoot = path.relative(directory, outDir).replace(/\\/g, '/');
            const newPath = relativeToRoot ? `${relativeToRoot}${cssPath}` : cssPath.substring(1);
            return `${prefix}${newPath}${suffix}`;
          }
        );
        
        fs.writeFileSync(itemPath, content);
      }
    });
  }
  
  // Process all HTML files
  processHtmlFiles(outDir);
  console.log('HTML files updated successfully!');
  
} catch (error) {
  console.error('Error processing files:', error);
  process.exit(1);
}