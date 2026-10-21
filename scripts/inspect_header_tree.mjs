import fs from 'fs';

const h = fs.readFileSync('work/analysis/section1-header-snapshot.html', 'utf8');

// Find the outer desktop container
console.log('--- Desktop Header Structure ---');
// Let's print the top level elements inside <header>
const lines = h.split('><');
console.log('First 40 tag transitions:');
lines.slice(0, 40).forEach((l, i) => console.log(`${i}: <${l.slice(0, 100)}>`.replace(/\n/g, ' ')));
