import WebSocket from 'ws';
import fs from 'fs';

async function main() {
  const livePngB64 = fs.readFileSync('work/analysis/screens/live_suggested_chips.png').toString('base64');
  const reconPngB64 = fs.readFileSync('work/analysis/screens/recon_suggested_chips.png').toString('base64');

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

          // Sample background outside chips
          ctx.drawImage(imgLive, 0, 0);
          const liveBg = Array.from(ctx.getImageData(500, 10, 1, 1).data);
          const liveChip = Array.from(ctx.getImageData(50, 40, 1, 1).data);
          const live70 = Array.from(ctx.getImageData(500, 70, 1, 1).data);
          const live120 = Array.from(ctx.getImageData(500, 120, 1, 1).data);

          ctx.clearRect(0, 0, cvs.width, cvs.height);
          ctx.drawImage(imgRecon, 0, 0);
          const reconBg = Array.from(ctx.getImageData(500, 10, 1, 1).data);
          const reconChip = Array.from(ctx.getImageData(50, 40, 1, 1).data);
          const recon70 = Array.from(ctx.getImageData(500, 70, 1, 1).data);
          const recon120 = Array.from(ctx.getImageData(500, 120, 1, 1).data);

          return { liveBg, reconBg, liveChip, reconChip, live70, recon70, live120, recon120 };
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
