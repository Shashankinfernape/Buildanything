import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/library_main_outer.html', 'utf8');
const idx = html.indexOf('<ol class="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 grid gap-400 grid-cols-[repeat(auto-fill,minmax(var(--space-256),1fr))]">');
const end = html.indexOf('</li>', idx);
console.log('--- Complete Card 1 ---');
console.log(html.slice(idx, end + 5));
