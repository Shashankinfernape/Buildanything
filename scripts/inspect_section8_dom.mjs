import fs from 'fs';

const html = fs.readFileSync('work/analysis/section8-logoblock-live-dom.html', 'utf8');

console.log('HTML length:', html.length);
console.log('First 1500 chars:');
console.log(html.slice(0, 1500));
