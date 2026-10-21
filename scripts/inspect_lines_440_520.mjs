import fs from 'fs';

const content = fs.readFileSync('work/recovered-modules-combined/0p8wmwf9uh84o__module-127388.js', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(440, 520).join('\n'));
