import fs from 'fs';

const html = fs.readFileSync('work/analysis/section9-footer-live-dom.html', 'utf8');

const footerIdx = html.indexOf('replit-marketing-footer');
const fHtml = html.slice(footerIdx);

// Extract all link text and hrefs
const linkMatches = [...fHtml.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
console.log('Total links in footer:', linkMatches.length);

const links = linkMatches.map(m => ({
  href: m[1],
  text: m[2].replace(/<[^>]+>/g, '').trim()
}));

console.log('Sample links:');
console.log(links.slice(0, 30));

// Find column headers (h3 or strong or similar)
const headings = [...fHtml.matchAll(/<(?:h[1-6]|span|p)[^>]*font-semibold[^>]*>([\s\S]*?)<\/(?:h[1-6]|span|p)>/g)];
console.log('Headings/Columns:');
console.log(headings.map(h => h[1].replace(/<[^>]+>/g, '').trim()));
