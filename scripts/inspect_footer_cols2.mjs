import fs from 'fs';

const html = fs.readFileSync('work/analysis/section9-footer-live-dom.html', 'utf8');

const footerIdx = html.indexOf('replit-marketing-footer');
const fHtml = html.slice(footerIdx);

const col2Idx = fHtml.indexOf('<div class="grid grid-cols-2');
console.log(fHtml.slice(col2Idx + 2000, col2Idx + 6000));
