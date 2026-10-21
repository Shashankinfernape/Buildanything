import fs from 'fs';

const html = fs.readFileSync('work/analysis/section9-footer-live-dom.html', 'utf8');

const footerIdx = html.indexOf('replit-marketing-footer');
console.log('Marketing footer HTML:');
console.log(html.slice(footerIdx - 20, footerIdx + 3000));
