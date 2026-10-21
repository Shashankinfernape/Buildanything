import fs from 'fs';

const content = fs.readFileSync('work/recovered-modules-combined/0p8wmwf9uh84o__module-43423.js', 'utf8');
console.log('File length:', content.length);
console.log('First 2000 chars:');
console.log(content.slice(0, 2000));
