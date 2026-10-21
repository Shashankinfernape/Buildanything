import WebSocket from 'ws';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

async function main() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === reconTarget) || tabs.find(t => t.url.includes('5174'));
  await fetch(`http://127.0.0.1:9222/json/activate/${tab.id}`);

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));

  // Navigate to routines
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: { expression: "window.__setReconScreen && window.__setReconScreen('routines')" }
  }));
  await new Promise(r => setTimeout(r, 1500));

  const snap = await new Promise((res, rej) => {
    ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'png' } }));
    ws.on('message', d => {
      const m = JSON.parse(d);
      if (m.id === 2) {
        if (m.error) rej(new Error(m.error.message));
        else res(m.result.data);
      }
    });
  });

  const buf = Buffer.from(snap, 'base64');
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  const art = {
    sha256,
    bytes: buf.length,
    media_type: 'image/png',
    data_base64: snap
  };

  const reconPath = path.resolve('work/captures/recon_routines_art.json');
  fs.writeFileSync(reconPath, JSON.stringify(art, null, 2));
  fs.writeFileSync('analysis/screens/recon_routines.png', buf);
  ws.close();

  const livePath = path.resolve('work/captures/live_routines_art.json');
  const out = execSync(`rea compare-web-screenshots "${livePath}" "${reconPath}" --channel-threshold 5 --format json --filter-output normalized_result`, { encoding: 'utf8' });
  const r = JSON.parse(out).normalized_result;

  console.log('NEW ROUTINES REA COMPARISON:');
  console.log(`  Threshold 5: ${(r.changed_ratio * 100).toFixed(2)}% changed (${r.changed_pixels} / ${r.compared_pixels})`);
  console.log(`  Mean delta : ${r.mean_absolute_channel_delta.toFixed(3)}`);
  console.log(`  PASS (<15%): ${r.changed_ratio < 0.15}`);
}

main().catch(console.error);
