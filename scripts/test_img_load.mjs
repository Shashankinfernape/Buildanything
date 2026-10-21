import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/6D4B931B5EC0B7BE74E378FA2E19EDD9');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(async () => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const c = document.querySelector('canvas');
            const ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0, c.width, c.height);
            const p = ctx.getImageData(720, 750, 1, 1).data;
            resolve({ loaded: true, w: img.width, h: img.height, pixelAt750: [p[0], p[1], p[2], p[3]] });
          };
          img.onerror = () => resolve({ error: true });
          img.src = '/live_canvas_glow.png';
        });
      })()`,
      awaitPromise: true,
      returnByValue: true
    }
  }));
});

ws.on('message', data => {
  console.log(JSON.parse(data).result?.result?.value);
  process.exit(0);
});
