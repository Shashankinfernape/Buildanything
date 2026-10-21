import fs from 'fs';
import path from 'path';

const MODS_DIR = path.resolve('work/recovered-modules-combined');
const files = fs.readdirSync(MODS_DIR);

console.log('Searching for "Apps & Websites" across modules...');
const matches = [];
for (const file of files) {
  if (file.endsWith('.js') && !file.endsWith('.map')) {
    const full = path.join(MODS_DIR, file);
    const content = fs.readFileSync(full, 'utf8');
    if (content.includes('Apps & Websites') || content.includes('Apps &amp; Websites')) {
      console.log('Found match in:', file);
      matches.push(file);
    }
  }
}
console.log('Matches:', matches);
