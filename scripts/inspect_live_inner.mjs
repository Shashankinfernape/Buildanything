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
    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.id === 2) {
        ws.close();
        if (msg.error) reject(msg.error);
        else resolve(msg.result?.result?.value);
      }
    });
    ws.on('error', reject);
  });
}

async function main() {
  const liveTarget = '4D5803D83D1C78981FF3E408A2F4B2D5';

  const details = await evalInTab(liveTarget, `
    (() => {
      const main = document.querySelector('main');
      const innerContainer = main.children[2];
      
      const inspectNode = (node, depth = 0) => {
        if (!node || depth > 3) return null;
        const r = node.getBoundingClientRect();
        return {
          tag: node.tagName,
          className: node.className,
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          style: node.getAttribute('style'),
          childCount: node.children?.length,
          children: Array.from(node.children || []).map(c => inspectNode(c, depth + 1))
        };
      };

      return inspectNode(innerContainer, 0);
    })()
  `);

  console.log(JSON.stringify(details, null, 2));
}

main().catch(console.error);
