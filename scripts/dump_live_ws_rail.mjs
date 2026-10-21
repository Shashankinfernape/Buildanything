import WebSocket from 'ws';
import fs from 'fs';

async function main() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === '4D5803D83D1C78981FF3E408A2F4B2D5');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const btn = document.querySelector('button[aria-label="Main"]');
          let el = btn;
          while (el && el.parentElement && el.parentElement.tagName !== 'BODY') {
            const r = el.getBoundingClientRect();
            if (r.left >= 240 && r.width >= 40 && r.width <= 50 && r.height >= 700) {
              return el.outerHTML;
            }
            el = el.parentElement;
          }
          return el ? el.outerHTML : 'Not found';
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if (msg.id === 1) {
      const html = msg.result?.result?.value;
      fs.writeFileSync('work/analysis/signed_in/live_ws_rail_exact.html', html);
      console.log('Saved live_ws_rail_exact.html! Length:', html?.length);
      process.exit(0);
    }
  });
}

main().catch(console.error);
