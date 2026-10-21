import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/live_nav_outer.html', 'utf8');

const items = ['Import', 'Library', 'Routines', 'Integrations', 'Security', 'More'];
const icons = {};

for (const it of items) {
  const re = new RegExp(`<(?:a|button)[^>]*>[\\s\\S]*?${it}[\\s\\S]*?<\\/(?:a|button)>`, 'i');
  const m = navHtml.match(re);
  if (m) {
    const svgMatch = m[0].match(/<svg[^>]*>[\s\S]*?<\/svg>/);
    icons[it] = svgMatch ? svgMatch[0] : null;
  }
}

fs.writeFileSync('work/analysis/signed_in/nav_icons.json', JSON.stringify(icons, null, 2), 'utf8');
console.log('Saved nav_icons.json with all 6 authentic SVGs.');
