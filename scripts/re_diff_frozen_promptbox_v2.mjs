import WebSocket from 'ws';
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';

const LIVE_ID = '1F77289A2297F8B8A35F03904F821099';
const RECON_ID = 'D443E8091E8733163C20C86AEEDB5714';

function createCdpSender(targetId) {
  return new Promise(async (resolve, reject) => {
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
  });
}

async function run() {
  const live = await createCdpSender(LIVE_ID);
  const recon = await createCdpSender(RECON_ID);

  await recon.send('Page.reload');
  await new Promise(r => setTimeout(r, 1200));

  await live.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await recon.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await new Promise(r => setTimeout(r, 400));

  const freezeExpr = `(() => {
    const fixed = "Build a website for…";
    const ta = document.querySelector('textarea[data-ruic="MultiLineInput"]');
    if (ta) {
      ta.value = "";
      ta.setAttribute('data-frozen', 'true');
      Object.defineProperty(ta, 'placeholder', {
        value: fixed,
        writable: false,
        configurable: true
      });
      ta.setAttribute('placeholder', fixed);
    }
    const root = document.querySelector('[data-agent-input2-root]');
    const r = root ? root.getBoundingClientRect() : null;
    return r ? { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) } : null;
  })()`;

  const liveRect = await live.send('Runtime.evaluate', { expression: freezeExpr, returnByValue: true });
  const reconRect = await recon.send('Runtime.evaluate', { expression: freezeExpr, returnByValue: true });

  console.log('Live Prompt Box Rect:', liveRect.result?.value);
  console.log('Recon Prompt Box Rect:', reconRect.result?.value);

  const rect = liveRect.result?.value;
  const clip = {
    x: rect.x - 5,
    y: rect.y - 5,
    width: rect.w + 10,
    height: rect.h + 10,
    scale: 1
  };

  const liveSnap = await live.send('Page.captureScreenshot', { format: 'png', clip });
  const reconSnap = await recon.send('Page.captureScreenshot', { format: 'png', clip });

  live.ws.close();
  recon.ws.close();

  const liveBuf = Buffer.from(liveSnap.data, 'base64');
  const reconBuf = Buffer.from(reconSnap.data, 'base64');

  fs.writeFileSync('work/analysis/compare/promptbox-frozen-live.png', liveBuf);
  fs.writeFileSync('work/analysis/compare/promptbox-frozen-recon.png', reconBuf);

  const liveArtifact = {
    sha256: crypto.createHash('sha256').update(liveBuf).digest('hex'),
    bytes: liveBuf.length,
    media_type: 'image/png',
    data_base64: liveSnap.data
  };
  const reconArtifact = {
    sha256: crypto.createHash('sha256').update(reconBuf).digest('hex'),
    bytes: reconBuf.length,
    media_type: 'image/png',
    data_base64: reconSnap.data
  };

  fs.writeFileSync('work/target_artifacts/replit/live-promptbox-frozen-artifact.json', JSON.stringify(liveArtifact, null, 2));
  fs.writeFileSync('work/target_artifacts/replit/recon-promptbox-frozen-artifact.json', JSON.stringify(reconArtifact, null, 2));

  console.log('\n--- Running rea compare-web-screenshots on Frozen Prompt Box ---');
  const diffCmd = 'npx rea compare-web-screenshots work/target_artifacts/replit/live-promptbox-frozen-artifact.json work/target_artifacts/replit/recon-promptbox-frozen-artifact.json --channel-threshold 1 --format json';
  const diffOut = execSync(diffCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('work/analysis/compare/promptbox-frozen-diff.json', diffOut, 'utf8');

  const diffData = JSON.parse(diffOut);
  console.log('Compared Pixels:', diffData.normalized_result?.compared_pixels);
  console.log('Changed Pixels:', diffData.normalized_result?.changed_pixels);
  console.log('Changed Ratio:', diffData.normalized_result?.changed_ratio);
  console.log('Mean Absolute Channel Delta:', diffData.normalized_result?.mean_absolute_channel_delta);
}

run().catch(console.error);
