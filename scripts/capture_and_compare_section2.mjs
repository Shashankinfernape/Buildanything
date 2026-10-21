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

async function captureHero(targetId, label, outPng, outArtifact) {
  const cdp = await createCdpSender(targetId);
  await cdp.send('Page.bringToFront');
  await new Promise(r => setTimeout(r, 400));

  // Hero section clip: x: 0, y: 80, width: 1440, height: 745 (full viewport below nav)
  const snap = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 80, width: 1440, height: 745, scale: 1 }
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
  console.log(`[AGENT-COLLECTED] ${label} Hero (1440x745) captured! bytes: ${buf.length}, sha: ${sha}`);
  return artifact;
}

async function run() {
  console.log('Capturing Live Hero region...');
  await captureHero(
    LIVE_ID,
    'LIVE',
    'work/analysis/compare/section2-hero-live.png',
    'work/target_artifacts/replit/live-hero-1440x745-artifact.json'
  );

  console.log('Capturing Recon Hero region...');
  await captureHero(
    RECON_ID,
    'RECON',
    'work/analysis/compare/section2-hero-recon.png',
    'work/target_artifacts/replit/recon-hero-1440x745-artifact.json'
  );

  console.log('Running rea compare-web-screenshots on Hero region (1440x745)...');
  const diffCmd = 'rea compare-web-screenshots work/target_artifacts/replit/live-hero-1440x745-artifact.json work/target_artifacts/replit/recon-hero-1440x745-artifact.json --channel-threshold 1 --format json';
  const diffOut = execSync(diffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section2-hero-diff.json', diffOut, 'utf8');

  const diffData = JSON.parse(diffOut);
  console.log('\n=== REAL REA OUTPUT ON SECTION 2 HERO REGION (1440x745) ===');
  console.log('Compared Pixels:', diffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', diffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', diffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', diffData.normalized_result?.mean_absolute_channel_delta);
}

run().catch(console.error);
