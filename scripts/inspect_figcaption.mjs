import fs from 'fs';

const html = fs.readFileSync('work/analysis/section6-testimonials-live-dom.html', 'utf8');

const figcaptionIdx = html.indexOf('<figcaption');
console.log('Figcaption snippet:');
console.log(html.slice(figcaptionIdx, figcaptionIdx + 1200));
