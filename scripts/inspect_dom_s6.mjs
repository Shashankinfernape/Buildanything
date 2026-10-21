import fs from 'fs';

const html = fs.readFileSync('work/analysis/section6-testimonials-live-dom.html', 'utf8');

// Print clean outline of elements
console.log('Structure:');
// Let's inspect the first slide
const match = html.match(/<div class="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start items-stretch shrink-0 flex-row"[^>]*>([\s\S]*?)<\/div><\/div><div class="pointer-events-none absolute left-0 top-0/);
if (match) {
  console.log('Carousel container match found! Length:', match[0].length);
}

// Check SVG in BubbleFancyS
const svgMatch = html.match(/<svg[\s\S]*?<\/svg>/);
if (svgMatch) {
  console.log('BubbleFancyS SVG:', svgMatch[0]);
}
