import fs from 'fs';

// Let's inspect the two PNGs: promptbox-frozen-live.png and promptbox-frozen-recon.png
// Both are 660x268 PNGs
console.log('Live size:', fs.statSync('work/analysis/compare/promptbox-frozen-live.png').size);
console.log('Recon size:', fs.statSync('work/analysis/compare/promptbox-frozen-recon.png').size);
