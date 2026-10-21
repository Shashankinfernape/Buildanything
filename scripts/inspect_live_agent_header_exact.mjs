import WebSocket from 'ws';

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === liveTarget);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));

  const expr = `(() => {
    const els = Array.from(document.querySelectorAll('*')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.left >= 241 && r.right <= 691 && r.top >= 48 && r.bottom <= 765 && el.children.length === 0 && (el.innerText || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'path');
    }).map(el => ({
      tag: el.tagName,
      className: el.className,
      rect: { left: Math.round(el.getBoundingClientRect().left), top: Math.round(el.getBoundingClientRect().top), width: Math.round(el.getBoundingClientRect().width), height: Math.round(el.getBoundingClientRect().height) },
      text: el.innerText ? el.innerText.trim() : ''
    }));
    return els;
  })()`;

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
  ws.on('message', d => {
    const m = JSON.parse(d);
    if (m.id === 1) {
      console.log('LIVE ELEMENTS IN AGENT HEADER:');
      console.log(JSON.stringify(m.result.result.value, null, 2));
      ws.close();
    }
  });
}

main().catch(console.error);
