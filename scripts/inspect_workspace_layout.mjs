import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/workspace_main_outer.html', 'utf8');

const divRegex = /<div([^>]+(?:flex|grid|width|height|data-|id=)[^>]*)>/g;
let m;
let count = 0;
const layoutDivs = [];
while ((m = divRegex.exec(html)) !== null && count < 30) {
  layoutDivs.push(m[1].slice(0, 150));
  count++;
}
console.log('Sample layout divs:');
layoutDivs.forEach((d, i) => console.log(`${i}: <div ${d}>`));
