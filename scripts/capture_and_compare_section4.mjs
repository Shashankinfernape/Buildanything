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

async function captureClip(targetId, label, scrollY, clip, outPng, outArtifact) {
  const cdp = await createCdpSender(targetId);
  await cdp.send('Page.bringToFront');

  // Scroll target into view
  await cdp.send('Runtime.evaluate', {
    expression: `window.scrollTo(0, ${scrollY})`
  });
  await new Promise(r => setTimeout(r, 600));

  const snap = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
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
  const tplClip = { x: 0, y: 1870, width: 1440, height: 963 };
  const cardsClip = { x: 39, y: 2054, width: 1347, height: 483 };

  console.log('\n--- 1. Capturing Full Section 4 Templates Region (1440x963) ---');
  await captureClip(
    LIVE_ID,
    'LIVE Templates',
    1870,
    tplClip,
    'work/analysis/compare/section4-templates-live.png',
    'work/target_artifacts/replit/live-templates-1440x963-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON Templates',
    1870,
    tplClip,
    'work/analysis/compare/section4-templates-recon.png',
    'work/target_artifacts/replit/recon-templates-1440x963-artifact.json'
  );

  console.log('\n--- 2. Capturing Templates Cards Rectangle (1347x483) ---');
  await captureClip(
    LIVE_ID,
    'LIVE Cards',
    1870,
    cardsClip,
    'work/analysis/compare/section4-cards-live.png',
    'work/target_artifacts/replit/live-tplcards-1347x483-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON Cards',
    1870,
    cardsClip,
    'work/analysis/compare/section4-cards-recon.png',
    'work/target_artifacts/replit/recon-tplcards-1347x483-artifact.json'
  );

  console.log('\n--- 3. Running rea compare-web-screenshots on Full Section 4 Templates Region ---');
  const tplDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-templates-1440x963-artifact.json work/target_artifacts/replit/recon-templates-1440x963-artifact.json --channel-threshold 1 --format json';
  const tplDiffOut = execSync(tplDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section4-templates-diff.json', tplDiffOut, 'utf8');

  const tplDiffData = JSON.parse(tplDiffOut);
  console.log('\n=== REAL REA OUTPUT ON SECTION 4 TEMPLATES REGION (1440x963) ===');
  console.log('Compared Pixels:', tplDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', tplDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', tplDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', tplDiffData.normalized_result?.mean_absolute_channel_delta);

  console.log('\n--- 4. Running rea compare-web-screenshots on Templates Cards Rectangle ---');
  const cardsDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-tplcards-1347x483-artifact.json work/target_artifacts/replit/recon-tplcards-1347x483-artifact.json --channel-threshold 1 --format json';
  const cardsDiffOut = execSync(cardsDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section4-cards-diff.json', cardsDiffOut, 'utf8');

  const cardsDiffData = JSON.parse(cardsDiffOut);
  console.log('\n=== REAL REA OUTPUT ON TEMPLATES CARDS RECTANGLE (1347x483) ===');
  console.log('Compared Pixels:', cardsDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', cardsDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', cardsDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', cardsDiffData.normalized_result?.mean_absolute_channel_delta);
}

run().catch(console.error);
