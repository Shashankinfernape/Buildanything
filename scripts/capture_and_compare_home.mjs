import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

async function main() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const reconTab = tabs.find(t => t.url.includes('5174'));
  if (!reconTab) throw new Error('Recon tab not found on 5174');

  await fetch(`http://127.0.0.1:9222/json/activate/${reconTab.id}`);

  const ws = new WebSocket(reconTab.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));

  let id = 1;
  const send = (m, p={}) => new Promise((res, rej) => {
    const cur = id++;
    const timer = setTimeout(() => rej(new Error('timeout')), 10000);
    const handler = d => {
      const msg = JSON.parse(d);
      if (msg.id === cur) {
        clearTimeout(timer);
        ws.off('message', handler);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });

  // Ensure 1440x765 desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 765,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Navigate to home
  await send('Runtime.evaluate', {
    expression: `window.__setReconScreen && window.__setReconScreen('home')`
  });
  await new Promise(r => setTimeout(r, 1500));

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  const b64 = snap.data;
  const buf = Buffer.from(b64, 'base64');
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');

  const art = {
    sha256,
    bytes: buf.length,
    media_type: 'image/png',
    data_base64: b64
  };

  const reconPath = path.resolve('work/captures/recon_dashboard_artifact.json');
  fs.writeFileSync(reconPath, JSON.stringify(art, null, 2));
  fs.writeFileSync('analysis/screens/recon_dashboard_current.png', buf);
  console.log('Saved recon dashboard screenshot.');

  ws.close();

  // Run rea compare
  const livePath = path.resolve('work/captures/live_dashboard_artifact.json');
  const out5 = execSync(`rea compare-web-screenshots "${livePath}" "${reconPath}" --channel-threshold 5 --format json --filter-output normalized_result`, { encoding: 'utf8' });
  const diff5 = JSON.parse(out5).normalized_result;

  const out1 = execSync(`rea compare-web-screenshots "${livePath}" "${reconPath}" --channel-threshold 1 --format json --filter-output normalized_result`, { encoding: 'utf8' });
  const diff1 = JSON.parse(out1).normalized_result;

  console.log(`CURRENT HOME DASHBOARD REA COMPARISON:`);
  console.log(`  threshold 5: ${(diff5.changed_ratio * 100).toFixed(2)}% changed (${diff5.changed_pixels} / ${diff5.compared_pixels})`);
  console.log(`  threshold 1: ${(diff1.changed_ratio * 100).toFixed(2)}% changed (${diff1.changed_pixels} / ${diff1.compared_pixels})`);
  console.log(`  mean delta : ${diff5.mean_absolute_channel_delta.toFixed(3)}`);
  console.log(`  PASS (<15%): ${diff5.changed_ratio < 0.15}`);
}

main().catch(console.error);
