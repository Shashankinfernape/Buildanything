import WebSocket from 'ws';
import fs from 'fs';

async function main() {
  const livePngB64 = fs.readFileSync('work/analysis/screens/live_full.png').toString('base64');

  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === '6D4B931B5EC0B7BE74E378FA2E19EDD9');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(async () => {
          const img = new Image();
          await new Promise(r => { img.onload = r; img.src = 'data:image/png;base64,' + '${livePngB64}'; });
          const cvs = document.createElement('canvas');
          cvs.width = img.width; cvs.height = img.height;
          const ctx = cvs.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const verticalCenter = [];
          for (let y = 50; y < img.height; y += 50) {
            const p = Array.from(ctx.getImageData(720, y, 1, 1).data).slice(0, 3);
            verticalCenter.push({ y, rgb: p });
          }

          const horizontal600 = [];
          for (let x = 300; x < img.width; x += 100) {
            const p = Array.from(ctx.getImageData(x, 600, 1, 1).data).slice(0, 3);
            horizontal600.push({ x, rgb: p });
          }

          return { verticalCenter, horizontal600 };
        })()`,
        awaitPromise: true,
        returnByValue: true
      }
    }));
  });
  ws.on('message', d => { console.log(JSON.stringify(JSON.parse(d).result?.result?.value, null, 2)); ws.close(); });
}
main();
