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
          const h1 = document.querySelector('h1');
          const greetingSpan = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('what are we working on today?'));
          return {
            h1Html: h1 ? h1.outerHTML : null,
            h1Rect: h1 ? h1.getBoundingClientRect() : null,
            greetingHtml: greetingSpan ? greetingSpan.outerHTML : null,
            greetingRect: greetingSpan ? greetingSpan.getBoundingClientRect() : null
          };
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
