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
          const next = document.querySelector('#__next');
          return {
            nextBg: next ? window.getComputedStyle(next).backgroundColor : null,
            nextBgImg: next ? window.getComputedStyle(next).backgroundImage : null,
            bodyBg: window.getComputedStyle(document.body).backgroundColor,
            bodyBgImg: window.getComputedStyle(document.body).backgroundImage
          };
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', d => { console.log(JSON.parse(d).result?.result?.value); ws.close(); });
}
main();
