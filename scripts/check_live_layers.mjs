import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/4D5803D83D1C78981FF3E408A2F4B2D5');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const c = document.querySelector('canvas');
        return {
          isWebgl2: !!c.getContext('webgl2'),
          isWebgl: !!c.getContext('webgl'),
          is2d: !!c.getContext('2d'),
          parent: {
            cls: c.parentElement.className,
            style: c.parentElement.getAttribute('style')
          }
        };
      })()`,
      returnByValue: true
    }
  }));
});

ws.on('message', data => {
  console.log(JSON.stringify(JSON.parse(data).result?.result?.value, null, 2));
  process.exit(0);
});
