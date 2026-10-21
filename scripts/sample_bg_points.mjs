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
  const script = `(() => {
    const points = [
      { name: 'nav_bg', x: 100, y: 100 },
      { name: 'nav_item', x: 50, y: 140 },
      { name: 'cards_bg', x: 500, y: 80 },
      { name: 'greeting_bg', x: 400, y: 420 },
      { name: 'prompt_bg', x: 600, y: 660 },
      { name: 'bottom_bg', x: 600, y: 750 }
    ];

    return points.map(pt => {
      const el = document.elementFromPoint(pt.x, pt.y);
      const cs = el ? window.getComputedStyle(el) : null;
      return {
        point: pt.name,
        tag: el?.tagName,
        bg: cs?.backgroundColor,
        color: cs?.color,
        boxShadow: cs?.boxShadow
      };
    });
  })()`;

  console.log('--- LIVE POINTS ---');
  console.log(JSON.stringify(await evalInTab('4D5803D83D1C78981FF3E408A2F4B2D5', script), null, 2));

  console.log('--- RECON POINTS ---');
  console.log(JSON.stringify(await evalInTab('6D4B931B5EC0B7BE74E378FA2E19EDD9', script), null, 2));
}

main();
