import fs from 'fs';

const content = fs.readFileSync('work/recovered-modules-combined/0p8wmwf9uh84o__module-585035.js', 'utf8');
console.log('Length:', content.length);
console.log(content.slice(0, 3000));
