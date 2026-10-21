import fs from 'fs';

const html = fs.readFileSync('work/analysis/live_child1_outer.html', 'utf8');

const promptSecStart = html.indexOf('<div class="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 _sdz_theme-text-input _sdz_surface _sdz_switch-theme">');
const promptSec = html.slice(promptSecStart);

fs.writeFileSync('work/analysis/live_prompt_section.html', promptSec, 'utf8');
console.log('Saved live prompt section, length:', promptSec.length);
