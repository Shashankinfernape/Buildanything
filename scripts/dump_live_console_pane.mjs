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
    // Find right console pane around x: 1102 to 1440
    const pane = Array.from(document.querySelectorAll('div')).find(d => {
      const r = d.getBoundingClientRect();
      return r.left >= 1100 && r.top >= 40 && r.width >= 300 && r.height >= 600;
    });
    return pane ? pane.outerHTML : 'Not found';
  })()`;

  const html = await evalInTab(liveTarget, script);
  fs.writeFileSync('work/analysis/signed_in/live_console_pane.html', html);
  console.log('Saved live_console_pane.html! Length:', html.length);
}

main().catch(console.error);
