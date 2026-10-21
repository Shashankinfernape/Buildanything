import fs from 'fs';

const html = fs.readFileSync('work/analysis/section6-testimonials-live-dom.html', 'utf8');

const bubbleIdx = html.indexOf('BubbleFancyS');
console.log('Bottom-left button snippet:');
console.log(html.slice(bubbleIdx + 1500, bubbleIdx + 2800));
