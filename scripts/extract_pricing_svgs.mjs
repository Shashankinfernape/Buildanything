import fs from 'fs';

const html = fs.readFileSync('work/analysis/section7-pricing-live-dom.html', 'utf8');

const svgMatches = [...html.matchAll(/<svg[^>]*>([\s\S]*?)<\/svg>/g)];
const paths = new Set();
for (const m of svgMatches) {
  const p = m[1].match(/<path[^>]*>/);
  if (p) paths.add(p[0]);
}

console.log('Unique SVG paths in pricing section:');
for (const p of paths) {
  console.log(p);
}
