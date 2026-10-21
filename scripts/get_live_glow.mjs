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
          const bodyBg = window.getComputedStyle(document.body).background;
          const htmlBg = window.getComputedStyle(document.documentElement).background;
          const main = document.querySelector('main');
          const mainBg = main ? window.getComputedStyle(main).background : null;
          const mainAfter = main ? window.getComputedStyle(main, '::after').background : null;
          const mainBefore = main ? window.getComputedStyle(main, '::before').background : null;
          return { bodyBg, htmlBg, mainBg, mainAfter, mainBefore };
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', data => {
    console.log(JSON.parse(data).result?.result?.value);
    ws.close();
  });
}
main();
