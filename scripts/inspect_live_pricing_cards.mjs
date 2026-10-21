import fs from 'fs';

const html = fs.readFileSync('work/analysis/section7-pricing-live-dom.html', 'utf8');

console.log('Live DOM length:', html.length);

// Print the 4 cards plan names and prices
const cardMatches = [...html.matchAll(/<div class="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 gap-400 h-full rounded-24 border px-600 py-700[^"]*"[\s\S]*?(?=<div class="flex box-border min-h-0 min-w-0 border-solid view-outline-none flex-col shrink-0 gap-400 h-full rounded-24 border px-600 py-700|$)/g)];

console.log('Cards found:', cardMatches.length);
for (let i = 0; i < cardMatches.length; i++) {
  console.log(`\n--- Card ${i + 1} ---`);
  const cardText = cardMatches[i][0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(cardText.slice(0, 200));
}
