import fs from 'fs';

const navHtml = fs.readFileSync('work/analysis/signed_in/workspace_settings_nav_outer.html', 'utf8');

// Print first 5 items
const items = [...navHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(m => m[0]);
console.log('Total li items in settings nav:', items.length);
items.slice(0, 5).forEach((item, i) => {
  console.log(`\n--- Item ${i} ---`);
  console.log(item.slice(0, 300));
});
