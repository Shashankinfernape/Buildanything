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
      ws.close();
      resolve(JSON.parse(data));
    });
    ws.on('error', reject);
  });
}

function ensureArtifactJson(jsonPath, artPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const art = data.normalized_result?.artifact || data;
  fs.writeFileSync(artPath, JSON.stringify(art, null, 2));
  return artPath;
}

async function captureReconScreen(screenName, buttonText) {
  console.log(`Setting recon screen to: ${buttonText}...`);
  await cdpCommand(reconTarget, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('nav button, nav a')).find(b => b.innerText.trim().toLowerCase() === '${buttonText.toLowerCase()}');
      if (btn) {
        btn.click();
      }
    })()`
  });

  await new Promise(r => setTimeout(r, 1500));

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

  const reconJsonPath = path.resolve(`work/captures/recon_${screenName}_art.json`);
  fs.writeFileSync(reconJsonPath, JSON.stringify(reconArt, null, 2));
  fs.writeFileSync(`work/analysis/screens/recon_${screenName}.png`, buf);
  fs.writeFileSync(`analysis/screens/recon_${screenName}.png`, buf);

  return reconJsonPath;
}

async function compareWithLive(screenName, liveArtPath, reconArtPath) {
  console.log(`\n=== RUNNING REA SCREEN COMPARISON FOR: ${screenName} ===`);
  const out5 = execSync(`rea compare-web-screenshots "${liveArtPath}" "${reconArtPath}" --channel-threshold 5 --format json`, { encoding: 'utf8' });
  const diff5 = JSON.parse(out5).normalized_result;

  const out1 = execSync(`rea compare-web-screenshots "${liveArtPath}" "${reconArtPath}" --channel-threshold 1 --format json`, { encoding: 'utf8' });
  const diff1 = JSON.parse(out1).normalized_result;

  const res = {
    screen: screenName,
    compared_pixels: diff5.compared_pixels,
    changed_pixels_t5: diff5.changed_pixels,
    changed_ratio_t5: (diff5.changed_ratio * 100).toFixed(2) + '%',
    changed_pixels_t1: diff1.changed_pixels,
    changed_ratio_t1: (diff1.changed_ratio * 100).toFixed(2) + '%',
    mean_channel_delta: diff5.mean_absolute_channel_delta.toFixed(3)
  };

  console.log(`  -> Threshold 5: ${res.changed_ratio_t5} changed (${res.changed_pixels_t5}/${res.compared_pixels})`);
  console.log(`  -> Threshold 1: ${res.changed_ratio_t1} changed (${res.changed_pixels_t1}/${res.compared_pixels})`);
  console.log(`  -> Mean Channel Delta: ${res.mean_channel_delta}`);

  return res;
}

async function main() {
  const screens = [
    { name: 'import', buttonText: 'Import', liveRaw: 'work/captures/live_import_screenshot.json', liveArt: 'work/captures/live_import_art.json' },
    { name: 'library', buttonText: 'Library', liveRaw: 'work/captures/live_library_screenshot.json', liveArt: 'work/captures/live_library_art.json' },
    { name: 'routines', buttonText: 'Routines', liveRaw: 'work/captures/live_routines_screenshot.json', liveArt: 'work/captures/live_routines_art.json' },
    { name: 'security', buttonText: 'Security', liveRaw: 'work/captures/live_security_screenshot.json', liveArt: 'work/captures/live_security_art.json' }
  ];

  // Reload recon tab to clean state
  await cdpCommand(reconTarget, 'Page.reload');
  await new Promise(r => setTimeout(r, 2000));

  const allResults = [];
  for (const s of screens) {
    const liveArtPath = path.resolve(ensureArtifactJson(path.resolve(s.liveRaw), path.resolve(s.liveArt)));
    const reconArtPath = await captureReconScreen(s.name, s.buttonText);
    const result = await compareWithLive(s.name, liveArtPath, reconArtPath);
    allResults.push(result);
  }

  console.log('\n=== MASTER REA MULTI-SCREEN COMPARISON AUDIT ===');
  console.table(allResults);

  fs.writeFileSync('work/analysis/compare/all_screens_rea_diffs.json', JSON.stringify(allResults, null, 2));
}

main().catch(console.error);
