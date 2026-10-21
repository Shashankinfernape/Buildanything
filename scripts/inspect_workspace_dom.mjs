import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/workspace_main_outer.html', 'utf8');

const ariaLabels = [];
const ariaRegex = /aria-label="([^"]+)"/g;
let match;
while ((match = ariaRegex.exec(html)) !== null) {
  ariaLabels.push(match[1]);
}

const buttons = [];
const btnRegex = /<button[^>]*>([\s\S]*?)<\/button>/g;
while ((match = btnRegex.exec(html)) !== null) {
  const text = match[1].replace(/<[^>]+>/g, '').trim();
  if (text) buttons.push(text);
}

const titles = [];
const titleRegex = /title="([^"]+)"/g;
while ((match = titleRegex.exec(html)) !== null) {
  titles.push(match[1]);
}

console.log('Unique aria-labels:', [...new Set(ariaLabels)]);
console.log('Unique buttons text:', [...new Set(buttons)]);
console.log('Unique titles:', [...new Set(titles)]);
