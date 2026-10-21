import fs from 'fs';

const filePath = 'work/exported-scripts-security/files/origins/f1e5ded106b82393b400b097f423c8811c82e1586a6526808e0ce07ec7bb0b86/_next/static/chunks/1eynzrhi47s1g.js';
const code = fs.readFileSync(filePath, 'utf8');

console.log('File size:', code.length);

// Look for Severity level surrounding context
const idx1 = code.indexOf('Severity level');
if (idx1 !== -1) {
  console.log('\n--- SEVERITY LEVEL CONTEXT ---');
  console.log(code.substring(Math.max(0, idx1 - 400), Math.min(code.length, idx1 + 600)));
}

const idx2 = code.indexOf('Publishing status');
if (idx2 !== -1) {
  console.log('\n--- PUBLISHING STATUS CONTEXT ---');
  console.log(code.substring(Math.max(0, idx2 - 400), Math.min(code.length, idx2 + 600)));
}
