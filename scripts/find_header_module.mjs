import fs from 'fs';
import path from 'path';

const MODS_DIR = path.resolve('work/recovered-modules-combined');

console.log('Searching modules for header-signup-button...');
const files = fs.readdirSync(MODS_DIR);

let found = [];
for (const file of files) {
  if (file.endsWith('.js') && !file.endsWith('.map')) {
    const full = path.join(MODS_DIR, file);
    const content = fs.readFileSync(full, 'utf8');
    if (content.includes('header-signup-button') || content.includes('header-login-button')) {
      console.log('Found match in module:', file);
      found.push(file);
    }
  }
}
console.log(`Search complete. Found in ${found.length} modules.`);
