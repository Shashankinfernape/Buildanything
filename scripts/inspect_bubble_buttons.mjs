import fs from 'fs';

const html = fs.readFileSync('work/analysis/section6-testimonials-live-dom.html', 'utf8');

// Find the BubbleFancyS buttons
const bubbleIdx = html.indexOf('BubbleFancyS');
console.log('BubbleFancyS HTML snippet:');
console.log(html.slice(bubbleIdx - 100, bubbleIdx + 2000));
