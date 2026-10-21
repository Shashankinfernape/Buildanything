import WebSocket from 'ws';

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === liveTarget);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));

  const expr = `(() => {
    const el = document.elementFromPoint(260, 24);
    let p = el;
    while (p && p.parentElement && p.parentElement !== document.body) {
      const r = p.getBoundingClientRect();
      if (Math.round(r.height) === 48 && Math.round(r.left) >= 240 && Math.round(r.width) > 400 && Math.round(r.width) < 500) {
        break;
      }
      p = p.parentElement;
    }
    return {
      rect: p ? { left: Math.round(p.getBoundingClientRect().left), top: Math.round(p.getBoundingClientRect().top), width: Math.round(p.getBoundingClientRect().width), height: Math.round(p.getBoundingClientRect().height) } : null,
      html: p ? p.outerHTML : null
    };
  })()`;

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
  ws.on('message', d => {
    const m = JSON.parse(d);
    if (m.id === 1) {
      console.log('LIVE AGENT PANE HEADER CONTAINER:');
      console.log(m.result.result.value.rect);
      console.log(m.result.result.value.html);
      ws.close();
    }
  });
}

main().catch(console.error);
