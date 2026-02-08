// Node.js script to run docker compose
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const deployDir = __dirname;
const projectRoot = path.join(deployDir, '..');

// Change to deploy directory
process.chdir(deployDir);

console.log('=== Finance Track - Local Development Setup ===\n');

// Check Docker
console.log('Checking Docker...');
try {
  execSync('docker version', { stdio: 'ignore' });
  console.log('Docker is ready!\n');
} catch (e) {
  console.error('ERROR: Docker Desktop is not running!');
  console.error('Please start Docker Desktop and wait for it to initialize.');
  process.exit(1);
}

// Setup .env
const envPath = path.join(deployDir, '.env');
const envExamplePath = path.join(deployDir, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('Creating .env from env.example...');
  const setupEnv = require('./setup-env.js');
  console.log('');
} else {
  console.log('.env already exists, skipping creation.\n');
}

// Stop existing
console.log('Stopping existing containers (if any)...');
try {
  execSync('docker compose -f docker-compose.yml -f docker-compose.local.yml down', { stdio: 'ignore' });
} catch (e) {
  // Ignore errors
}
console.log('');

// Build and start
console.log('Building and starting containers...');
try {
  execSync('docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build', { stdio: 'inherit' });
} catch (e) {
  console.error('ERROR: Failed to start containers!');
  process.exit(1);
}

console.log('\nWaiting for services to be ready...');
setTimeout(() => {
  console.log('\n=== Container Status ===');
  try {
    execSync('docker compose ps', { stdio: 'inherit' });
  } catch (e) {
    // Ignore
  }
  
  console.log('\n=== Local Development Environment Ready! ===\n');
  console.log('Frontend (Nginx):  http://localhost:8080/');
  console.log('Backend API:       http://localhost:3000/');
  console.log('PostgreSQL:        localhost:5432\n');
  console.log('To view logs:');
  console.log('  docker compose logs -f backend');
  console.log('  docker compose logs -f web\n');
}, 10000);
