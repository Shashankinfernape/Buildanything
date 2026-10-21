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
    // Find elements above y: 48 and between x: 240 and 1440
    const topBar = Array.from(document.querySelectorAll('*')).find(el => {
      const rect = el.getBoundingClientRect();
      return rect.top === 0 && rect.height >= 40 && rect.height <= 50 && rect.width >= 1000;
    });
    if (topBar) {
      return {
        className: topBar.className,
        style: topBar.getAttribute('style'),
        rect: topBar.getBoundingClientRect(),
        html: topBar.outerHTML
      };
    }
    return null;
  })()`;

  const res = await evalInTab(liveTarget, script);
  console.log('Top bar found:', res ? { class: res.className, rect: res.rect } : 'Not found');
  if (res) {
    fs.writeFileSync('work/analysis/signed_in/live_ws_topbar.html', res.html);
    console.log('Saved live_ws_topbar.html! Length:', res.html.length);
  }
}

main().catch(console.error);
