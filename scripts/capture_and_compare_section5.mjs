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
  const platformClip = { x: 0, y: 2833, width: 1440, height: 884 };
  const cardsClip = { x: 55, y: 3081, width: 1316, height: 604 };

  console.log('\n--- 1. Capturing Full Section 5 Platform Region (1440x884) ---');
  await captureClip(
    LIVE_ID,
    'LIVE Platform',
    2833,
    platformClip,
    'work/analysis/compare/section5-platform-live.png',
    'work/target_artifacts/replit/live-platform-1440x884-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON Platform',
    2833,
    platformClip,
    'work/analysis/compare/section5-platform-recon.png',
    'work/target_artifacts/replit/recon-platform-1440x884-artifact.json'
  );

  console.log('\n--- 2. Capturing Platform 4-Cards Grid Rectangle (1316x604) ---');
  await captureClip(
    LIVE_ID,
    'LIVE Cards',
    2833,
    cardsClip,
    'work/analysis/compare/section5-cards-live.png',
    'work/target_artifacts/replit/live-platformcards-1316x604-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON Cards',
    2833,
    cardsClip,
    'work/analysis/compare/section5-cards-recon.png',
    'work/target_artifacts/replit/recon-platformcards-1316x604-artifact.json'
  );

  console.log('\n--- 3. Running rea compare-web-screenshots on Full Section 5 Platform Region ---');
  const platDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-platform-1440x884-artifact.json work/target_artifacts/replit/recon-platform-1440x884-artifact.json --channel-threshold 1 --format json';
  const platDiffOut = execSync(platDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section5-platform-diff.json', platDiffOut, 'utf8');

  const platDiffData = JSON.parse(platDiffOut);
  console.log('\n=== REAL REA OUTPUT ON SECTION 5 PLATFORM REGION (1440x884) ===');
  console.log('Compared Pixels:', platDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', platDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', platDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', platDiffData.normalized_result?.mean_absolute_channel_delta);

  console.log('\n--- 4. Running rea compare-web-screenshots on 4-Cards Rectangle ---');
  const cardsDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-platformcards-1316x604-artifact.json work/target_artifacts/replit/recon-platformcards-1316x604-artifact.json --channel-threshold 1 --format json';
  const cardsDiffOut = execSync(cardsDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section5-cards-diff.json', cardsDiffOut, 'utf8');

  const cardsDiffData = JSON.parse(cardsDiffOut);
  console.log('\n=== REAL REA OUTPUT ON PLATFORM 4-CARDS RECTANGLE (1316x604) ===');
  console.log('Compared Pixels:', cardsDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', cardsDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', cardsDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', cardsDiffData.normalized_result?.mean_absolute_channel_delta);
}

run().catch(console.error);
