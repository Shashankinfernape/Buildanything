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
          let curr = document.querySelector('p[aria-hidden="true"]');
          const chain = [];
          while (curr && curr !== document.body) {
            const cs = window.getComputedStyle(curr);
            chain.push({
              tag: curr.tagName,
              className: curr.className?.slice ? curr.className.slice(0, 50) : '',
              bg: cs.backgroundColor,
              bgImg: cs.backgroundImage
            });
            curr = curr.parentElement;
          }
          return chain;
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', d => { console.log(JSON.stringify(JSON.parse(d).result?.result?.value, null, 2)); ws.close(); });
}
main();
