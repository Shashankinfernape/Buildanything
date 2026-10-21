import WebSocket from 'ws';

async function evalInTab(targetId, expression) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.bringToFront' }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: { expression, returnByValue: true }
        }));
      }, 100);
    });
    ws.on('message', data => {
      const msg = JSON.parse(data);
      if (msg.id === 2) {
        ws.close();
        resolve(msg.result?.result?.value);
      }
    });
  });
}

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';
  const reconTarget = '6D4B931B5EC0B7BE74E378FA2E19EDD9';

  const script = `(() => {
    const nav = document.querySelector('nav');
    if (!nav) return null;
    const items = Array.from(nav.querySelectorAll('a, button, [role="button"], h2, [class*="card"]')).map(el => {
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return {
        text: el.innerText?.trim().slice(0, 30),
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        bg: cs.backgroundColor,
        color: cs.color,
        border: cs.border,
        borderRadius: cs.borderRadius
      };
    });
    return items.filter(i => i.text && i.rect.w > 0 && i.rect.h > 0);
  })()`;

  console.log('--- LIVE NAV ITEMS ---');
  console.log(JSON.stringify(await evalInTab(liveTarget, script), null, 2));

  console.log('--- RECON NAV ITEMS ---');
  console.log(JSON.stringify(await evalInTab(reconTarget, script), null, 2));
}

main();
