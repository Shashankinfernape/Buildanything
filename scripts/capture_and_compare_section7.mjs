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
  const pricingClip = { x: 0, y: 4367, width: 1440, height: 775 };
  const cardsClip = { x: 32, y: 4613, width: 1361, height: 465 };

  console.log('\n--- 1. Capturing Full Section 7 Pricing Region (1440x775) ---');
  await captureClip(
    LIVE_ID,
    'LIVE Pricing',
    4367,
    pricingClip,
    'work/analysis/compare/section7-pricing-live.png',
    'work/target_artifacts/replit/live-pricing-1440x775-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON Pricing',
    4367,
    pricingClip,
    'work/analysis/compare/section7-pricing-recon.png',
    'work/target_artifacts/replit/recon-pricing-1440x775-artifact.json'
  );

  console.log('\n--- 2. Capturing Pricing 4-Cards Grid Rectangle (1361x465) ---');
  await captureClip(
    LIVE_ID,
    'LIVE Pricing Cards',
    4367,
    cardsClip,
    'work/analysis/compare/section7-cards-live.png',
    'work/target_artifacts/replit/live-pricingcards-1361x465-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON Pricing Cards',
    4367,
    cardsClip,
    'work/analysis/compare/section7-cards-recon.png',
    'work/target_artifacts/replit/recon-pricingcards-1361x465-artifact.json'
  );

  console.log('\n--- 3. Running rea compare-web-screenshots on Full Section 7 Region ---');
  const priceDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-pricing-1440x775-artifact.json work/target_artifacts/replit/recon-pricing-1440x775-artifact.json --channel-threshold 1 --format json';
  const priceDiffOut = execSync(priceDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section7-pricing-diff.json', priceDiffOut, 'utf8');

  const priceDiffData = JSON.parse(priceDiffOut);
  console.log('\n=== REAL REA OUTPUT ON SECTION 7 PRICING REGION (1440x775) ===');
  console.log('Compared Pixels:', priceDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', priceDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', priceDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', priceDiffData.normalized_result?.mean_absolute_channel_delta);

  console.log('\n--- 4. Running rea compare-web-screenshots on Pricing 4-Cards Rectangle ---');
  const cardsDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-pricingcards-1361x465-artifact.json work/target_artifacts/replit/recon-pricingcards-1361x465-artifact.json --channel-threshold 1 --format json';
  const cardsDiffOut = execSync(cardsDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section7-cards-diff.json', cardsDiffOut, 'utf8');

  const cardsDiffData = JSON.parse(cardsDiffOut);
  console.log('\n=== REAL REA OUTPUT ON PRICING 4-CARDS RECTANGLE (1361x465) ===');
  console.log('Compared Pixels:', cardsDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', cardsDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', cardsDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', cardsDiffData.normalized_result?.mean_absolute_channel_delta);
}

run().catch(console.error);
