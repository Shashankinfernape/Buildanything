import fs from 'fs';
import path from 'path';

function escapeCssClass(className) {
  // In CSS, characters like [ ] ( ) # : , . / % etc are preceded by backslash
  return className.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
}

const html = fs.readFileSync('work/analysis/section6-testimonials-live-dom.html', 'utf8');
const classRegex = /class="([^"]+)"/g;
const rawClasses = new Set();
let match;
while ((match = classRegex.exec(html)) !== null) {
  const parts = match[1].split(/\s+/).filter(Boolean);
  for (const p of parts) {
    // Decode html entities like &lt; -> <, &gt; -> >, &amp; -> &
    const decoded = p
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');
    rawClasses.add(decoded);
  }
}

console.log('Total unique classes in section 6 live DOM:', rawClasses.size);

const cssDir = 'work/reconstruction/public/css';
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
const cssContents = cssFiles.map(f => ({ name: f, content: fs.readFileSync(path.join(cssDir, f), 'utf8') }));

const missing = [];
const found = [];

for (const cls of rawClasses) {
  const escaped = escapeCssClass(cls);
  let isFound = false;
  for (const c of cssContents) {
    if (c.content.includes(escaped) || c.content.includes(cls)) {
      isFound = true;
      found.push(cls);
      break;
    }
  }
  if (!isFound) {
    missing.push(cls);
  }
}

console.log('Found in saved CSS:', found.length);
console.log('Missing from saved CSS:', missing.length);
if (missing.length > 0) {
  console.log('Missing classes:', missing);
}
