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
          let el = document.elementFromPoint(400, 300);
          while (el && el.parentElement && el.parentElement.tagName !== 'BODY') {
            const r = el.getBoundingClientRect();
            if (r.left >= 240 && r.left <= 250 && r.top >= 40 && r.top <= 50) {
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
      fs.writeFileSync('work/analysis/signed_in/live_agent_pane_current.html', html);
      console.log('Saved live_agent_pane_current.html! Length:', html?.length);
      process.exit(0);
    }
  });
}

main().catch(console.error);
