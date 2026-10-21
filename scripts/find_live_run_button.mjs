import WebSocket from 'ws';

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === liveTarget);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));

  const expr = `(() => {
    const b = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Run .replit'));
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height), text: b.innerText.trim(), html: b.outerHTML };
  })()`;

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
  ws.on('message', d => {
    const m = JSON.parse(d);
    if (m.id === 1) {
      console.log('LIVE RUN BUTTON:');
      console.log(m.result.result.value);
      ws.close();
    }
  });
}

main().catch(console.error);
