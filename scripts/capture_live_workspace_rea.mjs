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

async function captureWorkspace() {
  const replUrl = 'https://replit.com/@infernapeshasha/DeficientPlumpMisrac';
  console.log(`[AGENT-COLLECTED] Navigating live tab to repl workspace: ${replUrl}`);
  await cdpCommand('Page.navigate', { url: replUrl });
  // Wait 6 seconds for workspace editor, filetree, and panes to mount
  await new Promise(r => setTimeout(r, 6000));

  // Capture DOM
  const domRes = await cdpCommand('Runtime.evaluate', {
    expression: `(() => {
      return {
        url: window.location.href,
        title: document.title,
        bodyHtml: document.body.innerHTML.slice(0, 100000),
        mainOuter: document.querySelector('main')?.outerHTML || '',
        workspaceContainer: document.querySelector('[data-cy="workspace-layout"]')?.outerHTML || document.querySelector('#root')?.outerHTML || ''
      };
    })()`,
    returnByValue: true
  });

  const dom = domRes.result?.result?.value;
  if (dom) {
    fs.writeFileSync('work/analysis/signed_in/workspace_main_outer.html', dom.mainOuter || dom.workspaceContainer || '');
    console.log(`Saved workspace DOM snapshot! (Title: "${dom.title}")`);
  }

  // REA inspect-web-page
  console.log('Running rea inspect-web-page on workspace...');
  const evidencePath = path.resolve('work/captures/page_workspace_evidence.json');
  const inspectCmd = `rea inspect-web-page http://127.0.0.1:9222 ${liveTarget} --allowed-origins https://replit.com --allowed-origins https://cdn.replit.com --include-accessibility-text --include-json-body-shapes --include-script-sources --format json`;
  const inspectOut = execSync(inspectCmd, { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });
  fs.writeFileSync(evidencePath, inspectOut);
  console.log(`Saved workspace Evidence: ${evidencePath} (${(inspectOut.length / 1024 / 1024).toFixed(2)} MB)`);

  // REA export-web-scripts
  console.log('Running rea export-web-scripts on workspace...');
  const exportDir = path.resolve('work/exported-scripts-workspace');
  if (fs.existsSync(exportDir)) {
    fs.rmSync(exportDir, { recursive: true, force: true });
  }
  const exportCmd = `rea export-web-scripts "${evidencePath}" "${exportDir}"`;
  execSync(exportCmd, { stdio: 'inherit' });
  console.log(`Exported workspace scripts into: ${exportDir}`);

  // Screenshot
  const snapRes = await cdpCommand('Page.captureScreenshot', { format: 'png' });
  const b64 = snapRes.result?.data;
  if (b64) {
    fs.writeFileSync('work/analysis/screens/live_workspace.png', Buffer.from(b64, 'base64'));
    fs.writeFileSync('analysis/screens/live_workspace.png', Buffer.from(b64, 'base64'));
    console.log('Saved workspace screenshot: analysis/screens/live_workspace.png');
  }

  // Navigate back to ~
  console.log('Navigating back to https://replit.com/~');
  await cdpCommand('Page.navigate', { url: 'https://replit.com/~' });
}

captureWorkspace().catch(console.error);
