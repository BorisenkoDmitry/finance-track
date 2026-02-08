// Build check script for frontend and backend
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;

console.log('=== Building Frontend ===\n');
try {
  process.chdir(path.join(rootDir, 'frontend'));
  console.log('Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('\nBuilding frontend...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✓ Frontend build successful!\n');
} catch (e) {
  console.error('\n✗ Frontend build failed!');
  console.error(e.message);
  process.exit(1);
}

console.log('=== Building Backend ===\n');
try {
  process.chdir(path.join(rootDir, 'backend'));
  console.log('Installing backend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('\nBuilding backend...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✓ Backend build successful!\n');
} catch (e) {
  console.error('\n✗ Backend build failed!');
  console.error(e.message);
  process.exit(1);
}

console.log('=== All builds completed successfully! ===');
