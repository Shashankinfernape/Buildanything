import fs from 'fs';
import { PNG } from 'pngjs';

const live = PNG.sync.read(fs.readFileSync('work/analysis/screens/live_greeting_block.png'));
const recon = PNG.sync.read(fs.readFileSync('work/analysis/screens/recon_greeting_block.png'));

console.log(`Live size: ${live.width}x${live.height}, Recon size: ${recon.width}x${recon.height}`);

let diffCount5 = 0;
let diffCount1 = 0;
let minY = 999, maxY = 0, minX = 999, maxX = 0;

for (let y = 0; y < live.height; y++) {
  for (let x = 0; x < live.width; x++) {
    const idx = (y * live.width + x) * 4;
    const dr = Math.abs(live.data[idx] - recon.data[idx]);
    const dg = Math.abs(live.data[idx+1] - recon.data[idx+1]);
    const db = Math.abs(live.data[idx+2] - recon.data[idx+2]);
    const maxDelta = Math.max(dr, dg, db);
    if (maxDelta > 1) diffCount1++;
    if (maxDelta > 5) {
      diffCount5++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`Threshold 5 diff: ${diffCount5} / ${live.width * live.height} (${(diffCount5/(live.width*live.height)*100).toFixed(2)}%)`);
console.log(`Diff bounding box: x:[${minX}, ${maxX}], y:[${minY}, ${maxY}]`);
