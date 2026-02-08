// Node.js script to create .env file with generated secrets
const fs = require('fs');
const path = require('path');

const deployDir = __dirname;
const envExamplePath = path.join(deployDir, 'env.example');
const envPath = path.join(deployDir, '.env');

// Generate random string
function randomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

if (!fs.existsSync(envPath)) {
  console.log('Creating .env from env.example...');
  let content = fs.readFileSync(envExamplePath, 'utf8');
  
  // Replace JWT_SECRET if still default
  if (content.includes('JWT_SECRET=CHANGE_ME')) {
    content = content.replace(/JWT_SECRET=CHANGE_ME[^\n]*/, `JWT_SECRET=${randomString(64)}`);
  }
  
  // Replace POSTGRES_PASSWORD if still default
  if (content.includes('POSTGRES_PASSWORD=CHANGE_ME')) {
    content = content.replace(/POSTGRES_PASSWORD=CHANGE_ME[^\n]*/, `POSTGRES_PASSWORD=${randomString(32)}`);
  }
  
  // Replace SEED_ADMIN_PASSWORD if still default
  if (content.includes('SEED_ADMIN_PASSWORD=CHANGE_ME')) {
    content = content.replace(/SEED_ADMIN_PASSWORD=CHANGE_ME[^\n]*/, `SEED_ADMIN_PASSWORD=${randomString(24)}`);
  }
  
  fs.writeFileSync(envPath, content, 'utf8');
  console.log('.env created with generated secrets!');
} else {
  console.log('.env already exists, skipping creation.');
}
