import WebSocket from 'ws';
import crypto from 'crypto';
import fs from 'fs';
import { execSync } from 'child_process';

async function clipHeader(targetId, outFile) {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/' + targetId);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.bringToFront');
  const snap = await send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 80, scale: 1 }
  });
  ws.close();

  const buf = Buffer.from(snap.data, 'base64');
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  const artifact = {
    sha256: sha,
    bytes: buf.length,
    media_type: 'image/png',
    data_base64: snap.data
  };
  fs.writeFileSync(outFile, JSON.stringify(artifact, null, 2), 'utf8');
  console.log(outFile, 'saved! bytes:', buf.length, 'sha:', sha);
}

async function run() {
  await clipHeader('0CEBF5F820FA8AA89465BD16147DDED9', 'work/target_artifacts/replit/live-nav-1440x80-artifact.json');
  await clipHeader('A7DF9577D21FF635BD6EF295E92FAEC1', 'work/target_artifacts/replit/recon-nav-1440x80-artifact.json');
  
  const diffCmd = 'rea compare-web-screenshots work/target_artifacts/replit/live-nav-1440x80-artifact.json work/target_artifacts/replit/recon-nav-1440x80-artifact.json --channel-threshold 1 --format json';
  const diffOut = execSync(diffCmd, { encoding: 'utf8' });
  fs.writeFileSync('work/analysis/screenshot-pixel-diff-nav-1440x80.json', diffOut, 'utf8');
  console.log('\n=== REAL OUTPUT OF rea compare-web-screenshots ON 1440x80 NAV BAR ===');
  console.log(diffOut);
}

run().catch(console.error);
