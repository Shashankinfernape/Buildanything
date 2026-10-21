import WebSocket from 'ws';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

const regions = [
  { name: 'sidebar', clip: { x: 0, y: 0, width: 240, height: 765 } },
  { name: 'recent_cards', clip: { x: 464, y: 20, width: 752, height: 140 } },
  { name: 'greeting_block', clip: { x: 464, y: 400, width: 752, height: 50 } },
  { name: 'suggested_chips', clip: { x: 464, y: 460, width: 752, height: 160 } },
  { name: 'prompt_box', clip: { x: 464, y: 625, width: 752, height: 115 } },
  { name: 'bottom_glow', clip: { x: 240, y: 500, width: 1200, height: 265 } }
];

async function captureReconClip(clip) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === reconTarget) || tabs.find(t => t.url.includes('5174'));
  await fetch(`http://127.0.0.1:9222/json/activate/${tab.id}`);

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression: "window.__setReconScreen && window.__setReconScreen('home')" }
      }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Page.captureScreenshot',
          params: {
            format: 'png',
            clip: { ...clip, scale: 1 },
            captureBeyondViewport: false
          }
        }));
      }, 500);
    });
    ws.on('message', data => {
      const msg = JSON.parse(data);
      if (msg.id === 2) {
        ws.close();
        if (msg.error) return reject(new Error(msg.error.message));
        const b64 = msg.result.data;
        const buf = Buffer.from(b64, 'base64');
        const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
        resolve({
          sha256,
          bytes: buf.length,
          media_type: 'image/png',
          data_base64: b64
        });
      }
    });
    ws.on('error', reject);
  });
}

async function main() {
  console.log('=== AUDITING HOME DASHBOARD REGIONS VIA REA ===\n');

  for (const reg of regions) {
    const reconArt = await captureReconClip(reg.clip);
    const reconPath = path.resolve(`work/captures/recon_${reg.name}.json`);
    fs.writeFileSync(reconPath, JSON.stringify(reconArt, null, 2));

    const livePath = path.resolve(`work/captures/live_${reg.name}.json`);
    const out = execSync(`rea compare-web-screenshots "${livePath}" "${reconPath}" --channel-threshold 5 --format json --filter-output normalized_result`, { encoding: 'utf8' });
    const r = JSON.parse(out).normalized_result;
    const ratio = (r.changed_ratio * 100).toFixed(2);
    const pass = r.changed_ratio < 0.15 ? 'PASS' : 'FAIL';
    console.log(`${reg.name.padEnd(18)}: ${ratio.padStart(6)}% changed (${r.changed_pixels}/${r.compared_pixels}, delta: ${r.mean_absolute_channel_delta.toFixed(3)}) -> ${pass}`);
  }
}

main().catch(console.error);
