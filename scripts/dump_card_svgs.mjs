import fs from 'fs';

const mainHtml = fs.readFileSync('work/analysis/signed_in/live_main_outer.html', 'utf8');

const recentIdx = mainHtml.indexOf('Recent projects');
if (recentIdx !== -1) {
  const cardsStart = mainHtml.indexOf('<ol', recentIdx);
  const firstCardEnd = mainHtml.indexOf('</li>', cardsStart) + 5;
  const firstCard = mainHtml.slice(cardsStart, firstCardEnd);
  const svgs = [...firstCard.matchAll(/<svg[^>]*>[\s\S]*?<\/svg>/g)].map(s => s[0]);
  console.log('Total SVGs in first card:', svgs.length);
  for (const s of svgs) {
    console.log('SVG:', s);
  }
}
