import fs from 'fs';

const html = fs.readFileSync('work/analysis/section9-footer-live-dom.html', 'utf8');

const footerIdx = html.indexOf('replit-marketing-footer');
const fHtml = html.slice(footerIdx);

// Look for the columns after col 1
const col2Idx = fHtml.indexOf('<div class="grid grid-cols-2');
if (col2Idx !== -1) {
  console.log(fHtml.slice(col2Idx, col2Idx + 3000));
} else {
  // Let's find where the links start
  const linksStart = fHtml.indexOf('/design');
  console.log('Links start:');
  console.log(fHtml.slice(linksStart - 400, linksStart + 2000));
}
