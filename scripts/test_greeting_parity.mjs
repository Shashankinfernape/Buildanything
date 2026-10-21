import WebSocket from 'ws';
import crypto from 'crypto';
import fs from 'fs';
import { execSync } from 'child_process';

const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';
const clip = { x: 464, y: 400, width: 752, height: 50 };

async function cdp(targetId, method, params = {}) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method, params }));
    });
    ws.on('message', data => {
      ws.close();
      resolve(JSON.parse(data));
    });
    ws.on('error', reject);
  });
}

async function captureClip(targetId, clip) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.bringToFront' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Page.captureScreenshot',
          params: { format: 'png', clip: { ...clip, scale: 1 }, captureBeyondViewport: false }
        }));
      }, 150);
    });
    ws.on('message', data => {
      const msg = JSON.parse(data);
      if (msg.id === 2) {
        ws.close();
        const b64 = msg.result.data;
        const buf = Buffer.from(b64, 'base64');
        resolve({ sha256: crypto.createHash('sha256').update(buf).digest('hex'), bytes: buf.length, media_type: 'image/png', data_base64: b64 });
      }
    });
    ws.on('error', reject);
  });
}

async function run() {
  // 1. Get live greeting HTML
  const liveRes = await cdp(liveTarget, 'Runtime.evaluate', { expression: 'document.querySelector("main h1 + p").innerHTML', returnByValue: true });
  const liveHtml = liveRes.result.result.value;

  // 2. Temporarily set in recon
  await cdp(reconTarget, 'Runtime.evaluate', { expression: `document.querySelector("main h1 + p").innerHTML = ${JSON.stringify(liveHtml)}` });

  // 3. Capture
  const liveArt = await captureClip(liveTarget, clip);
  const reconArt = await captureClip(reconTarget, clip);

  fs.writeFileSync('work/captures/live_test_greeting.json', JSON.stringify(liveArt, null, 2));
  fs.writeFileSync('work/captures/recon_test_greeting.json', JSON.stringify(reconArt, null, 2));

  const out5 = execSync('rea compare-web-screenshots "work/captures/live_test_greeting.json" "work/captures/recon_test_greeting.json" --channel-threshold 5 --format json', { encoding: 'utf8' });
  const res = JSON.parse(out5).normalized_result;
  console.log('--- REA Diff on Greeting with identical text at threshold 5 ---');
  console.log(`Changed pixels: ${res.changed_pixels} / ${res.compared_pixels} (${(res.changed_ratio * 100).toFixed(2)}%)`);
  console.log(`Mean channel delta: ${res.mean_absolute_channel_delta}`);

  // 4. Restore neutral Alex text immediately by reloading
  await cdp(reconTarget, 'Runtime.evaluate', { expression: 'location.reload()' });
}

run().catch(console.error);
