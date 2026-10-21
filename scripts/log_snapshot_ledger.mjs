import fs from 'fs';
import crypto from 'crypto';

const buf = fs.readFileSync('work/target_artifacts/replit/live-rendered-snapshot.html');
const hash = crypto.createHash('sha256').update(buf).digest('hex');

const entry = `
## Rendered HTML Live Snapshot
| File | Source | SHA-256 Digest | Size (Bytes) |
| :--- | :--- | :--- | :--- |
| \`target_artifacts/replit/live-rendered-snapshot.html\` | CDP Runtime.evaluate (document.documentElement.outerHTML) | \`${hash}\` | ${buf.length} |
`;

fs.appendFileSync('work/analysis/evidence-ledger.md', entry, 'utf8');
console.log('Appended snapshot ledger entry. Hash:', hash);
