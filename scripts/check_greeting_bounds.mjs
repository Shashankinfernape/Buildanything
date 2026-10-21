import fs from 'fs';
import { PNG } from 'pngjs';

function getGlyphBounds(pngPath) {
  const data = fs.readFileSync(pngPath);
  const png = PNG.sync.read(data);
  let minX = png.width, maxX = 0, minY = png.height, maxY = 0;
  let bgR = png.data[0], bgG = png.data[1], bgB = png.data[2];

  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (y * png.width + x) * 4;
      const r = png.data[idx];
      const g = png.data[idx + 1];
      const b = png.data[idx + 2];
      const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
      if (diff > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { width: png.width, height: png.height, minX, maxX, minY, maxY, textHeight: maxY - minY };
}

console.log('LIVE GREETING BOUNDS :', getGlyphBounds('work/analysis/screens/live_greeting_block.png'));
console.log('RECON GREETING BOUNDS:', getGlyphBounds('work/analysis/screens/recon_greeting_block.png'));
