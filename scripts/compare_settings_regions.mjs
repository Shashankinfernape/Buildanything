import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
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

function makeArt(b64, outPath) {
  const buf = Buffer.from(b64, 'base64');
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  const art = {
    sha256,
    bytes: buf.length,
    media_type: 'image/png',
    data_base64: b64
  };
  fs.writeFileSync(outPath, JSON.stringify(art, null, 2));
  return outPath;
}

async function run() {
  const regions = [
    { name: 'settings_sidebar', clip: { x: 0, y: 0, width: 240, height: 765, scale: 1 } },
    { name: 'settings_main', clip: { x: 240, y: 0, width: 1200, height: 765, scale: 1 } }
  ];

  // Navigate live to settings
  console.log('Navigating live target to /settings/workspaceOverview...');
  await cdpCommand(liveTarget, 'Page.navigate', { url: 'https://replit.com/settings/workspaceOverview' });
  
  // Set recon to settings
  console.log('Setting recon screen to settings...');
  await cdpCommand(reconTarget, 'Runtime.evaluate', {
    expression: `window.__setReconScreen && window.__setReconScreen('settings')`
  });

  await new Promise(r => setTimeout(r, 4000));

  for (const reg of regions) {
    console.log(`\n--- Comparing region: ${reg.name} ---`);
    const liveSnap = await cdpCommand(liveTarget, 'Page.captureScreenshot', { format: 'png', clip: reg.clip });
    const liveArt = makeArt(liveSnap.result.data, `work/captures/live_${reg.name}_art.json`);
    fs.writeFileSync(`analysis/screens/live_${reg.name}.png`, Buffer.from(liveSnap.result.data, 'base64'));

    const reconSnap = await cdpCommand(reconTarget, 'Page.captureScreenshot', { format: 'png', clip: reg.clip });
    const reconArt = makeArt(reconSnap.result.data, `work/captures/recon_${reg.name}_art.json`);
    fs.writeFileSync(`analysis/screens/recon_${reg.name}.png`, Buffer.from(reconSnap.result.data, 'base64'));

    const out5 = execSync(`rea compare-web-screenshots "${liveArt}" "${reconArt}" --channel-threshold 5 --format json`, { encoding: 'utf8' });
    const diff5 = JSON.parse(out5).normalized_result;

    const out1 = execSync(`rea compare-web-screenshots "${liveArt}" "${reconArt}" --channel-threshold 1 --format json`, { encoding: 'utf8' });
    const diff1 = JSON.parse(out1).normalized_result;

    console.log(`Region ${reg.name}:`);
    console.log(`  -> Threshold 5: ${(diff5.changed_ratio * 100).toFixed(2)}% changed (${diff5.changed_pixels} / ${diff5.compared_pixels})`);
    console.log(`  -> Threshold 1: ${(diff1.changed_ratio * 100).toFixed(2)}% changed (${diff1.changed_pixels} / ${diff1.compared_pixels})`);
    console.log(`  -> Mean channel delta: ${diff5.mean_absolute_channel_delta.toFixed(3)}`);
  }

  // Also do full page compare
  console.log('\n--- Comparing Full Settings Viewport (1440x765) ---');
  const liveFull = await cdpCommand(liveTarget, 'Page.captureScreenshot', { format: 'png' });
  const liveFullArt = makeArt(liveFull.result.data, 'work/captures/live_settings_full_art.json');
  fs.writeFileSync('analysis/screens/live_workspace_settings.png', Buffer.from(liveFull.result.data, 'base64'));

  const reconFull = await cdpCommand(reconTarget, 'Page.captureScreenshot', { format: 'png' });
  const reconFullArt = makeArt(reconFull.result.data, 'work/captures/recon_settings_full_art.json');
  fs.writeFileSync('analysis/screens/recon_workspace_settings.png', Buffer.from(reconFull.result.data, 'base64'));

  const fullOut5 = execSync(`rea compare-web-screenshots "${liveFullArt}" "${reconFullArt}" --channel-threshold 5 --format json`, { encoding: 'utf8' });
  const fullDiff5 = JSON.parse(fullOut5).normalized_result;
  console.log(`Full Settings Viewport (t=5): ${(fullDiff5.changed_ratio * 100).toFixed(2)}% changed (${fullDiff5.changed_pixels} / ${fullDiff5.compared_pixels})`);

  // Navigate live back to ~
  console.log('Navigating live target back to ~...');
  await cdpCommand(liveTarget, 'Page.navigate', { url: 'https://replit.com/~' });
}

run().catch(console.error);
