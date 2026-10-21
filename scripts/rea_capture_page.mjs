import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';

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

async function navigateAndWait(url) {
  console.log(`[AGENT-COLLECTED] Navigating live tab to: ${url}`);
  await cdpCommand('Page.navigate', { url });
  // Wait 4 seconds for DOM and network requests to settle
  await new Promise(r => setTimeout(r, 4000));
}

async function captureDomSnapshots(pageName) {
  const res = await cdpCommand('Runtime.evaluate', {
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
  const data = res.result?.result?.value;
  if (data) {
    fs.writeFileSync(`work/analysis/signed_in/${pageName}_main_outer.html`, data.mainOuter || '');
    fs.writeFileSync(`work/analysis/signed_in/${pageName}_nav_outer.html`, data.navOuter || '');
    console.log(`[AGENT-COLLECTED] Saved DOM snapshots for ${pageName} (${data.url}, title: "${data.title}")`);
  }
  return data;
}

async function runReaDecompile(pageName) {
  console.log(`\n=== RUNNING REA DECOMPILE PIPELINE FOR: ${pageName} ===`);
  const evidencePath = path.resolve(`work/captures/page_${pageName}_evidence.json`);
  const exportDir = path.resolve(`work/exported-scripts-${pageName}`);
  const screenshotPath = path.resolve(`work/captures/live_${pageName}_screenshot.json`);

  if (!fs.existsSync('work/captures')) fs.mkdirSync('work/captures', { recursive: true });

  // 1. REA inspect-web-page (if not already captured)
  if (!fs.existsSync(evidencePath) || fs.statSync(evidencePath).size === 0) {
    console.log(`1. Running rea inspect-web-page...`);
    const inspectCmd = `rea inspect-web-page http://127.0.0.1:9222 ${liveTarget} --allowed-origins https://replit.com --allowed-origins https://cdn.replit.com --include-accessibility-text --include-json-body-shapes --include-script-sources --format json`;
    const inspectOut = execSync(inspectCmd, { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });
    fs.writeFileSync(evidencePath, inspectOut);
    console.log(`   Saved Evidence: ${evidencePath} (${(inspectOut.length / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    console.log(`1. Using existing Evidence: ${evidencePath} (${(fs.statSync(evidencePath).size / 1024 / 1024).toFixed(2)} MB)`);
  }

  // 2. REA export-web-scripts with ABSOLUTE paths
  console.log(`2. Running rea export-web-scripts...`);
  if (fs.existsSync(exportDir)) {
    fs.rmSync(exportDir, { recursive: true, force: true });
  }
  const exportCmd = `rea export-web-scripts "${evidencePath}" "${exportDir}"`;
  execSync(exportCmd, { stdio: 'inherit' });
  console.log(`   Exported retained scripts into: ${exportDir}`);

  // 3. REA capture-web-screenshot
  console.log(`3. Running rea capture-web-screenshot...`);
  const snapCmd = `rea capture-web-screenshot http://127.0.0.1:9222 ${liveTarget} --format json`;
  const snapOut = execSync(snapCmd, { maxBuffer: 50 * 1024 * 1024, encoding: 'utf8' });
  fs.writeFileSync(screenshotPath, snapOut);
  const snapParsed = JSON.parse(snapOut);
  const b64 = snapParsed.normalized_result?.data_base64 || snapParsed.data_base64;
  if (b64) {
    fs.writeFileSync(`work/analysis/screens/live_${pageName}.png`, Buffer.from(b64, 'base64'));
    fs.writeFileSync(`analysis/screens/live_${pageName}.png`, Buffer.from(b64, 'base64'));
    console.log(`   Saved screenshot: analysis/screens/live_${pageName}.png`);
  }
  console.log(`=== REA DECOMPILE FOR ${pageName} COMPLETE ===\n`);
}

async function main() {
  const pageName = process.argv[2] || 'library';
  const targetUrl = process.argv[3] || 'https://replit.com/repls';

  await navigateAndWait(targetUrl);
  await captureDomSnapshots(pageName);
  await runReaDecompile(pageName);
}

main().catch(console.error);
