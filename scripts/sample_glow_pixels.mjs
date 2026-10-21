import WebSocket from 'ws';
import fs from 'fs';

const liveArt = JSON.parse(fs.readFileSync('work/captures/live_bottom_glow.json', 'utf8'));
const reconArt = JSON.parse(fs.readFileSync('work/captures/recon_bottom_glow.json', 'utf8'));

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/6D4B931B5EC0B7BE74E378FA2E19EDD9');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(async () => {
        async function getPixels(b64) {
          const img = new Image();
          img.src = 'data:image/png;base64,' + b64;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = img.width; c.height = img.height;
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0);
          return ctx.getImageData(0, 0, c.width, c.height).data;
        }

        const d1 = await getPixels('${liveArt.data_base64}');
        const d2 = await getPixels('${reconArt.data_base64}');

        const samples = [];
        for (const y of [0, 50, 100, 150, 200, 250, 260]) {
          const x = 600;
          const idx = (y * 1200 + x) * 4;
          samples.push({
            relY: y,
            absY: 500 + y,
            liveRGB: [d1[idx], d1[idx+1], d1[idx+2]],
            reconRGB: [d2[idx], d2[idx+1], d2[idx+2]]
          });
        }
        return samples;
      })()`,
      awaitPromise: true,
      returnByValue: true
    }
  }));
});

ws.on('message', data => {
  console.log(JSON.stringify(JSON.parse(data).result?.result?.value, null, 2));
  process.exit(0);
});
