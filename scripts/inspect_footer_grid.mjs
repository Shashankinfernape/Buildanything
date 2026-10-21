import fs from 'fs';

const html = fs.readFileSync('work/analysis/section9-footer-live-dom.html', 'utf8');

const footerIdx = html.indexOf('replit-marketing-footer');
const fHtml = html.slice(footerIdx);

// Look for h3, h4, or text before lists
const colMatches = [...fHtml.matchAll(/<div class="mt-[^"]*">([\s\S]*?)<\/ul>/g)];
console.log('Columns count:', colMatches.length);
if (colMatches.length === 0) {
  // Let's print the grid HTML
  const gridIdx = fHtml.indexOf('<div class="grid');
  console.log('Grid snippet:');
  console.log(fHtml.slice(gridIdx, gridIdx + 3000));
}
