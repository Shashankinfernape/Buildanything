import fs from 'fs';

const html = fs.readFileSync('work/analysis/section6-testimonials-live-dom.html', 'utf8');

const parentIdx = html.indexOf('translate3d(0px, 0px, 0px)');
console.log('Around translate3d:');
console.log(html.slice(parentIdx - 400, parentIdx + 200));
