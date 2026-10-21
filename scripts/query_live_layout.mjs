import WebSocket from 'ws';

async function evalLive() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === '4D5803D83D1C78981FF3E408A2F4B2D5');
  return new Promise((resolve) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            const toObj = (r) => r ? ({ x: r.x, y: r.y, w: r.width, h: r.height }) : null;
            const sidebar = document.querySelector('nav');
            const main = document.querySelector('main');
            return {
              sidebarRect: toObj(sidebar?.getBoundingClientRect()),
              mainRect: toObj(main?.getBoundingClientRect())
            };
          })()`,
          returnByValue: true
        }
      }));
    });
    ws.on('message', data => {
      ws.close();
      resolve(JSON.parse(data).result?.result?.value);
    });
  });
}

evalLive().then(r => console.log(JSON.stringify(r, null, 2))).catch(console.error);
