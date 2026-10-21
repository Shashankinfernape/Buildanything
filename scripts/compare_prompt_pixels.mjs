import WebSocket from 'ws';
import fs from 'fs';

const reconArt = JSON.parse(fs.readFileSync('work/captures/recon_prompt_box.json', 'utf8'));
const liveArt = JSON.parse(fs.readFileSync('work/captures/live_prompt_box.json', 'utf8'));

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

        // Sample center of prompt box (x: 376, y: 50)
        const idx = (50 * 752 + 376) * 4;
        return {
          liveCenter: [d1[idx], d1[idx+1], d1[idx+2]],
          reconCenter: [d2[idx], d2[idx+1], d2[idx+2]],
          liveTopLeft: [d1[0], d1[1], d1[2]],
          reconTopLeft: [d2[0], d2[1], d2[2]]
        };
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
