import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/live_nav_outer.html', 'utf8');

const upgradeIdx = navHtml.indexOf('Upgrade your plan');
if (upgradeIdx !== -1) {
  const lowerSection = navHtml.slice(upgradeIdx - 100);
  console.log('=== Lower Sidebar Full Structure ===');
  // Extract visible texts
  const items = [...lowerSection.matchAll(/<(?:span|div|a|button)[^>]*>([^<]+)<\/(?:span|div|a|button)>/g)].map(m => m[1].trim()).filter(Boolean);
  console.log(items);
}
