import WebSocket from 'ws';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

async function setScreen(screen) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === reconTarget) || tabs.find(t => t.url.includes('5174'));
  await fetch(`http://127.0.0.1:9222/json/activate/${tab.id}`);

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: { expression: `window.__setReconScreen && window.__setReconScreen('${screen}')` }
  }));
  await new Promise(r => setTimeout(r, 1000));
  ws.close();
}

async function captureClip(clip) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === reconTarget) || tabs.find(t => t.url.includes('5174'));

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Page.captureScreenshot',
        params: {
          format: 'png',
          clip: { ...clip, scale: 1 },
          captureBeyondViewport: false
        }
      }));
    });
    ws.on('message', d => {
      const m = JSON.parse(d);
      if (m.id === 1) {
        ws.close();
        if (m.error) return reject(new Error(m.error.message));
        const buf = Buffer.from(m.result.data, 'base64');
        resolve({
          sha256: crypto.createHash('sha256').update(buf).digest('hex'),
          bytes: buf.length,
          media_type: 'image/png',
          data_base64: m.result.data
        });
      }
    });
    ws.on('error', reject);
  });
}

async function main() {
  await setScreen('security');

  // Let's compare sidebar vs main content
  // We can capture slices of recon and compare with slices of live
  console.log('Comparing Security slices...');
}

main().catch(console.error);
