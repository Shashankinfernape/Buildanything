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
          const els = Array.from(document.querySelectorAll('*')).filter(el => {
            const r = el.getBoundingClientRect();
            return r.left >= 240 && r.right <= 285 && r.top >= 48 && r.height > 10;
          }).map(el => ({
            tag: el.tagName,
            class: el.className?.slice ? el.className.slice(0, 50) : '',
            rect: { left: Math.round(el.getBoundingClientRect().left), top: Math.round(el.getBoundingClientRect().top), width: Math.round(el.getBoundingClientRect().width), height: Math.round(el.getBoundingClientRect().height) },
            ariaLabel: el.getAttribute('aria-label')
          }));
          return els.slice(0, 15);
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if (msg.id === 1) {
      console.log('Elements in 240..285 strip:');
      console.log(JSON.stringify(msg.result?.result?.value, null, 2));
      process.exit(0);
    }
  });
}

main().catch(console.error);
