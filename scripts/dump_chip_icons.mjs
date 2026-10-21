import fs from 'fs';

const mainHtml = fs.readFileSync('work/analysis/signed_in/live_main_outer.html', 'utf8');

const chips = [
  'Help me get things done',
  'Find emails needing my reply',
  'Turn my notes into a slide deck'
];
const chipIcons = {};

for (const c of chips) {
  const idx = mainHtml.indexOf(c);
  if (idx !== -1) {
    const btnStart = mainHtml.lastIndexOf('<button', idx);
    const btnEnd = mainHtml.indexOf('</button>', idx) + 9;
    const btnHtml = mainHtml.slice(btnStart, btnEnd);
    const svgMatch = btnHtml.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
    chipIcons[c] = svgMatch ? svgMatch[0] : null;
  }
}

// More ideas refresh button
const refreshIdx = mainHtml.indexOf('aria-label="More ideas..."');
if (refreshIdx !== -1) {
  const btnStart = mainHtml.lastIndexOf('<button', refreshIdx);
  const btnEnd = mainHtml.indexOf('</button>', refreshIdx) + 9;
  const svgMatch = mainHtml.slice(btnStart, btnEnd).match(/<svg[^>]*>[\s\S]*?<\/svg>/);
  chipIcons['More ideas...'] = svgMatch ? svgMatch[0] : null;
}

fs.writeFileSync('work/analysis/signed_in/chip_icons.json', JSON.stringify(chipIcons, null, 2), 'utf8');
console.log('Saved chip_icons.json with authentic SVGs.');
