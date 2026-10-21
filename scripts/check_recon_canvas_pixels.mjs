import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/6D4B931B5EC0B7BE74E378FA2E19EDD9');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const c = document.querySelector('canvas');
        if (!c) return 'no canvas';
        const ctx = c.getContext('2d');
        const p1 = ctx.getImageData(720, 500, 1, 1).data;
        const p2 = ctx.getImageData(720, 750, 1, 1).data;
        return {
          pixelAt500: [p1[0], p1[1], p1[2], p1[3]],
          pixelAt750: [p2[0], p2[1], p2[2], p2[3]]
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
