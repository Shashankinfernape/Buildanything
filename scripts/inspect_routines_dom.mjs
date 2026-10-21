import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/routines_main_outer.html', 'utf8');
const idx = html.indexOf('pt-800');
console.log('--- Routines Body ---');
console.log(html.slice(idx, idx + 3000));
