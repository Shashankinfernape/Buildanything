import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/live_nav_outer.html', 'utf8');

const items = ['Import', 'Library', 'Routines', 'Integrations', 'Security', 'More'];
for (const it of items) {
  const textIdx = navHtml.indexOf(`>${it}<`);
  if (textIdx !== -1) {
    // Find the enclosing <a> or <button>
    const btnStart = navHtml.lastIndexOf('<', textIdx - 50);
    const fullStart = navHtml.lastIndexOf('<a', textIdx) !== -1 && navHtml.lastIndexOf('<a', textIdx) > navHtml.lastIndexOf('<button', textIdx)
      ? navHtml.lastIndexOf('<a', textIdx)
      : navHtml.lastIndexOf('<button', textIdx);
    const fullEnd = navHtml.indexOf('>', textIdx) + 1;
    const endTag = navHtml.slice(fullStart, textIdx + 100);
    const svgMatch = endTag.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
    console.log(`[${it}] SVG:`, svgMatch ? svgMatch[0] : 'not found');
  }
}
