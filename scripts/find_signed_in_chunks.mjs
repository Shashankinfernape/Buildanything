import fs from 'fs';
import path from 'path';

function walk(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) res.push(...walk(p));
    else if (p.endsWith('.js')) res.push(p);
  }
  return res;
}

const files = walk('work/exported-scripts-signed-in/files');
const terms = [
  'HomeChatSuggestions',
  'Recent projects',
  'what are we working on today',
  'Personal workspace',
  'replit-ui-theme-root'
];

for (const term of terms) {
  const matches = [];
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes(term)) {
      matches.push({ file: path.basename(f), fullPath: f, size: content.length });
    }
  }
  console.log(`Term: "${term}" matched in ${matches.length} files:`);
  for (const m of matches) {
    console.log(`  - ${m.file} (${m.size} bytes) -> ${m.fullPath}`);
  }
}
