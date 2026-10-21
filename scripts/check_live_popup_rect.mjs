import WebSocket from 'ws';

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
          const p = document.querySelector('[data-popup="true"]');
          return p ? { left: Math.round(p.getBoundingClientRect().left), top: Math.round(p.getBoundingClientRect().top), width: Math.round(p.getBoundingClientRect().width), height: Math.round(p.getBoundingClientRect().height) } : 'No data-popup';
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if (msg.id === 1) {
      console.log('Popup rect:', JSON.stringify(msg.result?.result?.value));
      process.exit(0);
    }
  });
}

main().catch(console.error);
