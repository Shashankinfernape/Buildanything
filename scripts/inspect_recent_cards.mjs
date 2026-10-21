import fs from 'fs';

const mainHtml = fs.readFileSync('work/analysis/signed_in/live_main_outer.html', 'utf8');

const recentIdx = mainHtml.indexOf('Recent projects');
const greetingIdx = mainHtml.indexOf('what are we working on today');

if (recentIdx !== -1 && greetingIdx !== -1) {
  const cardsHtml = mainHtml.slice(recentIdx, greetingIdx);
  console.log('=== Recent Projects Cards Section ===');
  // Extract SVGs and text
  const cards = [...cardsHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(m => {
    const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const svgs = [...m[1].matchAll(/<svg[^>]*>[\s\S]*?<\/svg>/g)].map(s => s[0]);
    return { text, svgCount: svgs.length, firstSvg: svgs[0] };
  });
  console.log('Cards count:', cards.length);
  for (const c of cards) {
    console.log('Card text:', c.text);
    console.log('Has Lock/Icon SVG:', c.svgCount > 0);
  }
}
