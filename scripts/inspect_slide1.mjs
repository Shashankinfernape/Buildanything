import fs from 'fs';

const html = fs.readFileSync('work/analysis/section6-testimonials-live-dom.html', 'utf8');

// Print first slide element
const slideMatch = html.match(/<div class="min-w-0 flex-\[0_0_calc\(100%_-_calc\(273px_-_10px_\*_2\)\)\] pr-\[273px\]"[^>]*>([\s\S]*?)<\/figcaption><\/figure><div class="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 overflow-hidden rounded-\[56px\]">/);
if (slideMatch) {
  console.log('Slide 1 start match:');
  console.log(slideMatch[0].slice(0, 500));
}
