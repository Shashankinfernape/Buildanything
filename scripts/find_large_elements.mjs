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
          const els = Array.from(document.querySelectorAll('svg, canvas, img, div'));
          return els.filter(el => {
            const r = el.getBoundingClientRect();
            return r.y >= 400 && r.height >= 100 && r.width >= 400;
          }).map(el => ({
            tag: el.tagName,
            id: el.id,
            className: typeof el.className === 'string' ? el.className.slice(0, 100) : '',
            rect: { x: Math.round(el.getBoundingClientRect().x), y: Math.round(el.getBoundingClientRect().y), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) },
            bg: window.getComputedStyle(el).backgroundColor,
            bgImg: window.getComputedStyle(el).backgroundImage
          }));
        })()`,
        returnByValue: true
      }
    }));
  });
  ws.on('message', d => { console.log(JSON.stringify(JSON.parse(d).result?.result?.value, null, 2)); ws.close(); });
}
main();
