import fs from 'fs';
import WebSocket from 'ws';

async function evalInTab(targetId, expression) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression, returnByValue: true }
      }));
    });
    ws.on('message', data => {
      try {
        const msg = JSON.parse(data);
        if (msg.id === 1) {
          ws.close();
          resolve(msg.result?.result?.value);
        }
      } catch (e) {}
    });
    ws.on('error', reject);
  });
}

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
  const script = `(() => {
    const root = document.querySelector('div[class*="replEnvironmentDesktop--global-sidebar-offset"]')?.firstElementChild;
    if (!root) return 'No root';
    return Array.from(root.children).map(c => ({
      tagName: c.tagName,
      className: c.className,
      style: c.getAttribute('style'),
      rect: c.getBoundingClientRect()
    }));
  })()`;

  const children = await evalInTab(liveTarget, script);
  console.log('Direct children of workspace container:', JSON.stringify(children, null, 2));
}

main().catch(console.error);
