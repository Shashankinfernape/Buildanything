import WebSocket from 'ws';

async function main() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === '4D5803D83D1C78981FF3E408A2F4B2D5');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const els = Array.from(document.querySelectorAll('*'));
          const glows = [];
          for (const el of els) {
            const cs = window.getComputedStyle(el);
            const before = window.getComputedStyle(el, '::before');
            const after = window.getComputedStyle(el, '::after');
            
            const check = (s, type) => {
              if (s.backgroundImage && s.backgroundImage !== 'none') {
                glows.push({ tag: el.tagName, type, bg: s.backgroundImage, rect: el.getBoundingClientRect() });
              }
              if (s.background && s.background.includes('gradient')) {
                glows.push({ tag: el.tagName, type, bg: s.background, rect: el.getBoundingClientRect() });
              }
            };
            check(cs, 'self');
            check(before, 'before');
            check(after, 'after');
          }
          return glows;
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', data => {
    console.log(JSON.stringify(JSON.parse(data).result?.result?.value, null, 2));
    ws.close();
  });
}

main();
