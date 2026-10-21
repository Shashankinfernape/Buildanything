import fs from 'fs';

const html = fs.readFileSync('work/analysis/section9-footer-live-dom.html', 'utf8');

const footerIdx = html.indexOf('replit-marketing-footer');
const fHtml = html.slice(footerIdx);
const gridIdx = fHtml.indexOf('<div class="grid');
console.log(fHtml.slice(gridIdx + 3000, gridIdx + 7000));
