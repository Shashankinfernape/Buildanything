import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

async function cdpCommand(targetId, method, params = {}) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method, params }));
    });
    ws.on('message', data => {
      try {
        const msg = JSON.parse(data);
        if (msg.id === 1) {
          ws.close();
          resolve(msg);
        }
      } catch (e) {}
    });
    ws.on('error', reject);
  });
}

async function run() {
  console.log('Navigating recon tab to workspace...');
  await cdpCommand(reconTarget, 'Runtime.evaluate', {
    expression: `(() => {
      if (window.__setReconScreen) {
        window.__setReconScreen('workspace');
      }
    })()`
  });

  await new Promise(r => setTimeout(r, 2000));

  console.log('Capturing recon screenshot for workspace...');
  const snapRes = await cdpCommand(reconTarget, 'Page.captureScreenshot', { format: 'png' });
  const b64 = snapRes.result?.data;
  const buf = Buffer.from(b64, 'base64');
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');

  const reconArt = {
    sha256,
    bytes: buf.length,
    media_type: 'image/png',
    data_base64: b64
  };

  const reconJsonPath = path.resolve('work/captures/recon_workspace_art.json');
  fs.writeFileSync(reconJsonPath, JSON.stringify(reconArt, null, 2));
  fs.writeFileSync('work/analysis/screens/recon_workspace.png', buf);
  fs.writeFileSync('analysis/screens/recon_workspace.png', buf);

  console.log('Running REA compare-web-screenshots against live_workspace_art.json...');
  const liveArtPath = path.resolve('work/captures/live_workspace_art.json');
  
  const out5 = execSync(`rea compare-web-screenshots "${liveArtPath}" "${reconJsonPath}" --channel-threshold 5 --format json`, { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });
  const diff5 = JSON.parse(out5).normalized_result;

  const out1 = execSync(`rea compare-web-screenshots "${liveArtPath}" "${reconJsonPath}" --channel-threshold 1 --format json`, { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });
  const diff1 = JSON.parse(out1).normalized_result;

  console.log('\n=== REA WORKSPACE COMPARISON RESULT ===');
  console.log(`Compared pixels: ${diff5.compared_pixels}`);
  console.log(`Threshold 5: ${(diff5.changed_ratio * 100).toFixed(2)}% changed (${diff5.changed_pixels} / ${diff5.compared_pixels})`);
  console.log(`Threshold 1: ${(diff1.changed_ratio * 100).toFixed(2)}% changed (${diff1.changed_pixels} / ${diff1.compared_pixels})`);
  console.log(`Mean channel delta: ${diff5.mean_absolute_channel_delta.toFixed(3)}`);
}

run().catch(console.error);
