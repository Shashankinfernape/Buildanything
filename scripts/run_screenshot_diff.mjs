import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const RECON_TARGET_ID = 'EF126D6F639FC6BD22E6DFE7BE611164';

console.log('Capturing reconstruction viewport screenshot Evidence...');
const reconEvidenceOut = execSync(
  `rea capture-web-screenshot http://127.0.0.1:9222 ${RECON_TARGET_ID} --format json`,
  { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
);

const reconEvidence = JSON.parse(reconEvidenceOut);
fs.writeFileSync('work/target_artifacts/replit/recon-screenshot-evidence.json', JSON.stringify(reconEvidence, null, 2), 'utf8');

const artifact = reconEvidence.normalized_result?.artifact;
fs.writeFileSync('work/target_artifacts/replit/recon-screenshot-artifact.json', JSON.stringify(artifact, null, 2), 'utf8');
console.log('Saved recon-screenshot-artifact.json.');

console.log('Running rea compare-web-screenshots...');
const diffOut = execSync(
  'rea compare-web-screenshots work/target_artifacts/replit/live-screenshot-artifact.json work/target_artifacts/replit/recon-screenshot-artifact.json --format json',
  { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
);

fs.writeFileSync('work/analysis/screenshot-pixel-diff.json', diffOut, 'utf8');
console.log('Saved screenshot-pixel-diff.json!');
const diffData = JSON.parse(diffOut);
console.log('Pixel Diff Result:', JSON.stringify(diffData.normalized_result || diffData, null, 2));
