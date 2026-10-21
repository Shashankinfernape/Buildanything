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
    const main = document.querySelector('main#main-content');
    if (!main) return 'No main';
    // Find all children with non-zero bounds
    const list = [];
    Array.from(main.querySelectorAll('[data-appearance="active-only"], [role="tabpanel"], [data-tab-bar="true"], [data-pane="true"]')).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 50 && r.height > 50) {
        list.push({
          tag: el.tagName,
          className: el.className.slice(0, 40),
          rect: { x: r.x, y: r.y, w: r.width, h: r.height },
          text: el.innerText.slice(0, 30).replace(/\\n/g, ' ')
        });
      }
    });
    return list;
  })()`;

  const panes = await evalInTab(liveTarget, script);
  console.log('Main panes in workspace:');
  console.dir(panes);
}

main().catch(console.error);
