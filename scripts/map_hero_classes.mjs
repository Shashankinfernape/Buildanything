import fs from 'fs';

const heroHtml = fs.readFileSync('work/analysis/section2-hero-snapshot.html', 'utf8');
const css = fs.readFileSync('work/target_artifacts/replit/css/20vunzhr_pfbh.css', 'utf8');

const classMatches = Array.from(heroHtml.matchAll(/class="([^"]+)"/g)).flatMap(m => m[1].split(/\s+/));
const uniqueClasses = Array.from(new Set(classMatches)).filter(Boolean);

console.log('Total unique classes in Hero:', uniqueClasses.length);

const rules = [];
const missing = [];

for (const cls of uniqueClasses) {
  // Look for .cls or .\[cls\] in css
  const escaped = cls.replace(/[[\]()#%&;:,/]/g, '\\$&');
  const searchPattern = '.' + cls;
  let idx = css.indexOf(searchPattern);
  if (idx === -1) {
    // Try without prefix or escaped
    idx = css.indexOf(cls);
  }
  if (idx !== -1) {
    rules.push({
      class: cls,
      offset: idx,
      snippet: css.slice(Math.max(0, idx - 10), idx + 60)
    });
  } else {
    missing.push(cls);
  }
}

console.log('Matched in saved CSS:', rules.length);
console.log('Missing in saved CSS:', missing.length, missing.slice(0, 10));

fs.writeFileSync('work/analysis/hero-class-rules.json', JSON.stringify({ matchedCount: rules.length, missingCount: missing.length, rules, missing }, null, 2), 'utf8');
console.log('Saved hero-class-rules.json');
