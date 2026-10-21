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
  const testimonialsClip = { x: 0, y: 3717, width: 1440, height: 650 };
  const compositeClip = { x: 32, y: 3801, width: 1361, height: 518 };

  console.log('\n--- 1. Capturing Full Section 6 Testimonials Region (1440x650) ---');
  await captureClip(
    LIVE_ID,
    'LIVE Testimonials',
    3717,
    testimonialsClip,
    'work/analysis/compare/section6-testimonials-live.png',
    'work/target_artifacts/replit/live-testimonials-1440x650-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON Testimonials',
    3717,
    testimonialsClip,
    'work/analysis/compare/section6-testimonials-recon.png',
    'work/target_artifacts/replit/recon-testimonials-1440x650-artifact.json'
  );

  console.log('\n--- 2. Capturing Section 6 Composite Grid Rectangle (1361x518) ---');
  await captureClip(
    LIVE_ID,
    'LIVE Composite',
    3717,
    compositeClip,
    'work/analysis/compare/section6-composite-live.png',
    'work/target_artifacts/replit/live-testimonials-composite-1361x518-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON Composite',
    3717,
    compositeClip,
    'work/analysis/compare/section6-composite-recon.png',
    'work/target_artifacts/replit/recon-testimonials-composite-1361x518-artifact.json'
  );

  console.log('\n--- 3. Running rea compare-web-screenshots on Full Section 6 Region ---');
  const testDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-testimonials-1440x650-artifact.json work/target_artifacts/replit/recon-testimonials-1440x650-artifact.json --channel-threshold 1 --format json';
  const testDiffOut = execSync(testDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section6-testimonials-diff.json', testDiffOut, 'utf8');

  const testDiffData = JSON.parse(testDiffOut);
  console.log('\n=== REAL REA OUTPUT ON SECTION 6 TESTIMONIALS REGION (1440x650) ===');
  console.log('Compared Pixels:', testDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', testDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', testDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', testDiffData.normalized_result?.mean_absolute_channel_delta);

  console.log('\n--- 4. Running rea compare-web-screenshots on Composite Grid Rectangle ---');
  const compDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-testimonials-composite-1361x518-artifact.json work/target_artifacts/replit/recon-testimonials-composite-1361x518-artifact.json --channel-threshold 1 --format json';
  const compDiffOut = execSync(compDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section6-composite-diff.json', compDiffOut, 'utf8');

  const compDiffData = JSON.parse(compDiffOut);
  console.log('\n=== REAL REA OUTPUT ON SECTION 6 COMPOSITE GRID (1361x518) ===');
  console.log('Compared Pixels:', compDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', compDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', compDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', compDiffData.normalized_result?.mean_absolute_channel_delta);
}

run().catch(console.error);
