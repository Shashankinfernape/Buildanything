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
  const ctaClip = { x: 0, y: 5358, width: 1440, height: 434 };
  const footerClip = { x: 0, y: 5792, width: 1440, height: 610 };

  console.log('\n--- 1. Capturing Section 9A Footer CTA (1440x434) ---');
  await captureClip(
    LIVE_ID,
    'LIVE FooterCTA',
    5358,
    ctaClip,
    'work/analysis/compare/section9-cta-live.png',
    'work/target_artifacts/replit/live-footercta-1440x434-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON FooterCTA',
    5358,
    ctaClip,
    'work/analysis/compare/section9-cta-recon.png',
    'work/target_artifacts/replit/recon-footercta-1440x434-artifact.json'
  );

  console.log('\n--- 2. Capturing Section 9B Marketing Footer (1440x610) ---');
  await captureClip(
    LIVE_ID,
    'LIVE MarketingFooter',
    5792,
    footerClip,
    'work/analysis/compare/section9-footer-live.png',
    'work/target_artifacts/replit/live-marketingfooter-1440x610-artifact.json'
  );
  await captureClip(
    RECON_ID,
    'RECON MarketingFooter',
    5792,
    footerClip,
    'work/analysis/compare/section9-footer-recon.png',
    'work/target_artifacts/replit/recon-marketingfooter-1440x610-artifact.json'
  );

  console.log('\n--- 3. Running rea compare-web-screenshots on Footer CTA (1440x434) ---');
  const ctaDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-footercta-1440x434-artifact.json work/target_artifacts/replit/recon-footercta-1440x434-artifact.json --channel-threshold 1 --format json';
  const ctaDiffOut = execSync(ctaDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section9-cta-diff.json', ctaDiffOut, 'utf8');

  const ctaDiffData = JSON.parse(ctaDiffOut);
  console.log('\n=== REAL REA OUTPUT ON FOOTER CTA (1440x434) ===');
  console.log('Compared Pixels:', ctaDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', ctaDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', ctaDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', ctaDiffData.normalized_result?.mean_absolute_channel_delta);

  console.log('\n--- 4. Running rea compare-web-screenshots on Marketing Footer (1440x610) ---');
  const footerDiffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-marketingfooter-1440x610-artifact.json work/target_artifacts/replit/recon-marketingfooter-1440x610-artifact.json --channel-threshold 1 --format json';
  const footerDiffOut = execSync(footerDiffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/section9-footer-diff.json', footerDiffOut, 'utf8');

  const footerDiffData = JSON.parse(footerDiffOut);
  console.log('\n=== REAL REA OUTPUT ON MARKETING FOOTER (1440x610) ===');
  console.log('Compared Pixels:', footerDiffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', footerDiffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', footerDiffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', footerDiffData.normalized_result?.mean_absolute_channel_delta);
}

run().catch(console.error);
