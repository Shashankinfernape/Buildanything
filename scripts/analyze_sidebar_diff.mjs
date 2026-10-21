import WebSocket from 'ws';
import fs from 'fs';

const liveArt = JSON.parse(fs.readFileSync('work/captures/live_sidebar.json', 'utf8'));
const reconArt = JSON.parse(fs.readFileSync('work/captures/recon_sidebar.json', 'utf8'));

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/6D4B931B5EC0B7BE74E378FA2E19EDD9');
ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(async () => {
        const liveImg = new Image();
        liveImg.src = 'data:image/png;base64,${liveArt.data_base64}';
        await liveImg.decode();

        const reconImg = new Image();
        reconImg.src = 'data:image/png;base64,${reconArt.data_base64}';
        await reconImg.decode();

        const c1 = document.createElement('canvas');
        c1.width = liveImg.width; c1.height = liveImg.height;
        const ctx1 = c1.getContext('2d');
        ctx1.drawImage(liveImg, 0, 0);
        const d1 = ctx1.getImageData(0, 0, c1.width, c1.height).data;

        const c2 = document.createElement('canvas');
        c2.width = reconImg.width; c2.height = reconImg.height;
        const ctx2 = c2.getContext('2d');
        ctx2.drawImage(reconImg, 0, 0);
        const d2 = ctx2.getImageData(0, 0, c2.width, c2.height).data;

        // Find rows with differences > 5 threshold
        const rowDiffs = [];
        for (let y = 0; y < c1.height; y++) {
          let diffCount = 0;
          for (let x = 0; x < c1.width; x++) {
            const idx = (y * c1.width + x) * 4;
            const dr = Math.abs(d1[idx] - d2[idx]);
            const dg = Math.abs(d1[idx+1] - d2[idx+1]);
            const db = Math.abs(d1[idx+2] - d2[idx+2]);
            if (Math.max(dr, dg, db) > 5) diffCount++;
          }
          if (diffCount > 0) {
            rowDiffs.push({ y, diffCount, pct: (diffCount / c1.width * 100).toFixed(1) });
          }
        }
        return {
          totalRows: c1.height,
          diffRowRanges: (() => {
            const ranges = [];
            let start = null, prev = null;
            for (const r of rowDiffs) {
              if (start === null) { start = r.y; prev = r.y; }
              else if (r.y === prev + 1) { prev = r.y; }
              else { ranges.push({ from: start, to: prev, count: prev - start + 1 }); start = r.y; prev = r.y; }
            }
            if (start !== null) ranges.push({ from: start, to: prev, count: prev - start + 1 });
            return ranges;
          })(),
          topRows: rowDiffs.slice(0, 15),
          bottomRows: rowDiffs.slice(-15)
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    }
  }));
});

ws.on('message', data => {
  console.log(JSON.stringify(JSON.parse(data).result.result.value, null, 2));
  process.exit(0);
});
