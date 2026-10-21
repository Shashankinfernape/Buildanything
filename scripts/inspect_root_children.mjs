import WebSocket from 'ws';

async function evalInTab(targetId, expression) {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === targetId);
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression, returnByValue: true }
      }));
    });
    ws.on('message', data => {
      try {
        const msg = JSON.parse(data);
        if (msg.id === 1) {
          ws.close();
          resolve(msg.result?.result?.value);
        }
      } catch (e) {}
    });
    ws.on('error', reject);
  });
}

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';

  const script = `(() => {
    const root = document.querySelector('#__next > div:nth-child(7)');
    if (!root) return 'Not found';
    return Array.from(root.children).map(c => {
      const r = c.getBoundingClientRect();
      return {
        tag: c.tagName,
        id: c.id,
        className: c.className.slice(0, 50),
        rect: { x: r.x, y: r.y, w: r.width, h: r.height }
      };
    });
  })()`;

  const children = await evalInTab(liveTarget, script);
  console.log('Children of root container:');
  console.log(children);
}

main().catch(console.error);
