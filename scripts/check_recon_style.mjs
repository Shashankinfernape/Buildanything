import WebSocket from 'ws';

async function main() {
  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === '6D4B931B5EC0B7BE74E378FA2E19EDD9');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: '(() => { const el = document.querySelector(".w-\\\\[752px\\\\]"); return el ? { computedWidth: window.getComputedStyle(el).width, rect: el.getBoundingClientRect(), classes: el.className } : "not found"; })()',
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
