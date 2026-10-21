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
    const points = [
      { name: 'col1_header', x: 20, y: 20 },
      { name: 'col1_body', x: 100, y: 100 },
      { name: 'col2_tab', x: 550, y: 20 },
      { name: 'col2_body', x: 550, y: 100 },
      { name: 'col3_tab', x: 920, y: 20 },
      { name: 'col3_body', x: 920, y: 100 },
      { name: 'col4_header', x: 1300, y: 20 },
      { name: 'col4_body', x: 1300, y: 100 }
    ];

    return points.map(pt => {
      const el = document.elementFromPoint(pt.x, pt.y);
      const cs = el ? window.getComputedStyle(el) : null;
      return {
        point: pt.name,
        tag: el?.tagName,
        text: el?.innerText?.slice(0, 40).replace(/\\n/g, ' '),
        bg: cs?.backgroundColor
      };
    });
  })()`;

  const info = await evalInTab(liveTarget, script);
  console.log('Live workspace columns:');
  console.dir(info);
}

main().catch(console.error);
