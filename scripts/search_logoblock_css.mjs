import fs from 'fs';
import path from 'path';

const cssDir = 'work/reconstruction/public/css';
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

for (const f of cssFiles) {
  const content = fs.readFileSync(path.join(cssDir, f), 'utf8');
  if (content.includes('LogoBlock') || content.includes('Fd2UBW')) {
    console.log(`Found in ${f}:`);
    const idx = content.indexOf('Fd2UBW');
    console.log(content.slice(Math.max(0, idx - 200), idx + 600));
  }
}
