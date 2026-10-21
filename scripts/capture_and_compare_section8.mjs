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
  const logoClip = { x: 0, y: 5142, width: 1440, height: 216 };
  const innerClip = { x: 0, y: 5182, width: 1440, height: 176 };

  console.log('\n--- 1. Capturing Full Section 8 Logo Block Region (1440x216) ---');
  await captureClip(
    LIVE_ID,
    'LIVE LogoBlock',
    5142,
    logoClip,
    'work/analysis/compare/section8-logoblock-live.png',
    'work/target_artifacts/replit/live-logoblock-1440x216-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON LogoBlock',
    5142,
    logoClip,
    'work/analysis/compare/section8-logoblock-recon.png',
    'work/target_artifacts/replit/recon-logoblock-1440x216-artifact.json'
  );

  console.log('\n--- 2. Capturing Inner Logo Track Rectangle (1440x176) ---');
  await captureClip(
    LIVE_ID,
    'LIVE LogoTrack',
    5142,
    innerClip,
    'work/analysis/compare/section8-logotrack-live.png',
    'work/target_artifacts/replit/live-logotrack-1440x176-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON LogoTrack',
    5142,
    innerClip,
    'work/analysis/compare/section8-logotrack-recon.png',
    'work/target_artifacts/replit/recon-logotrack-1440x176-artifact.json'
  );

  console.log('\n--- 3. Running rea compare-web-screenshots on Full Section 8 Region ---');
  const logoDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-logoblock-1440x216-artifact.json work/target_artifacts/replit/recon-logoblock-1440x216-artifact.json --channel-threshold 1 --format json';
  const logoDiffOut = execSync(logoDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section8-logoblock-diff.json', logoDiffOut, 'utf8');

  const logoDiffData = JSON.parse(logoDiffOut);
  console.log('\n=== REAL REA OUTPUT ON SECTION 8 LOGO BLOCK (1440x216) ===');
  console.log('Compared Pixels:', logoDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', logoDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', logoDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', logoDiffData.normalized_result?.mean_absolute_channel_delta);

  console.log('\n--- 4. Running rea compare-web-screenshots on Inner Logo Track (1440x176) ---');
  const trackDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-logotrack-1440x176-artifact.json work/target_artifacts/replit/recon-logotrack-1440x176-artifact.json --channel-threshold 1 --format json';
  const trackDiffOut = execSync(trackDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section8-logotrack-diff.json', trackDiffOut, 'utf8');

  const trackDiffData = JSON.parse(trackDiffOut);
  console.log('\n=== REAL REA OUTPUT ON INNER LOGO TRACK (1440x176) ===');
  console.log('Compared Pixels:', trackDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', trackDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', trackDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', trackDiffData.normalized_result?.mean_absolute_channel_delta);
}

run().catch(console.error);
