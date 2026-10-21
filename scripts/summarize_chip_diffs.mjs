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

          ctx.drawImage(imgLive, 0, 0);
          const liveData = ctx.getImageData(0, 0, cvs.width, cvs.height).data;

          ctx.clearRect(0, 0, cvs.width, cvs.height);
          ctx.drawImage(imgRecon, 0, 0);
          const reconData = ctx.getImageData(0, 0, cvs.width, cvs.height).data;

          const summary = [];
          for (let y = 0; y < cvs.height; y += 10) {
            let count = 0;
            let sumX = 0;
            for (let dy = 0; dy < 10 && y + dy < cvs.height; dy++) {
              for (let x = 0; x < cvs.width; x++) {
                const idx = ((y + dy) * cvs.width + x) * 4;
                const dr = Math.abs(liveData[idx] - reconData[idx]);
                const dg = Math.abs(liveData[idx+1] - reconData[idx+1]);
                const db = Math.abs(liveData[idx+2] - reconData[idx+2]);
                if (dr > 5 || dg > 5 || db > 5) {
                  count++;
                  sumX += x;
                }
              }
            }
            summary.push({ yBlock: y + '-' + (y+10), diffCount: count, avgX: count ? Math.round(sumX / count) : 0 });
          }

          return summary;
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
