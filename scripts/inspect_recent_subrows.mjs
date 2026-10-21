import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/live_nav_outer.html', 'utf8');

const recentIdx = navHtml.indexOf('Collapse Recent');
const upgradeIdx = navHtml.indexOf('Upgrade your plan');

if (recentIdx !== -1 && upgradeIdx !== -1) {
  const recentSection = navHtml.slice(recentIdx, upgradeIdx);
  console.log('=== Recent Section Length:', recentSection.length);
  // Match links and buttons
  const rows = [...recentSection.matchAll(/<(?:a|button)[^>]*>([\s\S]*?)<\/(?:a|button)>/g)].map(m => {
    return {
      tag: m[0].startsWith('<a') ? 'a' : 'button',
      text: m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      aria: m[0].match(/aria-label="([^"]+)"/)?.[1]
    };
  }).filter(r => r.text || r.aria);

  console.log(JSON.stringify(rows.slice(0, 16), null, 2));
}
