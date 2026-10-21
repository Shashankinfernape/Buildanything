import fs from 'fs';

const data = JSON.parse(fs.readFileSync('work/analysis/recovered-nav-data.json', 'utf8'));

console.log('--- Recovered Header Primary Navigation ---');
const primary = data.header.primaryNavigation;
console.log('Primary count:', primary.length);

for (const item of primary) {
  console.log(`\nMenu Title: [${item.title || item.linkText || item.text}] (type: ${item._type})`);
  if (item.linkGroups) {
    for (const grp of item.linkGroups) {
      console.log(`  Group: [${grp.title || grp.sectionTitle || 'unnamed'}]`);
      if (grp.links) {
        for (const l of grp.links) {
          console.log(`    - ${l.text || l.linkText} (${l.link || l.internalLink})`);
        }
      }
    }
  } else if (item.links) {
    for (const l of item.links) {
      console.log(`    - ${l.text || l.linkText} (${l.link || l.internalLink})`);
    }
  } else {
    console.log(`    Direct link: ${item.link || item.internalLink}`);
  }
}
