/**
 * Simple deployment helper script
 * 
 * This script can be extended to automate deployment to various platforms
 * such as Vercel, Netlify, AWS S3, or any other hosting service.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const outDir = path.join(__dirname, 'out');
const deploymentTarget = process.argv[2] || 'local'; // Default to local if no target specified

// Ensure the out directory exists
if (!fs.existsSync(outDir)) {
  console.error('Error: The "out" directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Helper function to execute commands
function runCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Deploy based on target
switch (deploymentTarget) {
  case 'local':
    console.log('Starting local server to preview the static export...');
    runCommand('npx serve out');
    break;
    
  case 'vercel':
    console.log('Deploying to Vercel...');
    runCommand('npx vercel --prod');
    break;
    
  case 'netlify':
    console.log('Deploying to Netlify...');
    runCommand('npx netlify deploy --dir=out --prod');
    break;
    
  // Add more deployment targets as needed
    
  default:
    console.log(`Unknown deployment target: ${deployTarget}`);
    console.log('Available targets: local, vercel, netlify');
    process.exit(1);
}