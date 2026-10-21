import fs from 'fs';

const h = fs.readFileSync('work/analysis/section1-header-snapshot.html', 'utf8');

const dataAttrs = new Set();
const attrRegex = /data-[a-zA-Z0-9-]+="([^"]*)"/g;
let m;
while ((m = attrRegex.exec(h)) !== null) {
  dataAttrs.add(m[0]);
}

console.log('All data-* attributes in header snapshot:');
Array.from(dataAttrs).forEach(a => console.log(' ', a));

// Check buttons in nav
const btnRegex = /<button[^>]*>([\s\S]*?)<\/button>/gi;
const buttons = [];
while ((m = btnRegex.exec(h)) !== null) {
  const text = m[1].replace(/<[^>]+>/g, '').trim();
  buttons.push({ text, tag: m[0].slice(0, 150) });
}
console.log('\nButtons in header:');
buttons.forEach(b => console.log(' Button text:', JSON.stringify(b.text)));
