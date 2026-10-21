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
    // Find all top-level containers by inspecting elements under body
    const containers = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.height === 765 && r.y === 0 && (r.width === 240 || r.width > 200) && el.parentElement === document.querySelector('#__next > div:nth-child(7) > div') || el.tagName === 'NAV' || el.tagName === 'MAIN') {
        containers.push({
          tag: el.tagName,
          id: el.id,
          ariaLabel: el.getAttribute('aria-label'),
          text: el.innerText.slice(0, 30).replace(/\\n/g, ' '),
          rect: { x: r.x, y: r.y, w: r.width, h: r.height }
        });
      }
    });
    return containers;
  })()`;

  const list = await evalInTab(liveTarget, script);
  console.log('Top level full-height containers:');
  console.log(list);
}

main().catch(console.error);
