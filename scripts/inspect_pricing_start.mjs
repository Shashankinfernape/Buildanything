import fs from 'fs';

const html = fs.readFileSync('work/analysis/section7-pricing-live-dom.html', 'utf8');
console.log(html.slice(0, 2500));
