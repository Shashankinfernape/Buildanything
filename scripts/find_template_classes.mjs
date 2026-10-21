import fs from 'fs';

let html = fs.readFileSync('work/analysis/section4-templates-live-dom.html', 'utf8');
html = html.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');

const classMatches = html.matchAll(/class="([^"]+)"/g);
const classSet = new Set();
for (const match of classMatches) {
  const parts = match[1].split(/\s+/).filter(Boolean);
  for (const p of parts) {
    classSet.add(p);
  }
}

console.log('Total unique classes in Templates live DOM:', classSet.size);

const cssFiles = [
  'work/reconstruction/public/css/20vunzhr_pfbh.css',
  'work/reconstruction/public/css/2crx7tcomwfu9.css',
  'work/reconstruction/public/css/3gc71r1qd881c.css',
  'work/reconstruction/public/css/3yw_f5s0f08l2.css',
  'work/reconstruction/public/css/0bi9igdhgedn-.css'
];

const cssData = cssFiles.map(path => ({
  path,
  content: fs.readFileSync(path, 'utf8')
}));

function escapeCssClass(className) {
  return className
    .replace(/\\/g, '\\\\')
    .replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g, '\\$1');
}

const classCoverage = {};
const missingClasses = [];

for (const cls of Array.from(classSet).sort()) {
  let found = false;
  const escaped = escapeCssClass(cls);

  for (const file of cssData) {
    const idx = file.content.indexOf('.' + escaped);
    if (idx !== -1) {
      const snippet = file.content.slice(idx, idx + 80);
      classCoverage[cls] = {
        file: file.path.split('/').pop().split('\\').pop(),
        offset: idx,
        snippet: snippet.split('}')[0] + '}'
      };
      found = true;
      break;
    }
  }

  if (!found) {
    missingClasses.push(cls);
  }
}

console.log('Covered classes:', Object.keys(classCoverage).length);
console.log('Uncovered classes:', missingClasses.length);
if (missingClasses.length > 0) {
  console.log('Uncovered samples:', missingClasses);
}

fs.writeFileSync('work/analysis/templates-class-rules.json', JSON.stringify({
  total: classSet.size,
  coveredCount: Object.keys(classCoverage).length,
  uncoveredCount: missingClasses.length,
  covered: classCoverage,
  uncovered: missingClasses
}, null, 2), 'utf8');

console.log('Saved report to work/analysis/templates-class-rules.json');
