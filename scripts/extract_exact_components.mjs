import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/live_nav_outer.html', 'utf8');
const mainHtml = fs.readFileSync('work/analysis/signed_in/live_main_outer.html', 'utf8');

// 1. Wide New button
const newBtnMatch = navHtml.match(/<a[^>]*href="[^"]*create[^"]*"[^>]*>[\s\S]*?<\/a>/i) || navHtml.match(/<a[^>]*>[\s\S]*?New[\s\S]*?<\/a>/i);
if (newBtnMatch) {
  console.log('=== Wide New Button ===\n', newBtnMatch[0], '\n');
}

// 2. Nav items: Import, Library, Routines, Integrations, Security, More
console.log('=== Nav Rows ===');
for (const item of ['Import', 'Library', 'Routines', 'Integrations', 'Security', 'More']) {
  const re = new RegExp(`<(?:a|button)[^>]*>[\\s\\S]*?${item}[\\s\\S]*?<\\/(?:a|button)>`, 'i');
  const m = navHtml.match(re);
  if (m) console.log(`[${item}]:`, m[0].slice(0, 150), '...');
}

// 3. Upgrade your plan card & Learn more & user row
console.log('\n=== Lower Sidebar ===');
const upgradeIdx = navHtml.indexOf('Upgrade your plan');
if (upgradeIdx !== -1) {
  console.log('Upgrade card snippet:\n', navHtml.slice(upgradeIdx - 200, upgradeIdx + 400));
}

// 4. Recent projects cards with lock icon
console.log('\n=== Recent Projects Cards ===');
const recentCardsIdx = mainHtml.indexOf('Recent projects');
if (recentCardsIdx !== -1) {
  console.log(mainHtml.slice(recentCardsIdx - 100, recentCardsIdx + 1200));
}

// 5. Three suggestion chips
console.log('\n=== Suggestion Chips ===');
for (const chip of ['Help me get things done', 'Find emails needing my reply', 'Turn my notes into a slide deck']) {
  const chipIdx = mainHtml.indexOf(chip);
  if (chipIdx !== -1) {
    console.log(`[${chip}]:`, mainHtml.slice(chipIdx - 150, chipIdx + 200));
  }
}

// 6. Prompt box controls
console.log('\n=== Prompt Box Controls ===');
const promptBoxIdx = mainHtml.indexOf('aria-label="Add attachment"');
if (promptBoxIdx !== -1) {
  console.log(mainHtml.slice(promptBoxIdx - 200, promptBoxIdx + 1500));
}
