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
          const toRect = r => r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } : null;
          const list = document.querySelector('ol');
          const header = Array.from(document.querySelectorAll('h2, [class*="heading"]')).find(h => h.textContent.includes('Recent projects'));
          const container = list.parentElement;
          const outer = container.parentElement;
          return {
            headerRect: toRect(header?.getBoundingClientRect()),
            listRect: toRect(list?.getBoundingClientRect()),
            containerRect: toRect(container?.getBoundingClientRect()),
            outerRect: toRect(outer?.getBoundingClientRect()),
            headerMargin: header ? window.getComputedStyle(header).margin : null,
            headerPadding: header ? window.getComputedStyle(header).padding : null,
            containerPadding: container ? window.getComputedStyle(container).padding : null,
            outerPadding: outer ? window.getComputedStyle(outer).padding : null
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
