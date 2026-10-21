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
          const el = document.querySelector('[data-agent-input2-drop-target="true"]');
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const cs = window.getComputedStyle(el);
          return {
            rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
            bg: cs.backgroundColor,
            border: cs.border,
            borderRadius: cs.borderRadius,
            boxShadow: cs.boxShadow,
            backdropFilter: cs.backdropFilter
          };
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
