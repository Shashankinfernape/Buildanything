import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

const allFiles = walk('work/exported-scripts-security/files');
console.log('Total files in exported scripts:', allFiles.length);

for (const f of allFiles) {
  if (!f.endsWith('.js')) continue;
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('Severity level')) {
    console.log('Found "Severity level" in:', f);
  }
  if (content.includes('Publishing status')) {
    console.log('Found "Publishing status" in:', f);
  }
  if (content.includes('Publish visibility')) {
    console.log('Found "Publish visibility" in:', f);
  }
  if (content.includes('MultiSelectDropdown')) {
    console.log('Found "MultiSelectDropdown" in:', f);
  }
}
