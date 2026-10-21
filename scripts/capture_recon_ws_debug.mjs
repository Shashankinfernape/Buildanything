import WebSocket from 'ws';
import fs from 'fs';

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

async function main() {
  const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';
  const snap = await cdpCommand(reconTarget, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('work/analysis/signed_in/recon_debug_workspace.png', Buffer.from(snap.result.data, 'base64'));
  console.log('Saved recon_debug_workspace.png');
}

main().catch(console.error);
