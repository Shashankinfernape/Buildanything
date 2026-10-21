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
          let p = document.querySelector('[data-popup="true"]');
          const chain = [];
          while (p && p !== document.body) {
            const r = p.getBoundingClientRect();
            chain.push({
              tag: p.tagName,
              class: p.className?.slice ? p.className.slice(0, 60) : '',
              left: Math.round(r.left),
              top: Math.round(r.top),
              width: Math.round(r.width),
              height: Math.round(r.height)
            });
            p = p.parentElement;
          }
          return chain;
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if (msg.id === 1) {
      console.log('Parent chain of popup in LIVE:');
      console.log(JSON.stringify(msg.result?.result?.value, null, 2));
      process.exit(0);
    }
  });
}

main().catch(console.error);
