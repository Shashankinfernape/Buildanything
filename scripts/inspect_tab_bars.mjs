import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/workspace_main_outer.html', 'utf8');

const idx1 = html.indexOf('data-tab-bar="true"');
const idx2 = html.indexOf('data-tab-bar="true"', idx1 + 1);

console.log('--- TAB BAR 1 ---');
console.log(html.slice(idx1, idx1 + 1000));

console.log('\n--- TAB BAR 2 ---');
console.log(html.slice(idx2, idx2 + 1000));
