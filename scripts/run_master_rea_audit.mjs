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

async function captureScreen(screenKey) {
  await cdpCommand(reconTarget, 'Runtime.evaluate', {
    expression: `window.__setReconScreen && window.__setReconScreen('${screenKey}')`
  });
  await new Promise(r => setTimeout(r, 1500));

  const snapRes = await cdpCommand(reconTarget, 'Page.captureScreenshot', { format: 'png' });
  const b64 = snapRes.result?.data;
  const buf = Buffer.from(b64, 'base64');
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');

  const art = {
    sha256,
    bytes: buf.length,
    media_type: 'image/png',
    data_base64: b64
  };

  const reconJsonPath = path.resolve(`work/captures/recon_${screenKey}_art.json`);
  fs.writeFileSync(reconJsonPath, JSON.stringify(art, null, 2));
  fs.writeFileSync(`analysis/screens/recon_${screenKey}.png`, buf);
  fs.writeFileSync(`work/analysis/screens/recon_${screenKey}.png`, buf);

  return reconJsonPath;
}

function runReaCompare(liveArtPath, reconArtPath) {
  const out5 = execSync(`rea compare-web-screenshots "${liveArtPath}" "${reconArtPath}" --channel-threshold 5 --format json`, { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });
  const diff5 = JSON.parse(out5).normalized_result;

  const out1 = execSync(`rea compare-web-screenshots "${liveArtPath}" "${reconArtPath}" --channel-threshold 1 --format json`, { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });
  const diff1 = JSON.parse(out1).normalized_result;

  return {
    compared_pixels: diff5.compared_pixels,
    changed_pixels_t5: diff5.changed_pixels,
    changed_ratio_t5: (diff5.changed_ratio * 100).toFixed(2) + '%',
    changed_pixels_t1: diff1.changed_pixels,
    changed_ratio_t1: (diff1.changed_ratio * 100).toFixed(2) + '%',
    mean_delta: diff5.mean_absolute_channel_delta.toFixed(3),
    pass: diff5.changed_ratio < 0.15
  };
}

async function main() {
  const auditScreens = [
    { name: 'Import', screenKey: 'import', liveArt: path.resolve('work/captures/live_import_art.json') },
    { name: 'Library', screenKey: 'projects', liveArt: path.resolve('work/captures/live_library_art.json') },
    { name: 'Routines', screenKey: 'routines', liveArt: path.resolve('work/captures/live_routines_art.json') },
    { name: 'Security', screenKey: 'security', liveArt: path.resolve('work/captures/live_security_art.json') },
    { name: 'Workspace Settings', screenKey: 'settings', liveArt: path.resolve('work/captures/live_workspace_settings_art.json') },
    { name: 'Workspace Editor', screenKey: 'workspace', liveArt: path.resolve('work/captures/live_workspace_art.json') }
  ];

  console.log('=== RUNNING MASTER REA AUDIT ACROSS ALL 6 SIGNED-IN SCREENS ===\n');
  const results = [];

  for (const s of auditScreens) {
    console.log(`Auditing: ${s.name} (${s.screenKey})...`);
    const reconArt = await captureScreen(s.screenKey);
    const res = runReaCompare(s.liveArt, reconArt);
    results.push({ name: s.name, ...res });
    console.log(`  -> t=5: ${res.changed_ratio_t5} changed | t=1: ${res.changed_ratio_t1} | delta: ${res.mean_delta} | PASS: ${res.pass}`);
  }

  // Restore recon to home
  await cdpCommand(reconTarget, 'Runtime.evaluate', {
    expression: `window.__setReconScreen && window.__setReconScreen('home')`
  });

  console.log('\n================ MASTER REA AUDIT SUMMARY ================');
  console.table(results);

  fs.writeFileSync('work/analysis/master_audit_results.json', JSON.stringify(results, null, 2));
}

main().catch(console.error);
