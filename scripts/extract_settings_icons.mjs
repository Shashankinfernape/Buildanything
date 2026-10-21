import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/workspace_settings_nav_outer.html', 'utf8');

const linkRegex = /<a[^>]+href=([^\s>]+)[^>]*>([\s\S]*?)<\/a>/g;
let m;
const icons = {};
while ((m = linkRegex.exec(navHtml)) !== null) {
  const href = m[1];
  const inner = m[2];
  const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const svg = inner.match(/<svg[\s\S]*?<\/svg>/);
  if (svg) {
    icons[text] = {
      href,
      svg: svg[0]
    };
  }
}
fs.writeFileSync('work/analysis/signed_in/settings_icons.json', JSON.stringify(icons, null, 2));
console.log('Extracted icons for:', Object.keys(icons));
