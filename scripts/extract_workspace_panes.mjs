import fs from 'fs';

const html = fs.readFileSync('work/analysis/signed_in/workspace_main_outer.html', 'utf8');

// Find tab panels
const panels = [...html.matchAll(/<div[^>]*role="tabpanel"[^>]*>([\s\S]*?)<\/div>/g)];
console.log('Panels found:', panels.length);

// Let's inspect the two tab bars
const tabBars = [...html.matchAll(/<div[^>]*data-tab-bar="true"[^>]*>([\s\S]*?)<\/div>/g)];
console.log('Tab bars count:', tabBars.length);
tabBars.forEach((tb, i) => {
  console.log(`\n--- Tab Bar ${i} ---`);
  console.log(tb[0].slice(0, 400));
});
