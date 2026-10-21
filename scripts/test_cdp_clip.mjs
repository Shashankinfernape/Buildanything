import WebSocket from 'ws';
import crypto from 'crypto';
import fs from 'fs';
import { execSync } from 'child_process';

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
          params: {
            format: 'png',
            clip: { ...clip, scale: 1 },
            captureBeyondViewport: false
          }
        }));
      }, 150);
    });
    ws.on('message', data => {
      const msg = JSON.parse(data);
      if (msg.id === 2) {
        ws.close();
        if (msg.error) return reject(msg.error);
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
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
  const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

  console.log('[AGENT-COLLECTED] Capturing Sidebar region (0, 0, 240, 765)...');
  const clip = { x: 0, y: 0, width: 240, height: 765 };

  const liveArt = await captureClip(liveTarget, clip);
  const reconArt = await captureClip(reconTarget, clip);

  fs.writeFileSync('work/captures/live_sidebar_art.json', JSON.stringify(liveArt, null, 2));
  fs.writeFileSync('work/captures/recon_sidebar_art.json', JSON.stringify(reconArt, null, 2));

  console.log('Running rea compare-web-screenshots on Sidebar...');
  const out = execSync('rea compare-web-screenshots "work/captures/live_sidebar_art.json" "work/captures/recon_sidebar_art.json" --channel-threshold 5 --format json', { encoding: 'utf8' });
  const diff = JSON.parse(out);
  console.log('Sidebar REA Diff Result:', JSON.stringify(diff.normalized_result, null, 2));
}

main().catch(console.error);
