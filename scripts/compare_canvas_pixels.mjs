import WebSocket from 'ws';
import fs from 'fs';

async function main() {
  const livePngB64 = fs.readFileSync('work/analysis/screens/live_prompt_box.png').toString('base64');
  const reconPngB64 = fs.readFileSync('work/analysis/screens/recon_prompt_box.png').toString('base64');

  const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
  const tab = tabs.find(t => t.id === '6D4B931B5EC0B7BE74E378FA2E19EDD9');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(async () => {
          const loadImg = b64 => new Promise(res => {
            const img = new Image();
            img.onload = () => res(img);
            img.src = 'data:image/png;base64,' + b64;
          });
          const imgLive = await loadImg('${livePngB64}');
          const imgRecon = await loadImg('${reconPngB64}');

          const cvs = document.createElement('canvas');
          cvs.width = imgLive.width;
          cvs.height = imgLive.height;
          const ctx = cvs.getContext('2d');

          ctx.drawImage(imgLive, 0, 0);
          const livePixel = Array.from(ctx.getImageData(100, 30, 1, 1).data);

          ctx.clearRect(0, 0, cvs.width, cvs.height);
          ctx.drawImage(imgRecon, 0, 0);
          const reconPixel = Array.from(ctx.getImageData(100, 30, 1, 1).data);

          return { livePixel, reconPixel };
        })()`,
        awaitPromise: true,
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
