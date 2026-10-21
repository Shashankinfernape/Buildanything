import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';

const pagesToCapture = [
  { name: 'import', url: 'https://replit.com/import' },
  { name: 'routines', url: 'https://replit.com/routines' },
  { name: 'security', url: 'https://replit.com/~/security' },
  { name: 'workspace_settings', url: 'https://replit.com/settings/workspaceOverview' }
];

async function cdpCommand(method, params = {}) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === liveTarget);
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

async function captureOnePage(page) {
  console.log(`\n======================================================`);
  console.log(`[AGENT-COLLECTED] Starting REA capture for: ${page.name} (${page.url})`);
  console.log(`======================================================`);

  // 1. Navigate and wait for settling
  await cdpCommand('Page.navigate', { url: page.url });
  await new Promise(r => setTimeout(r, 4000));

  // 2. DOM Snapshot
  const domRes = await cdpCommand('Runtime.evaluate', {
    expression: `(() => {
      return {
        url: window.location.href,
        title: document.title,
        mainOuter: document.querySelector('main')?.outerHTML || '',
        navOuter: document.querySelector('nav')?.outerHTML || '',
        bodyClass: document.body.className
      };
    })()`,
    returnByValue: true
  });
  const domData = domRes.result?.result?.value;
  if (domData) {
    fs.writeFileSync(`work/analysis/signed_in/${page.name}_main_outer.html`, domData.mainOuter || '');
    fs.writeFileSync(`work/analysis/signed_in/${page.name}_nav_outer.html`, domData.navOuter || '');
    console.log(`   Captured DOM: title "${domData.title}", main size: ${(domData.mainOuter.length / 1024).toFixed(1)} KB`);
  }

  // 3. REA inspect-web-page
  const evidencePath = path.resolve(`work/captures/page_${page.name}_evidence.json`);
  console.log(`   Running rea inspect-web-page...`);
  const inspectCmd = `rea inspect-web-page http://127.0.0.1:9222 ${liveTarget} --allowed-origins https://replit.com --allowed-origins https://cdn.replit.com --include-accessibility-text --include-json-body-shapes --include-script-sources --format json`;
  const inspectOut = execSync(inspectCmd, { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });
  fs.writeFileSync(evidencePath, inspectOut);
  console.log(`   Saved Evidence: ${evidencePath} (${(inspectOut.length / 1024 / 1024).toFixed(2)} MB)`);

  // 4. REA export-web-scripts
  const exportDir = path.resolve(`work/exported-scripts-${page.name}`);
  if (fs.existsSync(exportDir)) {
    fs.rmSync(exportDir, { recursive: true, force: true });
  }
  console.log(`   Running rea export-web-scripts...`);
  const exportCmd = `rea export-web-scripts "${evidencePath}" "${exportDir}"`;
  execSync(exportCmd, { stdio: 'inherit' });
  console.log(`   Exported scripts to: ${exportDir}`);

  // 5. REA capture-web-screenshot
  const screenshotPath = path.resolve(`work/captures/live_${page.name}_screenshot.json`);
  console.log(`   Running rea capture-web-screenshot...`);
  const snapCmd = `rea capture-web-screenshot http://127.0.0.1:9222 ${liveTarget} --format json`;
  const snapOut = execSync(snapCmd, { maxBuffer: 50 * 1024 * 1024, encoding: 'utf8' });
  fs.writeFileSync(screenshotPath, snapOut);
  const snapParsed = JSON.parse(snapOut);
  const b64 = snapParsed.normalized_result?.data_base64 || snapParsed.data_base64;
  if (b64) {
    fs.writeFileSync(`work/analysis/screens/live_${page.name}.png`, Buffer.from(b64, 'base64'));
    fs.writeFileSync(`analysis/screens/live_${page.name}.png`, Buffer.from(b64, 'base64'));
    console.log(`   Saved screenshot: analysis/screens/live_${page.name}.png`);
  }
  console.log(`[AGENT-COLLECTED] Finished: ${page.name}`);
}

async function main() {
  for (const p of pagesToCapture) {
    try {
      await captureOnePage(p);
    } catch (e) {
      console.error(`Error on ${p.name}:`, e.message);
    }
  }

  // Finally navigate back to home dashboard
  console.log(`\nNavigating back to home: https://replit.com/~`);
  await cdpCommand('Page.navigate', { url: 'https://replit.com/~' });
}

main().catch(console.error);
