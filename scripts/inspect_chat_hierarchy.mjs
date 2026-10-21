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
    const el = document.elementFromPoint(350, 200);
    let curr = el;
    const hierarchy = [];
    while (curr && curr !== document.body) {
      hierarchy.push(curr.tagName + (curr.id ? '#' + curr.id : '') + (curr.className ? '.' + curr.className.split(' ')[0] : ''));
      curr = curr.parentElement;
    }
    return hierarchy;
  })()`;

  const h = await evalInTab(liveTarget, script);
  console.log('Chat hierarchy from element at (350, 200):');
  console.log(h);
}

main().catch(console.error);
