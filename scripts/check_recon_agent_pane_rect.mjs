import WebSocket from 'ws';

async function main() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const recon = tabs.find(t => t.id === '6D4B931B5EC0B7BE74E378FA2E19EDD9');
  const ws = new WebSocket(recon.webSocketDebuggerUrl);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const sp = document.querySelector('[data-testid="agent-working-spinner"]');
          let el = sp;
          const chain = [];
          while (el && el !== document.body) {
            const r = el.getBoundingClientRect();
            chain.push({
              tag: el.tagName,
              class: el.className?.slice ? el.className.slice(0, 40) : '',
              left: Math.round(r.left),
              top: Math.round(r.top),
              width: Math.round(r.width),
              height: Math.round(r.height)
            });
            el = el.parentElement;
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
      console.log('Chain in RECON:', JSON.stringify(msg.result?.result?.value, null, 2));
      process.exit(0);
    }
  });
}

main().catch(console.error);
