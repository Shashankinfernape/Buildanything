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

async function main() {
  console.log('Ensuring live target is at workspace repl...');
  await cdpCommand(liveTarget, 'Page.navigate', { url: 'https://replit.com/@infernapeshasha/DeficientPlumpMisrac' });

  console.log('Ensuring recon target is at workspace...');
  await cdpCommand(reconTarget, 'Runtime.evaluate', {
    expression: `window.__setReconScreen && window.__setReconScreen('workspace')`
  });

  await new Promise(r => setTimeout(r, 6000));

  const zones = [
    { name: 'ws_sidebar', clip: { x: 0, y: 0, width: 240, height: 765, scale: 1 } },
    { name: 'ws_agent_chat', clip: { x: 240, y: 0, width: 451, height: 765, scale: 1 } },
    { name: 'ws_tools_center', clip: { x: 691, y: 0, width: 411, height: 765, scale: 1 } },
    { name: 'ws_console_right', clip: { x: 1102, y: 0, width: 338, height: 765, scale: 1 } }
  ];

  console.log('\n=== REGIONAL REA WORKSPACE DIAGNOSIS ===');

  for (const z of zones) {
    const liveSnap = await cdpCommand(liveTarget, 'Page.captureScreenshot', { format: 'png', clip: z.clip });
    const liveArt = makeArt(liveSnap.result.data, `work/captures/live_${z.name}_art.json`);

    const reconSnap = await cdpCommand(reconTarget, 'Page.captureScreenshot', { format: 'png', clip: z.clip });
    const reconArt = makeArt(reconSnap.result.data, `work/captures/recon_${z.name}_art.json`);

    const out5 = execSync(`rea compare-web-screenshots "${liveArt}" "${reconArt}" --channel-threshold 5 --format json`, { maxBuffer: 50 * 1024 * 1024, encoding: 'utf8' });
    const diff5 = JSON.parse(out5).normalized_result;

    console.log(`Zone [${z.name}]:`);
    console.log(`  -> ${(diff5.changed_ratio * 100).toFixed(2)}% changed (${diff5.changed_pixels} / ${diff5.compared_pixels}) | delta: ${diff5.mean_absolute_channel_delta.toFixed(3)}`);
  }
}

main().catch(console.error);
