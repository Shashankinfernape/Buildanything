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
      if (!main) return 'No main element';
      
      const mainStyle = window.getComputedStyle(main);
      const children = Array.from(main.children).map(c => {
        const cs = window.getComputedStyle(c);
        const r = c.getBoundingClientRect();
        return {
          tag: c.tagName,
          className: c.className,
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          display: cs.display,
          flexDirection: cs.flexDirection,
          justifyContent: cs.justifyContent,
          alignItems: cs.alignItems,
          padding: cs.padding,
          margin: cs.margin,
          innerPreview: c.innerText?.slice(0, 100)
        };
      });

      return {
        main: {
          className: main.className,
          rect: {
            x: Math.round(main.getBoundingClientRect().x),
            y: Math.round(main.getBoundingClientRect().y),
            w: Math.round(main.getBoundingClientRect().width),
            h: Math.round(main.getBoundingClientRect().height)
          },
          display: mainStyle.display,
          flexDirection: mainStyle.flexDirection,
          justifyContent: mainStyle.justifyContent,
          alignItems: mainStyle.alignItems,
          padding: mainStyle.padding,
          backgroundColor: mainStyle.backgroundColor
        },
        children
      };
    })()
  `);

  console.log(JSON.stringify(details, null, 2));
}

main().catch(console.error);
