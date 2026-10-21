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
          // Find whatever is inside x: 240..691, y: 48..765
          const el = document.elementFromPoint(400, 300);
          return el ? { tag: el.tagName, class: el.className, text: el.innerText } : 'No element at 400, 300';
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if (msg.id === 1) {
      console.log('Element at 400, 300 in live tab:\n', msg.result?.result?.value);
      process.exit(0);
    }
  });
}

main().catch(console.error);
