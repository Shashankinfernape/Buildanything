import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/live_nav_outer.html', 'utf8');

// Find the nav container between "New" and "Recent"
const newIdx = navHtml.indexOf('>New<');
const recentIdx = navHtml.indexOf('Collapse Recent');

if (newIdx !== -1 && recentIdx !== -1) {
  const navSection = navHtml.slice(newIdx, recentIdx);
  console.log('=== Nav links section between New and Recent ===');
  const items = [...navSection.matchAll(/<(?:a|button)[^>]*>([\s\S]*?)<\/(?:a|button)>/g)].map(m => {
    return {
      tag: m[0].startsWith('<a') ? 'a' : 'button',
      fullTag: m[0].match(/<[^>]+>/)[0],
      text: m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      svg: m[1].match(/<svg[^>]*>[\s\S]*?<\/svg>/)?.[0]
    };
  });
  console.log(JSON.stringify(items.map(i => ({ tag: i.tag, text: i.text, hasSvg: !!i.svg })), null, 2));
}
