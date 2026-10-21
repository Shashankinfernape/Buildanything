import WebSocket from 'ws';
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';

const LIVE_ID = '0CEBF5F820FA8AA89465BD16147DDED9';
const RECON_ID = 'A7DF9577D21FF635BD6EF295E92FAEC1';

function createCdpSender(targetId) {
  return new Promise(async (resolve, reject) => {
    try {
      const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
      await new Promise(r => ws.onopen = r);
      let cid = 1;
      const send = (method, params = {}) => new Promise((res, rej) => {
        const curId = cid++;
        const timer = setTimeout(() => rej(new Error(`CDP timeout: ${method}`)), 10000);
        const handler = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.id === curId) {
            clearTimeout(timer);
            ws.removeEventListener('message', handler);
            res(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
      resolve({ ws, send });
    } catch (err) {
      reject(err);
    }
  });
}

async function captureClip(targetId, label, clip, outPng, outArtifact) {
  const cdp = await createCdpSender(targetId);
  await cdp.send('Page.bringToFront');
  await new Promise(r => setTimeout(r, 400));

  const snap = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { ...clip, scale: 1 }
  });
  cdp.ws.close();

  const buf = Buffer.from(snap.data, 'base64');
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  const artifact = {
    sha256: sha,
    bytes: buf.length,
    media_type: 'image/png',
    data_base64: snap.data
  };

  fs.writeFileSync(outPng, buf);
  fs.writeFileSync(outArtifact, JSON.stringify(artifact, null, 2), 'utf8');
  console.log(`[AGENT-COLLECTED] ${label} (${clip.width}x${clip.height} @ y:${clip.y}) captured! bytes: ${buf.length}, sha: ${sha}`);
  return artifact;
}

async function run() {
  const bentoClip = { x: 0, y: 838, width: 1440, height: 1032 };
  const cardsClip = { x: 23, y: 1090, width: 1380, height: 656 };

  console.log('\n--- 1. Capturing Full Section 3 Bento Region (1440x1032) ---');
  await captureClip(
    LIVE_ID,
    'LIVE Bento',
    bentoClip,
    'work/analysis/compare/section3-bento-live.png',
    'work/target_artifacts/replit/live-bento-1440x1032-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON Bento',
    bentoClip,
    'work/analysis/compare/section3-bento-recon.png',
    'work/target_artifacts/replit/recon-bento-1440x1032-artifact.json'
  );

  console.log('\n--- 2. Capturing Bento Grid 4-Cards Rectangle (1380x656) ---');
  await captureClip(
    LIVE_ID,
    'LIVE Cards',
    cardsClip,
    'work/analysis/compare/section3-cards-live.png',
    'work/target_artifacts/replit/live-cards-1380x656-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON Cards',
    cardsClip,
    'work/analysis/compare/section3-cards-recon.png',
    'work/target_artifacts/replit/recon-cards-1380x656-artifact.json'
  );

  console.log('\n--- 3. Running rea compare-web-screenshots on Full Section 3 Bento Region ---');
  const bentoDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-bento-1440x1032-artifact.json work/target_artifacts/replit/recon-bento-1440x1032-artifact.json --channel-threshold 1 --format json';
  const bentoDiffOut = execSync(bentoDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section3-bento-diff.json', bentoDiffOut, 'utf8');

  const bentoDiffData = JSON.parse(bentoDiffOut);
  console.log('\n=== REAL REA OUTPUT ON SECTION 3 BENTO REGION (1440x1032) ===');
  console.log('Compared Pixels:', bentoDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', bentoDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', bentoDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', bentoDiffData.normalized_result?.mean_absolute_channel_delta);

  console.log('\n--- 4. Running rea compare-web-screenshots on 4-Cards Rectangle ---');
  const cardsDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-cards-1380x656-artifact.json work/target_artifacts/replit/recon-cards-1380x656-artifact.json --channel-threshold 1 --format json';
  const cardsDiffOut = execSync(cardsDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section3-cards-diff.json', cardsDiffOut, 'utf8');

  const cardsDiffData = JSON.parse(cardsDiffOut);
  console.log('\n=== REAL REA OUTPUT ON 4-CARDS RECTANGLE (1380x656) ===');
  console.log('Compared Pixels:', cardsDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', cardsDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', cardsDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', cardsDiffData.normalized_result?.mean_absolute_channel_delta);
}

run().catch(console.error);
