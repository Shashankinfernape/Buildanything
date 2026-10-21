import fs from 'fs';

const html = fs.readFileSync('work/analysis/live_child1_outer.html', 'utf8');

// Let's find each pill block
// Each pill starts with <div class="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start
const parts = html.split('<div class="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-center items-center w-2400 snap-start');

console.log('Number of pill parts:', parts.length - 1);

const pills = [];
for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  const labelMatch = part.match(/<span class="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs[^>]*>([^<]+)<\/span>/);
  const svgMatch = part.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  pills.push({
    label: labelMatch ? labelMatch[1] : `Pill ${i}`,
    svgInner: svgMatch ? svgMatch[1].trim() : ''
  });
}

console.log(JSON.stringify(pills.map(p => ({ label: p.label, svgLen: p.svgInner.length })), null, 2));

fs.writeFileSync('work/analysis/extracted_pills.json', JSON.stringify(pills, null, 2), 'utf8');
