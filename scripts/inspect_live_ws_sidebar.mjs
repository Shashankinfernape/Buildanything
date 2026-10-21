import WebSocket from 'ws';
import fs from 'fs';

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
    // Find sidebar nav items or active item
    const nav = document.querySelector('nav') || document.querySelector('[aria-label="Sidebar"]');
    const links = Array.from(document.querySelectorAll('a, button')).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.left < 240 && rect.width > 20 && rect.height > 10;
    }).map(el => ({ text: el.innerText.trim(), tag: el.tagName, ariaLabel: el.getAttribute('aria-label'), rect: el.getBoundingClientRect() }));
    return links.slice(0, 30);
  })()`;

  const items = await evalInTab(liveTarget, script);
  console.log('Live sidebar elements (x < 240):', JSON.stringify(items, null, 2));
}

main().catch(console.error);
