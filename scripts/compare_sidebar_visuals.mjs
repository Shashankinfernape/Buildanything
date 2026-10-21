import WebSocket from 'ws';
import fs from 'fs';

async function main() {
  const livePngB64 = fs.readFileSync('work/analysis/screens/live_sidebar.png').toString('base64');
  const reconPngB64 = fs.readFileSync('work/analysis/screens/recon_sidebar.png').toString('base64');

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
          for (let y = 0; y < cvs.height; y += 40) {
            let count = 0;
            for (let dy = 0; dy < 40 && y + dy < cvs.height; dy++) {
              for (let x = 0; x < cvs.width; x++) {
                const idx = ((y + dy) * cvs.width + x) * 4;
                const dr = Math.abs(liveData[idx] - reconData[idx]);
                const dg = Math.abs(liveData[idx+1] - reconData[idx+1]);
                const db = Math.abs(liveData[idx+2] - reconData[idx+2]);
                if (dr > 5 || dg > 5 || db > 5) count++;
              }
            }
            summary.push({ yBlock: y + '-' + (y+40), diffCount: count, totalPixels: 40 * cvs.width, ratio: ((count / (40 * cvs.width))*100).toFixed(1) + '%' });
          }

          const liveNavBg = Array.from(ctx.getImageData(100, 20, 1, 1).data).slice(0, 3);
          return { liveNavBg, summary };
        })()`,
        awaitPromise: true,
        returnByValue: true
      }
    }));
  });
  ws.on('message', d => { console.log(JSON.stringify(JSON.parse(d).result?.result?.value, null, 2)); ws.close(); });
}
main();
