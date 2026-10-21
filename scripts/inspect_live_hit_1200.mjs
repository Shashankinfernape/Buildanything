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
    const el = document.elementFromPoint(1200, 300);
    function getAncestors(e) {
      const path = [];
      let cur = e;
      while (cur && cur !== document.body) {
        path.push({ tag: cur.tagName, class: cur.className, rect: cur.getBoundingClientRect() });
        cur = cur.parentElement;
      }
      return path;
    }
    return el ? { hit: el.tagName, class: el.className, text: el.innerText?.slice(0, 200), path: getAncestors(el) } : 'No hit';
  })()`;

  const res = await evalInTab(liveTarget, script);
  console.log('Hit at (1200, 300):', JSON.stringify(res, null, 2));
}

main().catch(console.error);
