import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const files = [
  'work/analysis/css-tokens.json',
  'work/analysis/svg-icons.json',
  'work/analysis/interactive-state-machines.md',
  'work/analysis/cms-fixtures.json'
];

let appendText = '\n## Step 3 Ground-Truth Extracted Artifacts (Hard Gate)\n\n';
appendText += '| Artifact | SHA-256 Digest | Size (Bytes) |\n';
appendText += '| :--- | :--- | :--- |\n';

for (const f of files) {
  const buf = fs.readFileSync(path.resolve(f));
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  appendText += `| \`${f}\` | \`${hash}\` | ${buf.length} |\n`;
}

fs.appendFileSync(path.resolve('work/analysis/evidence-ledger.md'), appendText, 'utf8');
console.log('Successfully logged Step 3 artifacts in evidence-ledger.md');
