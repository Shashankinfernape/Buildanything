const fs = require('fs');
const m = JSON.parse(fs.readFileSync('work/exported-scripts/manifest.json', 'utf8'));
console.log('Scripts count:', m.scripts.length);
console.log('Sample script:', m.scripts[0]);
