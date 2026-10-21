import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/live_nav_outer.html', 'utf8');

const upgradeIdx = navHtml.indexOf('Upgrade your plan');
if (upgradeIdx !== -1) {
  console.log('=== Lower Sidebar Complete HTML ===');
  console.log(navHtml.slice(upgradeIdx - 400));
}
