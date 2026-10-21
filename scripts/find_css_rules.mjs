import fs from 'fs';
import path from 'path';

const CSS_DIR = path.resolve('work/target_artifacts/replit/css');
const cssFiles = fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css'));

// Read header snapshot classes
const headerHtml = fs.readFileSync('work/analysis/section1-header-snapshot.html', 'utf8');

const classMatches = headerHtml.match(/class="([^"]+)"/g) || [];
const uniqueClasses = new Set();
for (const cm of classMatches) {
  const clsStr = cm.slice(7, -1);
  clsStr.split(/\s+/).forEach(c => {
    if (c.trim()) uniqueClasses.add(c.trim());
  });
}

console.log(`Found ${uniqueClasses.size} unique classes in <header> snapshot.`);

const cssContents = cssFiles.map(file => ({
  file,
  content: fs.readFileSync(path.join(CSS_DIR, file), 'utf8')
}));

const classLocations = [];

for (const cls of uniqueClasses) {
  // Escape for regex
  const escaped = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match selector containing .cls
  const regex = new RegExp(`\\.${escaped}(?=[\\s,.:>~+{\\[]|$)`, 'g');
  
  let found = false;
  for (const { file, content } of cssContents) {
    let m;
    while ((m = regex.exec(content)) !== null) {
      // Find start and end of rule block
      const ruleStart = Math.max(0, m.index - 20);
      const openBrace = content.indexOf('{', m.index);
      const closeBrace = content.indexOf('}', openBrace);
      if (openBrace !== -1 && closeBrace !== -1 && openBrace - m.index < 200) {
        const selector = content.slice(ruleStart, openBrace).trim();
        const body = content.slice(openBrace, closeBrace + 1).trim();
        classLocations.push({
          className: cls,
          file,
          byteOffset: m.index,
          rule: `${selector} ${body}`.slice(0, 140)
        });
        found = true;
        break;
      }
    }
    if (found) break;
  }
}

console.log(`Matched ${classLocations.length} / ${uniqueClasses.size} classes in saved CSS.`);
fs.writeFileSync('work/analysis/header-class-rules.json', JSON.stringify(classLocations, null, 2), 'utf8');
console.log('Sample matched class rules:');
classLocations.slice(0, 15).forEach(c => {
  console.log(`- .${c.className} -> ${c.file} (offset ${c.byteOffset}): ${c.rule.slice(0, 80)}...`);
});
