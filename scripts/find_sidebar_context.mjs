import fs from 'fs';
import path from 'path';

function searchAll(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      searchAll(full);
    } else if (entry.name.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('contentOffset')) {
        console.log('Found contentOffset in:', full);
        let idx = 0;
        while ((idx = content.indexOf('contentOffset', idx)) !== -1) {
          console.log('--- snippet ---');
          console.log(content.slice(Math.max(0, idx - 100), idx + 200));
          idx += 13;
        }
      }
    }
  }
}

searchAll('work/exported-scripts-signed-in/files/origins/');
