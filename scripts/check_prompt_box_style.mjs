import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/4D5803D83D1C78981FF3E408A2F4B2D5');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const el = document.querySelector('[data-agent-input2-drop-target=true]');
        const s = getComputedStyle(el);
        return {
          bg: s.backgroundColor,
          border: s.borderColor,
          boxShadow: s.boxShadow,
          backdropFilter: s.backdropFilter,
          opacity: s.opacity,
          color: s.color
        };
      })()`,
      returnByValue: true
    }
  }));
});

ws.on('message', data => {
  console.log('Live prompt box computed style:', JSON.parse(data).result?.result?.value);
  process.exit(0);
});
