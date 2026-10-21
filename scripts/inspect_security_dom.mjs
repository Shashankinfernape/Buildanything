import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/security_main_outer.html', 'utf8');
const idx = html.indexOf('max-w-[640px]');
console.log('--- Security Body ---');
console.log(html.slice(idx, idx + 4000));
