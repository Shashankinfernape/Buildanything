import fs from 'fs';
import crypto from 'crypto';
import { execSync } from 'child_process';

function makeArtifact(pngPath, outArtifactPath) {
  const buf = fs.readFileSync(pngPath);
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  const artifact = {
    sha256: sha,
    bytes: buf.length,
    media_type: 'image/png',
    data_base64: buf.toString('base64')
  };
  fs.writeFileSync(outArtifactPath, JSON.stringify(artifact, null, 2), 'utf8');
  return artifact;
}

// 1. Bento Full Region (1440x1032)
makeArtifact('work/analysis/compare/test-live-clip.png', 'work/target_artifacts/replit/live-bento-1440x1032-artifact.json');
makeArtifact('work/analysis/compare/test-recon-clip.png', 'work/target_artifacts/replit/recon-bento-1440x1032-artifact.json');

// 2. Bento 4-Cards Rectangle (1380x656)
makeArtifact('work/analysis/compare/test-live-cards.png', 'work/target_artifacts/replit/live-cards-1380x656-artifact.json');
makeArtifact('work/analysis/compare/test-recon-cards.png', 'work/target_artifacts/replit/recon-cards-1380x656-artifact.json');

console.log('--- 1. Comparing Full Section 3 Bento Region (1440x1032) ---');
const bentoCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-bento-1440x1032-artifact.json work/target_artifacts/replit/recon-bento-1440x1032-artifact.json --channel-threshold 1 --format json';
const bentoOut = execSync(bentoCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
fs.writeFileSync('work/analysis/compare/section3-bento-diff.json', bentoOut, 'utf8');

const bentoDiff = JSON.parse(bentoOut);
console.log('\n=== REAL REA OUTPUT: FULL SECTION 3 BENTO REGION (1440x1032) ===');
console.log('Compared Pixels:', bentoDiff.normalized_result?.compared_pixels);
console.log('Changed Pixels:', bentoDiff.normalized_result?.changed_pixels);
console.log('Changed Ratio:', bentoDiff.normalized_result?.changed_ratio);
console.log('Mean Absolute Channel Delta:', bentoDiff.normalized_result?.mean_absolute_channel_delta);

console.log('\n--- 2. Comparing Bento 4-Cards Rectangle (1380x656) ---');
const cardsCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-cards-1380x656-artifact.json work/target_artifacts/replit/recon-cards-1380x656-artifact.json --channel-threshold 1 --format json';
const cardsOut = execSync(cardsCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
fs.writeFileSync('work/analysis/compare/section3-cards-diff.json', cardsOut, 'utf8');

const cardsDiff = JSON.parse(cardsOut);
console.log('\n=== REAL REA OUTPUT: 4-CARDS RECTANGLE (1380x656) ===');
console.log('Compared Pixels:', cardsDiff.normalized_result?.compared_pixels);
console.log('Changed Pixels:', cardsDiff.normalized_result?.changed_pixels);
console.log('Changed Ratio:', cardsDiff.normalized_result?.changed_ratio);
console.log('Mean Absolute Channel Delta:', cardsDiff.normalized_result?.mean_absolute_channel_delta);
