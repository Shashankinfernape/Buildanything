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
          const el = document.elementFromPoint(964, 530);
          return {
            tag: el?.tagName,
            className: el?.className,
            text: el?.innerText?.slice(0, 100),
            rect: el?.getBoundingClientRect()
          };
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', d => { console.log(JSON.stringify(JSON.parse(d).result?.result?.value, null, 2)); ws.close(); });
}
main();
