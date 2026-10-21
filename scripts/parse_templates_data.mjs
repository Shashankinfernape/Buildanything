import fs from 'fs';

const html = fs.readFileSync('work/analysis/section4-templates-live-dom.html', 'utf8');

// The template card buttons have data-analytics-id="template_card"
const cardRegex = /<button[^>]*data-analytics-id="template_card"[^>]*>([\s\S]*?)<\/button>/g;
const cards = [];
let m;
while ((m = cardRegex.exec(html)) !== null) {
  const inner = m[1];
  const ariaLabel = m[0].match(/aria-label="([^"]+)"/)?.[1] || '';
  const imgSrc = inner.match(/src="([^"]+)"/)?.[1] || '';
  const aspect = inner.match(/aspect-\[([^\]]+)\]/)?.[1] || '';
  cards.push({
    title: ariaLabel,
    aspect,
    imgSrc
  });
}

console.log('Found cards:', cards.length);
console.log(JSON.stringify(cards, null, 2));
