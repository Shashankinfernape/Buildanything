import fs from 'fs';

const content = fs.readFileSync('work/recovered-modules-combined/21it80ntm9t-l__module-994661.js', 'utf8');

// It exports JSON.parse('...')
const rawStr = content.slice(content.indexOf("'") + 1, content.lastIndexOf("'"));
const parsed = JSON.parse(rawStr.replace(/\\'/g, "'"));

console.log('Top keys:', Object.keys(parsed));
for (const key of Object.keys(parsed)) {
  console.log(`Key [${key}]:`, JSON.stringify(parsed[key]).slice(0, 150));
}

fs.writeFileSync('work/analysis/recovered-nav-data.json', JSON.stringify(parsed, null, 2), 'utf8');
console.log('Wrote work/analysis/recovered-nav-data.json');
